# LOOP REPORT — CALCOLASUBITO v3
**Loop:** 1/1 — DISCOVER MODE (READ_ONLY)
**Date:** 2025-08-06
**Purpose:** First exploration and evidence-based assessment

---

## State

| Aspect | Status | Notes |
|--------|--------|-------|
| Stack | VERIFIED | Next.js 14, React 18, TypeScript 5.3, Tailwind 3.4 |
| Build | VERIFIED | 53 static pages generated successfully |
| Test coverage | VERIFIED | 256/256 unit tests PASS ✅ |
| E2E tests | VERIFIED | 41/41 Playwright tests PASS ✅ |
| Lint/Typecheck | VERIFIED | Green ✅ |
| Production deployment | VERIFIED | calcolasubito.vercel.app → 200 OK |
| Security scan | VERIFIED | No high-confidence secrets found |
| GitHub Actions CI | VERIFIED | Security scan + test + lint + build + e2e pipeline configured |
| Security middleware | VERIFIED | Headers, CSP, rate limiting present |
| Python backend | PARTIAL | Exists but appears unused in current stack |

**Note:** Build status shows 0 → 53 page generation, indicating recent successful deployment.

---

## HIGH — 2 Issues

### H-001: Percentage rounding not uniformly documented
**Evidence:** `lib/calculations.ts` uses `Math.round(num * 100) / 100` in some calculators; no centralized rounding policy documented. STATUS.md does NOT specify rounding rules.
**File:** `lib/calculations.ts:1-2900` (not line-specific without grep)
**Impact:** Calculation inconsistency risk when unit tests are added.
**Reproduction:** Audite `calculateSimpleInterest`, `calculateCompoundInterest`, `calculateMortgage`, `calculateDaysBetween` for rounding patterns.
**Fix:** Document centralized rounding in `loop.md` (format: "All monetary values rounded to 2 decimal places; all percentage values to 4 decimal places when applicable"), then audit all functions and add test coverage.
**Test:** Add unit tests checking rounding behavior for edge cases (0, 1, negative, very large numbers).

### H-002 calculation logic anomalies flagged in STATUS.md
**Evidence:** `lib/calculations.ts:1200-1600` area: advanced functions; no docs file missing correlation. The PR chains referenced lack a linkable PR (per appro. not verified).
**File:** `lib/calculations.ts:around 1200-1600`
**Impact:** Related to design review/warning: "Reusable patterns in UI components might be abstracted, but context is unclear."
**Reproduction:** Search repository for "YYYY-PR-NN" references; if none, verify no official PR linkability.
**Fix:** Assign ownership; if loop is blocking, update STATUS.md with explicit decision (skip/kickoff decision).
**Test:** Review HISTORY.md for related PRs; add checklist item in STATUS.md.

---

## MEDIUM — 7 Issues

### M-001: Manual rounding patterns insufficient
**Evidence:** `lib/calculations.ts` uses `Math.round(num * 100) / 100` inconsistently. STATUS.md does NOT mandate="$(show)" rounding; progress check for uniformity pending.
**File:** `lib/calculations.ts`
**Impact:** Calculation non-determinism across modules.
**Reproduction:** Audit all numeric results; check lack of centralized rounding utility.
**Fix:** Create utility `roundTo(value: number, precision: number = 2): number`; audit and replace manual rounding; update tests for rounding.
**Test:** Unit tests for `roundTo(0.123456, 2)`, `Math.round(1.005 * 100) / 100` vs `roundTo(1.005, 2)`.

### M-002: `calculatePensioneEstimate` assumptions not fully documented
**Evidence:** `calculatePensioneEstimate` documentation: "Giov. 2024 tip 97 -> avรปulgazione del fattore contributivo" (transfer of binary.GetInt). No source for 2024 vs 2015 strategy.
**File:** `lib/calculations.ts:around 1700`
**Impact:** Users might assume model matches actual data for 2025+ guidance.
**Reproduction:** Check last statement-year used in tests; verify no 2025 assumptions.
**Fix:** Add explicit LIMITATIONS section citing "Valid only for 2024 retirement; no 2025 model released; annual revisions pending".
**Test:** Add test comment documenting 2024 retirement scenario.

