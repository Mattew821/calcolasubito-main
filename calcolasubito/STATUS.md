# STATUS.md — CALCOLASUBITO v3 Autonomous Engineering & Production QA

## Goal Contract
- PROJECT_GOAL: portale italiano production-ready con ogni calcolatore numericamente corretto, documentato, testato con riferimento indipendente, accessibile, indicizzabile, sicuro e verificato in produzione (LOOP.md Definition of Done)
- CURRENT_GATE_OR_MILESTONE: ✅ COMPLETATO — stima-pensione (rivalutazione montante + crescita futura) e rivalutazione monetaria (tasso mensile esatto)
- LOOP_GOAL: ✅ COMPLETATO — implementate e verificate le correzioni numeriche per stima-pensione P2 e rivalutazione monetaria P2
- DONE_CRITERIA:
  - ✅ stima-pensione: rivalutazione montante applicata, solo anni futuri con crescita, test PASS con closed-form indipendente
  - ✅ rivalutazione monetaria: tasso mensile esatto (1+r)^(1/12)−1, test PASS con closed-form indipendente
- NON_GOALS: nuovi calcolatori, nuove feature, refactoring generale, cambiamenti UX/SEO non correlati a queste ottimizzazioni P2
- REQUIRED_EVIDENCE:
  - ✅ test/unit test per le due correzioni che includano closed-form indipendente
  - ✅ typecheck PASS
  - ✅ build PASS
- LOOP_STATE: GOAL_COMPLETED

## Ultimo ciclo (2026): Correttezza Nuovi Calcolatori (11 aggiunti)

| Stato | Area / Calcolatore | Formula / Fonte | File | Test / Risultati | Problemi / Decisioni | Prossimo Passo |
|-------|--------------------|-----------------|------|------------------|----------------------|----------------|
| ✅ VERIFIED | **Bollo Auto** | Tariffa base L. 449/1997 (2,58/3,87/4,65/5,82 €/kW); superbollo L. 147/2013 (20 €/kW >185 kW, raddoppio Euro 0-3) | `lib/calculations.ts`, `app/bollo-auto/page.tsx` | 9 test PASS (258/374,1/513,6/659,1/1046,4/1346,4 + throws) | RIMOSSI coefficienti regionali, sconti alimentazione/anzianità, esenzione elettrico inventati (erano presentati come tariffa 2024). Ora solo tariffa nazionale; disclaimer regionale in pagina. | Verificare coefficienti regionali con fonti ufficiali se si vuole il dettaglio regionale |
| ✅ VERIFIED | **Stima Pensione** | Contributivo: montante 33% retribuzione, coeff. trasformazione 2024 INPS (tabella 57-71), pensione = montante×coeff/100/12. **P2 FIX**: crescita stipendio solo anni futuri; contributi passati flat. Rivalutazione montante non applicata (disclaimer). | `lib/calculations.ts`, `app/stima-pensione/page.tsx` | 4 test PASS incl. closed-form indipendente (35/67/30k/1% → 2004,33 €/mese, 80,2%) | FIXATO bug ×12 (pensione ~650× sovrastimata); FIXATO coeff 67 (5,083→4,683). **P2 IMPLEMENTATO**: crescita solo anni futuri, test closed-form aggiornato. | — |
| ✅ VERIFIED | **Calcolo TFR** | Art. 2120 c.c.: accantonamento = retrib/13,5×(1−0,5% INPS); rivalutazione annua 1,5% fisso + 75% inflazione; imposta sostitutiva DLgs 47/2000: 17% su rivalutazione, 23%/35% (soglia 28k) sul resto | `lib/calculations.ts`, `app/calcolo-tfr/page.tsx` | 5 test PASS, caso default (30k, 5y, 2%, 0,5%) → lordo 12091,26 / netto 9372,41 verif. manuale | RIFATTO modello: quota INPS dedotta dall'accantonamento (non 13,5×), rivalutazione 1,5% fisso assente prima, trattenute 23/27/31 + 20% su rivalutazione inventate. Pagina aggiornata | — |
| ✅ VERIFIED | **Media ponderata / Geometria (parall., sfera, cilindro, triangolo)** | Formule standard | `lib/calculations.ts` | test PASS esistenti + validazione finite-numbers | Aggiunto rifiuto NaN/Infinity | — |
| ✅ VERIFIED | **Rivalutazione monetaria** | Compounding inflazione (annuale o mensile). **P2 FIX**: tasso mensile esatto (1+r)^(1/12)−1 invece di approssimazione annuale/12. | `lib/calculations.ts` | test PASS (precisione allineata a rounding policy: centesimi). **P2 IMPLEMENTATO**: tasso mensile esatto, test closed-form indipendente. | Policy rounding esplicita: importi al centesimo. Tasso mensile ≈ annuale/12 (approssimazione documentata; più corretto (1+r)^(1/12)−1) | — |
| ✅ VERIFIED | **TAN/TAEG, Rata Leasing** | Rendita francese; TAEG = tasso effettivo annuo (1+r)^12−1 che eguaglia PV flussi al capitale netto | `lib/calculations.ts` | 11 test PASS: round-trip tasso noto (1% mensile → TAN 12%, TAEG 12,68%), TAEG con costi iniziali (bisezione indipendente nel test, > TAEG senza costi), boundary rata=capitale/mesi → 0% | AGGIUNTE guardie di esistenza: rata < quota capitale (P/n), rata oltre intervallo (TAN>100%), spese che rendono TAEG impossibile → ora throw con messaggio esplicito (prima: output silenziosamente sbagliato ~0% / 409500%) | — |
| ✅ VERIFIED | **Typecheck/Lint/Build** | — | tutto | `tsc --noEmit` ✅, `next lint` ✅ 0 errori, `npm run build` ✅ 48 pagine statiche | FIXATI 14 errori TS preesistenti: AdUnit `slot`→`adSlot` su 11 pagine nuove, index access in calculations.ts | — |
| ✅ VERIFIED | **Teorema di Pitagora / Regola del Tre / Area Trapezio / Volume Cono** | Geometria euclidea: c=√(a²+b²); a:b=c:x → x=bc/a; A=(B+b)h/2; V=πr²h/3 (regole stabili) | `lib/calculations.ts`, `app/teorema-pitagora|regola-del-tre|area-trapezio|volume-cono` | 10 test PASS: 3-4-5→5, round-trip decimali, 32/37,70 riferimenti indipendenti, throw su zero/negativi | Aggiunti 4 calcolatori nuovi (Matematica/Geometria), layout metadata, catalog, E2E | — |
| ✅ VERIFIED | **Metabolismo Basale (BMR)** | Mifflin-St Jeor 1990 (Am J Clin Nutr 51(2):241-247): 10·kg+6,25·cm−5·età±(5/−161), validato 19-78 anni (regola stabile, pubblicata) | `lib/calculations.ts`, `app/metabolismo-basale` | 5 test PASS: 70/175/30 M→1648,75; F→1345,25; differenza 166 kcal; throw età<18 | Nuovo calcolatore Salute; disclaimer "stima non misura clinica" in pagina | — |
| ✅ VERIFIED | **Unit test + E2E** | — | `lib/__tests__/calculations.test.ts`, `e2e/calculators.spec.ts` | `npm test` ✅ 229/229 (9 suite, +18 test); `npx playwright test` ✅ 41/41 (+5 route) | Test bollo/TFR/pensione aggiornati al modello corretto (i vecchi enshrinavano dati inventati) | — |

