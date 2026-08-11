# LOOP REPORT — CALCOLASUBITO v3
**Loop:** 1/1 — DISCOVER MODE (READ_ONLY)
**Date:** 2025-08-06
**Format:** Per rule #21 — Compact markdown with classification

---

## PROJECT MAP

```
calcolasubito/
├── app/                          # Next.js 14 App Router (53 static pages)
│   ├── (43 calculator routes)    # Each with page.tsx + layout.tsx (metadata + JSON-LD)
│   ├── api/v1/                   # Placeholder API routes
│   ├── layout.tsx                # Root layout: fonts, providers, GA, AdSense, global JSON-LD
│   ├── page.tsx                  # Homepage: search, categories, calculator catalog
│   ├── sitemap.ts                # Dynamic sitemap from CALCULATOR_CATALOG
│   └── robots.ts                 # Robots.txt generation
├── lib/
│   ├── calculations.ts           # 2900 lines — ALL calculation logic (40+ functions)
│   ├── calculator-catalog.ts     # Centralized calculator metadata (id, category, popularity)
│   ├── security/                 # request-guard.ts, rate-limiter.ts
│   ├── site-config.ts            # BASE_URL, constants
│   └── i18n.ts                   # Language/theme constants
├── components/
│   ├── AdUnit.tsx                # AdSense integration
│   ├── GoogleAnalytics.tsx       # GA4 with gtag
│   ├── Header.tsx / Footer.tsx   # Navigation, theme toggle, language
│   └── AppPreferencesProvider.tsx
├── middleware.ts                 # Security: CSP, rate-limit, request-guard, canonical host
├── e2e/calculators.spec.ts       # 41 E2E tests (routing, canonical, basic UX)
├── lib/__tests__/                # 256 unit tests across 8 test files
├── .github/workflows/            # CI: verify (test+lint+build+e2e) + current-sync
└── package.json                  # Next 14.2.35, React 18, TS 5.3, Tailwind 3.4
```

---

## VERIFIED STACK

| Component | Version | Status |
|-----------|---------|--------|
| Next.js | 14.2.35 | VERIFIED |
| React | 18.3.0 | VERIFIED |
| TypeScript | 5.3.0 | VERIFIED |
| Tailwind CSS | 3.4.19 | VERIFIED |
| PostCSS (root) | 8.5.8 | VERIFIED |
| PostCSS (next nested) | 8.4.31 | VERIFIED |
| Jest | 30.3.0 | VERIFIED |
| Playwright | 1.62.1 | VERIFIED |
| ESLint | 8.55.0 | VERIFIED |

---

## CALCULATOR INVENTORY (43 calculators)

**Finanza (12):** bollo-auto, calcolo-tfr, calcolo-imu, busta-paga-netta, rata-mutuo, rata-prestito, rata-leasing, tan-taeg, interesse-semplice, interesse-composto, rivalutazione-monetaria, stima-pensione
**Fisco (2):** codice-fiscale, scorporo-iva
**Matematica (10):** percentuali, aumento-percentuale, sconto-percentuale, giorni-tra-date, media-ponderata, media-voti, regola-del-tre, teorema-pitagora, area-cerchio, area-rettangolo, area-triangolo, area-trapezio, volume-cilindro, volume-cono, volume-parallelepipedo, volume-sfera, conversione-temperatura, convertitore-unita-lunghezza, numeri-casuali, cifrario-enigma
**Salute (4):** indice-massa-corporea, fabbisogno-calorico, metabolismo-basale, calcolo-eta
**Utilità (3):** calcolo-mancia, consumo-carburante, quote-dashboard

---

## ROUTE INVENTORY

- All 43 calculator routes: `/calculator-id` → `app/calculator-id/page.tsx` + `layout.tsx`
- Static: `/`, `/about`, `/privacy`, `/cookie`
- API: `/api/v1/*` (placeholder)
- Sitemap: `/sitemap.xml` (auto-generated from catalog)
- Robots: `/robots.txt` (auto-generated)
- Metadata: Each route has layout.tsx with metadata + JSON-LD FAQPage schema

