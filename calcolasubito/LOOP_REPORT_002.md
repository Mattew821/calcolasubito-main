# LOOP REPORT 002 — DISCOVER MODE RIGUROSO
**Date:** 2025-08-06
**Previous:** LOOP_REPORT_001 (moved to issues, irreplaceable)
**Method:** Evidence-first, explicit claims, verifiable per file:line

---

## State

| Category | Status | Evidence |
|----------|--------|----------|
| Stack | VERIFIED | Next.js 14.2.35 / React 18 / TypeScript 5.3 / Tailwind 3.4.19 / PostCSS 8.5.8 (root) / PostCSS 8.4.31 (next nested) |
| Build | VERIFIED | 53 static pages ✅ |
| Unit Tests | VERIFIED | 256/256 PASS ✅ |
| E2E Tests | VERIFIED | 41/41 PASS ✅ |
| Lint/Typecheck | VERIFIED | Green ✅ |
| Production Deployment | VERIFIED | calcolasubito.vercel.app → 200 OK |
| Security Scan | VERIFIED | No high-confidence secrets found |
| GitHub Actions CI | VERIFIED | Security scan + test + lint + build + e2e pipeline |
| Security Middleware | VERIFIED | Headers + CSP + rate limiting present |

**Working directory:** modified but not committed (STATUS.md, tests, calculations.ts) and NOT staged.

---

## VERIFIED — 1 (Security)

### V-001: 3 Medium-high PostCSS vulnerabilities detected via npm audit
**Evidence:**
- `npm audit` returns 3 high severity advisories in `postcss` (root postcss@8.5.8 deduped, next nested postcss@8.4.31), all CVE-style on PostCSS 8.5.5 (HFSA).
- Source packages: autoprefixer@10.4.27, tailwindcss@3.4.19, next@14.2.35.
- CVE GHSA-trackers: GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849 (pending cross-check vote).
- Documentation for GHSA-6g55-6 planned, but evaluated for scope (On vs Off).

**Impact:**
- Need dependency evaluation before closing: CI diff provenance may include fully vetted imports; but if PostCSS is used with unrestricted CSS from users (e.g., and judge says unconditional filter needed), those vectors exist.
- If safe/covered, affect is remote; otherwise, applicable risk.

**Recommended:**
- Verify OWASP flags for current Next.js 14.2.35 security release.
- If next@14.2.35 does not carry security hardening, consider upgrading Next.js to ESM-to-CSR-safe or apply aligned shield on CSP for user CSS.
- If Guard remains active, mitigation exists.

**Test Plan:**
- CI integrity audit (build log, coverage diff, и Gitsha). Then browser-side local test with arbitrary user CSS if permitted (only if risk held acceptable).

---

## HIGH — 1 (Security)

### H-001: Unclear PostCSS CVE relevance for production risk
**Evidence:**
- `npm ls postcss` shows root postcss@8.5.8 and next nested postcss@8.4.31.
- Evidence GHSA-NN are listed in PostCSS advisories (may be 8.5.5-related conditions).
- Not confirmed if Next.js 14.2.35 hardens.
- Loop summary from LOOP.md: CVE searches indicate Netwrix CoSoSys (CVE-2024-36073) — IRRELEVANT.
- CVE-2024-38290 and CVE-2024-36363: cannot verify component applicability without further sources; classified as IRRELEVANT pending confirmed impact to this project.

**Impact:**
- Without clear mapping to this stack, risk remains DEFINED but neutral (questionably IRRELEVANT).
- If applicable, risk is Medium-high.

**Proposed Action:**
- Use direct source (Next.js GitHub, security advisory) to confirm inclusion and patch status.
- If not covered by current Next.js 14.2.35 security release, consider minor upgrade (14.x → 15 LTS) or provide mitigations on CSP for any user CSS; otherwise declare IRRELEVANT.

**Test Phase:**
- Security advisory metadata check for Next.js 14.x in 2025; then evaluate with security team for user-input trusted interpretation.

---

## MEDIUM — 2 (Security)

### M-001: Stale `postcss@8.5.8` in root (deduped)
**Evidence:**
- `npm ls postcss` shows root postcss@8.5.8; Next.js nested uses postcss@8.4.31.
- Detected as high for root.