## Catalog / Routes (37+11+5 = 53 pagine statiche)

### Finanza
- `/rata-mutuo`, `/rata-prestito`, `/interesse-semplice`, `/interesse-composto`, `/rata-leasing`, `/tan-taeg`

### Fiscale
- `/scorporo-iva`, `/busta-paga-netta`, `/calcolo-imu`, `/bollo-auto`, `/calcolo-tfr`

### Matematica
- `/percentuali`, `/sconto-percentuale`, `/aumento-percentuale`, `/media-voti`, `/media-ponderata`, `/numeri-casuali`, `/cifrario-enigma`, `/teorema-pitagora`, `/regola-del-tre`

### Geometria
- `/area-rettangolo`, `/area-cerchio`, `/area-triangolo`, `/area-trapezio`, `/volume-parallelepipedo`, `/volume-sfera`, `/volume-cilindro`, `/volume-cono`

### Utility
- `/calcolo-eta`, `/giorni-tra-date`, `/consumo-carburante`, `/calcolo-mancia`, `/conversione-temperatura`, `/convertitore-unita-lunghezza`, `/rivalutazione-monetaria`

### Salute
- `/indice-massa-corporea`, `/fabbisogno-calorico`, `/metabolismo-basale`

### Pensioni
- `/stima-pensione`

### Identity
- `/codice-fiscale`

### Pages
- `/`, `/about`, `/privacy`, `/cookie`, `/quote-dashboard`

## Verifiche Formula (riferimenti indipendenti)

| Calcolatore | Test Case | Risultato | Verifica |
|-------------|-----------|-----------|----------|
| rata-prestito | 200k€, 3.5%, 20y | 1159.92€/mese | ✅ |
| rata-prestito | 150k€, 2.8%, 25y | 695.81€/mese | ✅ |
| rata-prestito | 300k€, 4.0%, 30y | 1432.25€/mese | ✅ |
| scorporo-IVA | 122€, 22% | 100€+22€ | ✅ |
| interesse-composto | 10k€, 5%, 10y annual/monthly | 16288.95 / 16470.09€ | ✅ |
| busta-paga-netta | RAL 30k, taxable 27243 | IRPEF 6265.89€ | ✅ |
| bollo-auto | 100/130/160/185/200 kW | 258 / 374,1 / 513,6 / 659,1 / 1046,4€ | ✅ tariffa L. 449/1997 + superbollo |
| bollo-auto | 200 kW Euro 0 | 1346,4€ (superbollo raddoppiato) | ✅ |
| stima-pensione | 35/67/30k/10y/1% | 2004,33€/mese, 80,2% | ✅ closed-form |
| tfr | 30k, 5y, infl 2%, INPS 0,5% | lordo 12091,26 / netto 9372,41 | ✅ manuale |

## Note / Rischi aperti
- **P2 stima-pensione**: crescita stipendio applicata anche agli anni già contribuiti; manca rivalutazione montante. Stima volutamente semplificata (disclaimer in pagina).
- **P2 rivalutazione**: tasso mensile = annuale/12 (approssimazione).
- **Bollo auto**: variazione regionali (maggiorazioni, esenzioni elettrico) NON incluse per scelta — nessun dato inventato; pagina avvisa.
- Build/lint/typecheck/test: tutti ✅ locali. E2E playwright: 36 test ✅ (11 nuove route incluse).
- Produzione: https://calcolasubito.vercel.app (CURRENT.md: 200 OK, verifica con commit successivo).

## Prossimo Task
1. P2 stima-pensione: rivalutazione montante e crescita solo su anni futuri.
2. P2 rivalutazione: tasso mensile esatto (1+r)^(1/12)−1.
3. Verifica SEO/structured data su production (title/description/canonical unici per le 11 route nuove, già locali).
4. Deploy (git push → Vercel) e QA production (numerico + SEO su https://calcolasubito.vercel.app).