---

## VERIFIED FINDINGS

### V-001: Build & Test Green
**Evidence:** `npm run build` → 53 static pages ✅; `npm test` → 256/256 PASS ✅; `npx playwright test` → 41/41 PASS ✅; `npm run lint` → 0 errors ✅; `tsc --noEmit` → PASS ✅

### V-002: Production Live & Validated
**Evidence:** `curl -I https://calcolasubito.vercel.app` → 200 OK; security probes `/wp-admin` → 403, SQL injection → 403; CSP active, rate-limiting active

### V-003: Security Middleware Complete
**Evidence:** `middleware.ts` lines 1-300: CSP (AdSense compatible), rate limiting (burst + sustained), request-guard (blocked methods, paths, query patterns, user-agents), canonical host redirect

### V-004: JSON-LD FAQPage Schema on Key Routes
**Evidence:** `app/percentuali|giorni-tra-date|scorporo-iva|codice-fiscale|rata-mutuo|layout.tsx` all contain `@type: 'FAQPage'` with structured Q&A

### V-005: Centralized Calculator Catalog
**Evidence:** `lib/calculator-catalog.ts` drives homepage categories, sitemap priorities, and route generation

### V-006: Accessibility Basics Present
**Evidence:** Semantic `<label htmlFor>`, `role="status" aria-live="polite"`, `role="alert"`, focus-visible styles in globals.css, skip-link in Header

### V-007: External Services Documented
**Evidence:** GA4 (GTM), AdSense (ca-pub-4449622526771169), CSP allows both — all declared in middleware and components

### V-008: CI Pipeline Complete
**Evidence:** `.github/workflows/ci.yml`: security-scan → test → lint → build → e2e; `.github/workflows/current-sync.yml`: auto-updates CURRENT.md on push

---

## UNVERIFIED CLAIMS

### U-001: PostCSS Vulnerability Exposure
**Claim:** 3 high-severity npm audit findings in postcss (GHSA-qx2v, GHSA-6g55, GHSA-r28c)
**Status:** UNVERIFIED — root postcss@8.5.8 (deduped from autoprefixer/tailwind) and next@14.2.35 nested postcss@8.4.31; unclear if exploitable via user CSS input (none in this project). Requires Next.js security advisory check.

### U-002: CVE-2024-36073 / CVE-2024-38290 / CVE-2024-36363 Relevance
**Claim:** Listed in LOOP.md as leads
**Status:** UNVERIFIED → CVE-2024-36073 maps to Netwrix CoSoSys (IRRELEVANT); CVE-2024-38290/36363 need source confirmation

### U-003: WCAG 2.1 AA Full Compliance
**Claim:** "WCAG AA color token system" in commit ccd92c7
**Status:** UNVERIFIED — color tokens verified, but full AA audit (contrast ratios, keyboard traps, focus order, screen reader) not measured

### U-004: TBT ≤ 600ms Target
**Claim:** LOOP.md target
**Status:** UNVERIFIED — no Lighthouse CI or production RUM data captured

### U-005: P2 Stima Pensione Correction Complete
**Claim:** STATUS.md shows "implementare e verificare correzioni numeriche P2"
**Status:** PARTIAL — Working changes in progress (git diff shows modified formulas & tests); NOT yet committed or status-updated

### U-006: Rivalutazione Monetaria Monthly Rate Correction
**Claim:** STATUS.md target "tasso mensile esatto (1+r)^(1/12)−1"
**Status:** UNVERIFIED — current code uses `inflationRate / 100 / 12` (simple division), not exact monthly compounding

---

## CONTRADICTIONS