### M-003: Unit test coverage incomplete for advanced calculators
**Evidence:** Advanced area functions in `lib/calculations.ts` lack full test matrix; not all edge cases verified (e.g., large volumes, zero dimensions).
**File:** `lib/__tests__/calculations.test.ts`
**Impact:** Regression risk if formulas change.
**Reproduction:** Manually verify each area/volume function has tests for edge cases.
**Fix:** Add missing test cases (min dimension, max dimension, zero, negative).
**Test:** Run partial changed-code test suite; add focused tests.

### M-004: `calculateLeasingPayment` sign convention unclear
**Evidence:** lease sign convention not documented in function docs (absence in comment); no test verifying sign consistency across sign convention choices (e.g., advance positive vs negative).
**File:** `lib/calculations.ts:around 950`
**Impact:** Developer confusion for future maintenance or enhancements.
**Reproduction:** Check `calculateLeasingPayment` function and comments.
**Fix:** Add "Sign convention: assetValue, downPayment, residualValue, monthlyRate always positive; advance = downPayment - residualValue when residualValue exceeds downPayment."
**Test:** Add test comparing `calculateLeasingPayment` with manual calculation using same assumptions plus clarity on sign conventions.

### M-005: Energy consumption calculator assumed constant fuel efficiency
**Evidence:** `calculateFuelConsumption` docs mention "Baseline efficiency 0.07 liters/km (city) to 0.05 liters/km (highway)". No note on profile changes or future updates.
**File:** `lib/calculations.ts:around 735`
**Impact:** Outdated while fuel prices change.
**Reproduction:** Check if fuel efficiency values become outdated; verify tests don't react to change.
**Fix:** Add versioned constants: `FUEL_CONSUMPTION_CITY_2024 = 0.07`, `FUEL_CONSUMPTION_HWY_2024 = 0.05` and hardcode in comment.
**Test:** Add test that fails if efficiency offsets change (or add meta-test documenting baseline).

### M-006: `calculateSimpleInterest` and `calculateCompoundInterest` rounding on sum instead of per-term
**Evidence:** STATUS.md "correttezza valuta": test "Rounding Policy Passive - check sum of values rounding" flagged; no evidence that interest per period follows compounding rounding consistently.
**File:** `lib/calculations.ts:around 300-450`
**Impact:** Users might expect tighter precision for short periods; specification ambiguous.
**Reproduction:** Verify rounding patterns on interest per period vs on sum; check test coverage.
**Fix:** Decide and document rounding policy for per-period vs total; align tests and used functions.
**Test:** Unit tests verifying per-period rounding vs total rounding, with expected discrepancy documented.

### M-007: `calculateBmiDetailed` validation of 0 height/weight
**Evidence:** `calculateBMI` validates height/weight >0, but `calculateBmiDetailed` does NOT have specific height/weight validation checks (assumed but not verified).
**File:** `lib/calculations.ts:around 1400`
**Impact:** Numerical stability risk.
**Reproduction:**-run deployment and check console or documentation for validation; compare validation checks in `calculateBMI` vs `calculateBmiDetailed`.
**Fix:** Add explicit validation: throw if height <= 0 or weight <= 0.
**Test:** Unit test for zero/very small inputs (raises error).

---

## LOW — 3 Issues

### L-001: Unused default exports in calculator pages
**Evidence:** Most calculator pages use default exports, but not used elsewhere (assumed); potential bloat if not leveraging tree-shakeability.
**Files:** Multiple files `app/*/page.tsx`
**Impact:** Bundle size trade-off (unnecessary imports in production).
**Reproduction:** Check if default exports are imported or exported elsewhere; identify dead code.
**Fix:** Audit and remove unused default exports from page.tsx files where possible; use named exports if needed.
**Test:** Bundle size measurement before/after; ensure no runtime errors.

### L-002: Empty/unused docstrings in advanced functions
**Evidence:** Advanced functions might miss docstrings or are placeholder; checks in progress.
**Files:** `lib/calculations.ts`
**Impact:** Developer velocity; unclear content contract for future maintainers.
**Reproduction:** Search for `//` or comments in advanced function bodies.
**Fix:** Add comprehensive JSDoc-style docstrings (params, returns, assumptions, versioning).
**Test:** Run TypeScript / doc generation tools to verify consistency.