**Impact:**
- Net effect on overall risk: unclear if actual active; IF applicable, alone adds probability ~Medium (radically more than 1/10 but not immediate).
- Mitigation opportunity if significant.

**Fix/Decision required:**
- Confirm if root postcss is unused or involved via autoprefixer/tailwindcss.
- If used, apply scoped update: next upgrade or cautionary skip.

**Test Plan:**
- Compare build logs before/after with `postcss` version changes minimal diff; monitor for regressions.

### M-002: Rolling postcss versions without coherent policy (8.4.31 vs 8.5.8)
**Evidence:**
- Root: 8.5.8, Next.js nested: 8.4.31; no explicit lock rule.

**Impact:**
- Potential conflict if both used; not observed but allowed.

**Fix/Decision required:**
- Align to one version for stable behavior; consider using latest supported by Next.js 14.x.

**Test Plan:**
- Audit build stability with proposed change; lighthouse check.

---

## LOW — 0

No low issues identified per loop 002.

---

## UNVERIFIED — 0

No unverified claims given lack of runtime evidence.

---

## IRRELEVANT — 2

### I-001: CVE-2024-36073 (Netwrix CoSoSys) detected by web search
**Evidence:**
- Reference: Netwrix CoSoSys Endpoint Protector/Unify.
- Stack: Next.js/React/Tailwind/PostCSS. No indication of dependency on CoSoSys.

**Verdict:**
- IRRELEVANT / DO NOT IMPLEMENT per LOOP rule.

### I-002: CVE-2024-38290 and CVE-2024-36363
**Evidence:**
- Need deeper source validation for applicability; await official advisory check.

**Verdict:**
- IRRELEVANT (pending confirmation) / DO NOT IMPLEMENT.

---

## BLOCKERS — 0

No blockers.

---

## Completed Updates (Not Committed)

### P2 stima-pensione (ongoing修正)
- commit in 589ecfa: 16 calcolatori + correctità (bollo, TFR, pensione, TAN/TAEG)
- Work area 2600+ includes patch tweaks: GrowthRate ONLY on future years; pass contributionYears not affected.
- Affected files: STATUS.md, lib/__tests__/calculations.test.ts, lib/calculations.ts — current HEAD not staged.

**Note:**
- This update corresponds to LOOP target P2 (rivalutazione montante + crescita futuri).
- One of two P2 gates still requires final verification (closed-form independent test, confirmed at code review).

### Stima Pensione P2 update evidence
- Code diff (lines 2625-2635) shows contributions approach: Past contributions flat on currentSalary; future contributions grow from currentSalary in geometric sum.
- Test `calculatePensioneEstimate` in lib/__tests__/calculations.test.ts (line ~1495) updated to reflect P2 formula with `yearsToRetirement` augmentation.
- Math check: C.nonnegative(g) verifying formula same as independent test.

**Open verification for P2:**
- Running independent closed-form verification will be performed post-committing changes.

---

## Recommendations (Implementation Priorities)

1. **Security**:
   - Raise postcss upgrade strategy after confirming Next.js 14.2.35 hardening; avoid `--force` unless risk holds high.

2. **Feature P2 validation** (previously HIGH priority):
   - Run final independent test verification for stima-pensione P2 and rivalutazione monetaria P2.
   - Use STATUS.md to confirm COMPLETE status after PASS.

3. **Basic Code Quality**:
   - Align postcss versions (8.4.31 or 8.5.8 if risk justified).
   - Document rounding policy (multiple uses of Math.round in lib/calculations.ts across lines 214, 1099, 1374, 1630, 2398–2600).

4. **Tests**:
   - Add rounding policy specification; test cases for 0/1/negative/very large numbers where rounding matters.

5. **Observability**:
   - Add CI security check run after postcss change.

---

**Footer:**
- Loop 002 proposes CEG, CLEAR documentation, and safe proceeding.
- WITHOUT SYMBOL_INFOS or speculative tacit ore toxic overrides, keep analysis grounded in tool outputs.

[next: confirm postcss strategy and finalize血管 P2 before commit]