### C-001: STATUS.md vs Git Diff
**STATUS.md:** "LOOP_STATE: GOAL_LOCKED" + "CURRENT_GATE: aggiornare stima-pensione + rivalutazione monetaria P2"
**Git diff:** Shows active modifications to both `calculatePensioneEstimate` and test — but NOT committed, status not updated
**Verdict:** Work in progress, status out of sync

### C-002: Percentage Rounding Policy
**Code:** Mixed — some functions use `Math.round(x*100)/100`, others return raw floats; UI uses `.toFixed(2)` for display
**LOOP.md:** "Rounding ≠ truncation" — but no centralized policy documented
**Verdict:** Inconsistent implementation vs documented principle

---

## IRRELEVANT INPUTS

| Input | Check | Verdict |
|-------|-------|---------|
| "Heyoi" / House Renting | `grep -r` across repo | **IRRELEVANT** — no matches |
| RS485IRT / Rx1 / 0bXXXXRR | `grep -r` | **IRRELEVANT** — no matches |
| FSRI / Halteggia | `grep -r` | **IRRELEVANT** — no matches |
| waveguides | `grep -r` | **IRRELEVANT** — no matches |
| CVE-2024-36073 | NVD lookup | **IRRELEVANT** — Netwrix endpoint product |

---

## SECURITY FINDINGS

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| S-001 | PostCSS 3 high advisories | MEDIUM | `npm audit` — root@8.5.8, next@8.4.31; needs Next.js security advisory check |
| S-002 | CSP allows 'unsafe-inline' + 'unsafe-eval' | LOW | Required for Next.js 14 + AdSense; mitigated by nonce/hash if upgraded |
| S-003 | AdSense / GA4 client IDs in source | LOW | Public keys only; no secrets in repo (verified by security-scan) |
| S-004 | Rate limiting present but untested | LOW | `middleware.ts` implements; no test for 429 behavior |

---

## ACCESSIBILITY FINDINGS

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| A-001 | Semantic labels + aria-live present | VERIFIED GOOD | 20+ calculator pages with `<label htmlFor>`, `role="status" aria-live="polite"`, `role="alert"` |
| A-002 | Focus styles defined | VERIFIED GOOD | `globals.css` has `:focus-visible` ring |
| A-003 | Skip link present | VERIFIED GOOD | Header.tsx includes skip to main |
| A-004 | Contrast ratios unmeasured | MEDIUM | Color tokens defined (ccd92c7), but no automated contrast audit |
| A-005 | Form error `aria-describedby` missing | MEDIUM | Errors use `role="alert"` but not linked to inputs via `aria-describedby` |

---

## SEO FINDINGS

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| SE-001 | Metadata on all routes | VERIFIED GOOD | Every calculator has layout.tsx with title, description, openGraph, canonical |
| SE-002 | JSON-LD FAQPage on 6+ routes | VERIFIED GOOD | percentuali, giorni-tra-date, scorporo-iva, codice-fiscale, rata-mutuo, quote-dashboard |
| SE-003 | Sitemap.xml auto-generated | VERIFIED GOOD | `sitemap.ts` uses catalog with popularity-based priority |
| SE-004 | Robots.txt auto-generated | VERIFIED GOOD | `robots.ts` allows all, references sitemap |
| SE-005 | JSON-LD FAQPage missing on 37 routes | MEDIUM | Only 6/43 calculators have FAQ schema |

---

## PERFORMANCE FINDINGS

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| P-001 | Build output optimized | VERIFIED GOOD | Next.js 14 static export, `swcMinify: true`, `compress: true`, font `display: swap` |
| P-002 | AdSense + GA third-party scripts | MEDIUM | Blocking potential; CSP allows; no `defer` on AdSense script in layout.tsx |
| P-003 | No Lighthouse CI / RUM | HIGH | TBT ≤ 600ms target (LOOP.md) unmeasured |
| P-004 | Font optimization | VERIFIED GOOD | Manrope + Space Grotesk with `display: swap`, subsets latin |