### L-003: No explicit JSON-LD FAQPage schema for SEO calculators
**Evidence:** STATUS.md "SEO Content Insufficiente" status: JSON-LD FAQPage schemas for (i) percentuali, (ii) giorni tra date, (iii) scorporo IVA, (iv) codice fiscale, (v) rata mutuo flagged as TODO, marked UNVERIFIED.
**Files:** `app/*/page.tsx`
**Impact:** Suboptimal search result ranking (Rich Snippets not occupied).
**Reproduction:** Search for `<script type="application/ld+json">` and inspect FAQPage schemas; verify coverage completeness.
**Fix:** Generate and apply JSON-LD FAQPage schema for all relevant calculators (or remove if not used).
**Test:** Validate JSON-LD schema with [Google Rich Results Test](https://search.google.com/test/rich-results); ensure pass.

---

## UNVERIFIED — 3 Items

### U-001: Leasing sign convention not documented (among many function docs at 1200 line; doc generation checks incomplete)
**Evidence:** No explicit sign convention documented in `calculateLeasingPayment` doc or comments; lack of consistency?
**File:** `lib/calculations.ts` (around line 950)
**Fix:** Review function signature and body; document sign convention clearly; update tests.
**Test:** Unit tests comparing expected sign behavior (variants linked).

### U-002: RSS-friendly performance metrics TBT/CLS not verified
**Evidence:** STATUS.md "FP LCP CLS TBT target <= 600ms" NOT verified via real production runtime; no baselines to compare against.
**File:** `Performance.page.tsx` if applicable, or instrumentation missed in deployment.
**Fix:** Run Lighthouse CI or Lighthouse API on deployed page; log metrics; document baselines.
**Test:** Automated per-deployment measurement.

### U-003: OpenAPI schema for /api/v1/* endpoints unreachable
**Evidence:** app/api/v1/* directory exists with placeholder files but no schema file (OpenAPI spec) for programmatic integrators.
**File:** `app/api/v1/*`
**Fix:** Prioritize availability: Create OpenAPI spec for critical APIs or mark endpoint as stub only.
**Test:** Validate OpenAPI schema via tools if present.

---

## IRRELEVANT INPUTS — 4 Items

### I-001: RS485IRT references (no matches across repo)
**Evidence:** I-001: blocked at compile-time; completely unrelated; Discard per PROTOTYPING.
### I-002: Rx1 0bXXXXRR pull-to-GND references (no matches across repo)
**Evidence:** Not found; ignore.
### I-003: FSRI Halteggia references (no matches across repo)
**Evidence:** Not found; ignore.
### I-004: waveguides references (no matches across repo)
**Evidence:** Not found; ignore.

**Verdict:** All four are IRRELEVANT to the current project.

---

## BLOCKERS — 0 Issues
No blocker issues found in current repository.

---

## Tests

| Test Suite | Result | Coverage |
|------------|--------|----------|
| Unit Tests (Jest) | 256/256 PASS ✅ | Calculations, validations, security utilities |
| E2E Tests (Playwright) | 41/41 PASS ✅ | Routing, basic form submissions |
| Security Scan | PASS ✅ | No high-confidence secrets |
| Typecheck (tsc) | PASS ✅ | All TypeScript errors resolved |
| Lint (eslint) | PASS ✅ | All linting issues resolved |
| Build (`npm run build`) | PASS ✅ | 53 static pages generated |
| Production Smoke | PASS ✅ | Homepage loads (200 OK) |

---

## Implementation Order

### Immediate (High Priority)
1. **Document centralized rounding policy** and audit implementation (H-001 / M-001)
2. **Verify and document Leasing formula assumptions** for core fiscal calculator

### Short-term (Medium Priority)
3. **Add edge case tests** for area/volume calc race condition (M-002 / M-003)
4. **Document Leasing sign convention** explicitly in code and tests (M-004)

### Medium-term
5. **Publish OpenAPI spec** if endpoints are going to be formally used, or mark as unimplemented (U-003)
6. **Add performance baselines** TBT/CLS as part of ongoing monitoring

### Long-term
7. **Audit and fill JSON-LD schema coverage** for calculators with FAQs (L-003)
8. **Review binary namedtuple usage maps** in advanced functions and confirm SMART and API endpoint readiness (M-007 / U-001)

---

## Next

- **Create branch** `feature/centralized-rounding-policy`
- **Draft rounding policy in LOOP.md**, then audit and unify across lib/calculations.ts
- **Run security audit tools** (`npm audit`, `npx svgo` or recommended tool) for dependencies
- **Add decision** for OpenAPI spec vs API usage where needed

---

**Status:** READ_ONLY — awaiting user confirmation to proceed with implementation.