---

## PRODUCTION FINDINGS

| ID | Finding | Severity | Evidence |
|----|---------|----------|----------|
| PR-001 | Deployment healthy | VERIFIED GOOD | 200 OK, security headers present, CSP active |
| PR-002 | Security probes blocked | VERIFIED GOOD | `/wp-admin` → 403, SQLi → 403, X-Frame-Options: SAMEORIGIN |
| PR-003 | No production error tracking | MEDIUM | No Sentry / error boundary logging observed |
| PR-004 | Current-sync workflow updates docs | VERIFIED GOOD | CURRENT.md auto-updated on push with Vercel status |

---

## HIGH ISSUES

### H-001: Rivalutazione Monetaria — Incorrect Monthly Rate Formula
**Evidence:** `lib/calculations.ts:2568-2575` — `monthlyRate = inflationRate / 100 / 12` (simple division)
**Required:** `(1 + annualRate)^(1/12) - 1` for exact monthly compounding
**File:** `lib/calculations.ts:2570`
**Impact:** Financial incorrectness for monthly inflation calculation
**Reproduction:** Input 12% annual → current: 1% monthly; correct: 0.949% monthly
**Fix:** Replace simple division with exact root formula
**Test:** Add independent closed-form test comparing both formulas

### H-002: P2 Stima Pensione — Uncommitted Corrections
**Evidence:** Git diff shows modified formula (growth only on future years) + updated test; STATUS.md still shows "In Progress"
**File:** `lib/calculations.ts:2625-2640`, `lib/__tests__/calculations.test.ts:1490`, `STATUS.md`
**Impact:** Gate not closed; production may have old formula
**Reproduction:** Compare HEAD vs working tree formula
**Fix:** Commit changes, update STATUS.md to COMPLETED, run full verify
**Test:** Closed-form independent verification already in test (updated)

### H-003: PostCSS Vulnerabilities — Exposure Unclear
**Evidence:** `npm audit` → 3 high in postcss; Next.js 14.2.35 may not include patches
**File:** `package-lock.json` (postcss@8.5.8 root, @8.4.31 nested)
**Impact:** Potential XSS / file read if user CSS processed (none currently)
**Reproduction:** `npm audit` output
**Fix:** Verify Next.js 14.2.35 security status; upgrade or document mitigation
**Test:** Security advisory check + build regression test

---

## MEDIUM ISSUES

### M-001: No Centralized Rounding Policy
**Evidence:** 20+ `Math.round(x*100)/100` in calculations.ts; UI uses `.toFixed(2)`; no utility
**File:** `lib/calculations.ts` (lines 214, 1099, 1374, 1630, 2396-2400, 2451, 2531-2534, 2589-2591, 2667-2668, 2716-2717, 2749, 2783, 2818, 2850, 2894)
**Impact:** Inconsistency risk; hard to audit
**Fix:** Create `lib/rounding.ts` with `round2`, `round4`, `roundMoney`; replace all; add tests

### M-002: JSON-LD FAQPage Missing on 37 Calculator Routes
**Evidence:** Only 6/43 layouts have FAQPage schema
**File:** `app/*/layout.tsx`
**Impact:** Missed rich snippet opportunities
**Fix:** Add FAQPage schema to remaining high-priority calculators (TFR, pensione, bollo, mutuo, prestito, leasing, IMU, BMI, etc.)

### M-004: Form Errors Not Linked via aria-describedby
**Evidence:** Errors use `role="alert"` but inputs lack `aria-describedby` pointing to error
**File:** Multiple `app/*/page.tsx` (e.g., area-trapezio:57)
**Impact:** Screen readers may not associate error with field
**Fix:** Add `id` to error element, `aria-describedby` on input

### M-005: Contrast Ratios Unverified
**Evidence:** Color tokens exist (ccd92c7) but no automated check
**File:** `tailwind.config.ts`, `globals.css`
**Impact:** Potential AA failures
**Fix:** Add `axe-core` or `lighthouse` CI step for contrast

### M-006: No Production Error Tracking
**Evidence:** No Sentry / LogRocket / error boundary logging
**File:** N/A
**Impact:** Blind to production JS errors
**Fix:** Add error boundary + Sentry (free tier) or Vercel Runtime Logs integration

### M-007: AdSense Script Not Deferred
**Evidence:** `app/layout.tsx:170` loads AdSense script without `defer` or `strategy="lazyOnload"`
**File:** `app/layout.tsx:170`
**Impact:** Blocks main thread, hurts TBT
**Fix:** Use Next.js `Script` with `strategy="lazyOnload"`

---

## LOW ISSUES

### L-001: Unused Default Exports in Calculator Pages
**Evidence:** All `page.tsx` use `export default function Page()` but never imported
**Impact:** Minor bundle bloat if not tree-shaken
**Fix:** Remove default export or use named exports consistently

### L-002: Missing JSDoc on Advanced Calculation Functions
**Evidence:** Functions like `calculateLeasingPayment`, `calculateTanTaeg` have minimal comments
**File:** `lib/calculations.ts` (~line 950, 2300)
**Impact:** Maintainability
**Fix:** Add JSDoc with params, returns, formula reference, assumptions, version

### L-003: Stale PROGRESS_TODO.txt (2026-03-26)
**Evidence:** File dated March 2026, claims "100% COMPLETATO" but STATUS.md shows active P2 work
**File:** `PROGRESS_TODO.txt`
**Impact:** Confusion
**Fix:** Archive or update

---

## BLOCKERS

None.

---

## TESTS SUMMARY

| Suite | Command | Result | Coverage |
|-------|---------|--------|----------|
| Unit | `npm test` | 256/256 PASS ✅ | calculations, validations, security, locale, rate-limiter |
| E2E | `npx playwright test` | 41/41 PASS ✅ | Routing, canonical, basic form UX |
| Security | `npm run security:scan` | PASS ✅ | No secrets, no tracked blocked files |
| Lint | `npm run lint` | 0 errors ✅ | All files |
| Typecheck | `tsc --noEmit` | PASS ✅ | All files |
| Build | `npm run build` | 53 pages ✅ | Static generation |

---

## IMPLEMENTATION ORDER

### Phase 1 — Critical Correctness (Priority 1)
1. **H-001** Fix rivalutazione monetaria monthly rate formula + independent test
2. **H-002** Commit P2 stima-pensione corrections + update STATUS.md + verify full

### Phase 2 — Security Hardening (Priority 2)
3. **H-003** Resolve postcss vulnerability status (check Next.js advisory, decide upgrade/mitigate)

### Phase 3 — Quality & Consistency (Priority 4-6)
4. **M-001** Centralize rounding policy + utility + audit all call sites
5. **M-002** Add JSON-LD FAQPage to remaining priority calculators (top 15 by catalog popularity)
6. **M-004** Add `aria-describedby` to form errors
7. **M-007** Defer AdSense script loading

### Phase 4 — Observability & Accessibility (Priority 5)
8. **M-005** Add automated contrast check (axe-core in CI)
9. **M-006** Add production error tracking (Sentry free or Vercel logs)

### Phase 5 — Polish (Priority 8-9)
10. **L-001/002/003** Cleanup exports, JSDoc, archive stale docs

---

## NEXT

**Recommended immediate action:** Execute Phase 1 — both are mathematical correctness issues (Priority 1 per LOOP.md hierarchy).

**Decision gates:**
- None required for H-001/H-002 (technical, reversible, well-defined)
- H-003 requires Next.js security advisory check before deciding upgrade vs document

**Verification required after each:**
- Run `npm test` + `npm run lint` + `npm run build`
- Update `STATUS.md` with evidence
- Commit with conventional message