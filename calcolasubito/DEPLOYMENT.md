# CalcolaSubito - Guida Deploy Vercel + Google Search Console

## Ã°Å¸â€œâ€¹ Pre-Deploy Checklist

- [x] Tutti i calcolatori disponibili funzionano localmente (`npm run dev`/`npm run start`)
- [x] `.env.local` creato con NEXT_PUBLIC_GA_ID (opzionale per deploy)
- [x] Git repo inizializzato e committed
- [x] Nessun errore di build: `npm run build`

---

## Ã°Å¸Å¡â‚¬ Step 1: Deploy su Vercel (5 minuti)

### 1.1 Installa Vercel CLI
```bash
npm i -g vercel
```

### 1.2 Login a Vercel
```bash
vercel login
```
Segui il link nel browser e autorizza.

### 1.3 Deploy Progetto
```bash
vercel
```

**Durante il setup:**
- Project Name: `calcolasubito`
- Framework: `Next.js` (auto-rilevato)
- Root Directory: `./` (oppure `./calcolasubito`)
- Build Command: `npm run build` (default OK)

**Risultato:** URL di produzione generato (es: `${NEXT_PUBLIC_BASE_URL}`)

### 1.4 Verifica Deploy
Visita l'URL e testa i calcolatori. Dovrebbe essere identico a localhost ma in produzione.

---

## Ã°Å¸â€Â§ Step 2: Configurare Environment Variables

### 2.1 Aggiungi GA_ID
Nel Vercel dashboard:
1. Vai a **Settings Ã¢â€ â€™ Environment Variables**
2. Aggiungi: `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX` (tuo GA ID)
3. Seleziona: Production, Preview, Development
4. Salva
5. **Redeploy:** `vercel --prod`

### 2.2 (Opzionale) Custom Domain
1. Vai a **Settings Ã¢â€ â€™ Domains**
2. Aggiungi il tuo dominio personalizzato
3. Configura DNS sul tuo registrar
4. Verifica possesso dominio

---

## Ã°Å¸â€œÅ  Step 3: Google Search Console Setup (10 minuti)

### 3.1 Accedi a Google Search Console
- URL: https://search.google.com/search-console
- Accedi con account Google

### 3.2 Aggiungi Sito
1. Clicca **"Aggiungi ProprietÃƒÂ "**
2. Inserisci URL: `${NEXT_PUBLIC_BASE_URL}` (o tuo custom domain)
3. **Verifica proprietÃƒÂ  sito:**

#### Opzione A: Verificare con DNS (Consigliato)
1. Copia il record DNS fornito da GSC
2. Vai al tuo registrar DNS
3. Aggiungi il record TXT
4. Torna a GSC e clicca "Verifica"

#### Opzione B: Verificare con HTML (Alternativo)
1. Copia il file HTML
2. Mettilo in `public/` cartella
3. Commit e push
4. Torna a GSC e clicca "Verifica"

### 3.3 Invia Sitemap
Una volta verificato il sito:
1. Vai a **Sitemap** (menu sinistro)
2. Incolla: `${NEXT_PUBLIC_BASE_URL}/sitemap.xml`
3. Clicca "Invia"

**Risultato:** Google inizia a crawlare il tuo sito!

### 3.4 Monitora Indicizzazione
1. Vai a **Pagine** per vedere quante pagine sono indicizzate
2. Vai a **Rendez-vous di ricerca** per vedere i dati di ricerca (dopo 1-2 settimane)

---

## Ã°Å¸â€Â Step 4: Verifica Implementazione

### 4.1 Test SEO
```bash
# Testa Open Graph tags
curl -I ${NEXT_PUBLIC_BASE_URL}

# Verifica sitemap
curl ${NEXT_PUBLIC_BASE_URL}/sitemap.xml
```

### 4.2 Test Google Analytics
1. Visita il sito
2. Apri Chrome DevTools Ã¢â€ â€™ Console
3. Digita: `gtag`
4. Se vedi la funzione, GA ÃƒÂ¨ caricato correttamente
5. Vai a Google Analytics Ã¢â€ â€™ Report Realtime Ã¢â€ â€™ dovresti vederti

### 4.3 Test Schema Markup
1. Vai a https://schema.org/validate
2. Inserisci URL: `${NEXT_PUBLIC_BASE_URL}/percentuali`
3. Clicca "Validate"
4. Dovrebbe mostrare FAQPage schema Ã¢Å“â€œ

---

## Ã°Å¸â€œË† Step 5: Monitoring & Optimization

### 5.1 Setup Alerts
Nel Vercel dashboard:
- **Monitoring** Ã¢â€ â€™ Enable Analytics
- Monitora Core Web Vitals

### 5.2 Monitor GSC Settimanalmente
- Check impressioni e click
- Identifica pagine non rankking
- Ottimizza meta tags

### 5.3 Monitor GA4 Mensile
- Traffic trends
- Top performing calculators
- User funnel analysis

---

## Ã°Å¸â€â€ž Deployment Workflow (Futuro)

### Per aggiungere nuovo calcolatore:
```bash
# 1. Crea feature branch
git checkout -b feat/new-calculator

# 2. Aggiungi calcolatore (page.tsx, layout.tsx, etc)
# 3. Test localmente
npm run dev

# 4. Commit
git commit -m "feat(calculator): add new calculator"

# 5. Push
git push origin feat/new-calculator

# 6. Vercel auto-preview (PR preview automatico)

# 7. Merge su main quando pronto
git checkout main
git merge feat/new-calculator
git push origin main

# 8. Vercel auto-deploya su produzione!
```

---

## Ã°Å¸Ââ€º Troubleshooting

### Problema: "Build failed"
- Verifica che `npm run build` funziona localmente
- Controlla i logs nel Vercel dashboard
- Solitamente ÃƒÂ¨ un missing import o TypeScript error

### Problema: "GA non traccia"
- Verifica NEXT_PUBLIC_GA_ID ÃƒÂ¨ settato in .env.local E Vercel
- Controlla console per gtag errors
- Assicurati di aver fatto `vercel --prod` per deployment nuovo

### Problema: "Sitemap non trovato"
- Verifica che il file `app/sitemap.ts` esiste
- Testa: `${NEXT_PUBLIC_BASE_URL}/sitemap.xml`
- Se 404, probabile bug nel sitemap.ts

### Problema: "Schema markup non valida"
- Testa su https://schema.org/validate
- Controlla che JSON-LD ÃƒÂ¨ valid
- Verifica quotes e parentheses

---

## Ã¢Å“â€¦ Checklist Final

Dopo deploy:
- [x] Sito raggiungibile da produzione URL
- [x] Tutti i calcolatori disponibili funzionano
- [x] Sitemap.xml generato correttamente
- [ ] Google Analytics traccia visite (codice GA4 e pageview SPA implementati; resta configurare NEXT_PUBLIC_GA_ID in Vercel produzione)
- [ ] Schema markup Ã¨ valid (JSON-LD valido sintatticamente; conferma finale su validator esterno da account/browser)
- [ ] GSC indica "Sito verificato" (bloccato: richiede accesso account Google Search Console)
- [ ] GSC ha ricevuto sitemap (bloccato: richiede accesso account Google Search Console)

**Congratulazioni! CalcolaSubito Ã¨ LIVE!**

---

## Ã°Å¸â€œÅ¾ Supporto & Documentazione

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Google Search Console Help:** https://support.google.com/webmasters
- **Google Analytics 4:** https://support.google.com/analytics

---

**Prossimi step (facoltativo):**
1. Aggiungi Google AdSense per monetizzazione
2. Espandi a 15+ calcolatori (Settimana 3-4)
3. Link building su Reddit/Forum
4. Setup affiliazioni (Fiscozen, Flextax, etc)

---

## Execution Log (Aggiornato 2026-03-30)

Verifiche eseguite in modo deterministico e riproducibile:

- `npm test -- --runInBand`: PASS (27/27 test)
- `npm run lint`: PASS (0 warning/error)
- `npm run build`: PASS (build di produzione completata)
- Routing locale verificato con server avviato su `localhost:3000`:
  - `/` -> 200
  - `/percentuali` -> 200
  - `/giorni-tra-date` -> 200
  - `/scorporo-iva` -> 200
  - `/codice-fiscale` -> 200
  - `/rata-mutuo` -> 200
- SEO endpoint locali:
  - `/sitemap.xml` -> 200
  - `/robots.txt` -> 200

Stato task esterni:

- Task esterni ancora aperti: Google Analytics realtime e Google Search Console (richiedono accesso account).
- Deploy produzione verificato su dominio reale; restano solo verifiche GA/GSC.



- Verifica produzione (dominio reale):
  - ${NEXT_PUBLIC_BASE_URL} -> 200
  - /percentuali, /giorni-tra-date, /scorporo-iva, /codice-fiscale, /rata-mutuo -> 200
  - /sitemap.xml -> 200
  - /robots.txt -> 200
  - JSON-LD presente su /percentuali




- Verifiche aggiuntive (2026-03-30):
  - GA_SCRIPT_LOADED=False su homepage produzione
  - JSON-LD su /percentuali: 3 blocchi, parse OK=3, parse FAIL=0
  - validation_framework.py: PASS (0 problemi)

- Ciclo ricorsivo finale (2026-03-30):
  - `validation_framework.py --no-interactive --max-attempts-per-problem 0 --max-global-iterations 0` -> PASS (0 problemi)
  - `npm test -- --runInBand` -> PASS
  - `npm run lint` -> PASS
  - `npm run build` -> PASS

- Hardening edge case completato (2026-03-30): funzioni calcolo rinforzate + test extra PASS.


- Build stability loop (2026-03-30): 3/3 build consecutive PASS.

- Recursive verification cycle (2026-03-30, run 2):
  - `validation_framework.py --no-interactive --max-attempts-per-problem 0 --max-global-iterations 0` -> PASS (0 problemi)
  - Test/Lint/Build loop -> 3/3 iterazioni PASS
  - Produzione `${NEXT_PUBLIC_BASE_URL}`:
    - `/`, `/percentuali`, `/giorni-tra-date`, `/scorporo-iva`, `/codice-fiscale`, `/rata-mutuo` -> 200
    - `/sitemap.xml` -> 200
    - `/robots.txt` -> 200
    - JSON-LD su `/percentuali`: 3 blocchi, parse OK 3/3
    - `GA_SCRIPT_LOADED=False` (task esterno ancora aperto)

- Recursive verification cycle (2026-03-30, run 3):
  - Revisione modifiche utente su:
    - `app/giorni-tra-date/layout.tsx`
    - `app/sitemap.ts`
    - `components/Toast.tsx`
    - `lib/validations.ts`
  - Bug fix applicati:
    - validazione date resa stretta ISO (`YYYY-MM-DD`) con rifiuto date impossibili (`2024-02-30`)
    - allineamento FAQ UI di `giorni-tra-date` al comportamento reale (differenza in giorni)
    - hardening worker su `daysBetween`, `mortgage` e mappa check-digit CF
  - Test aggiunti:
    - `lib/__tests__/validations.test.ts` (date edge case + check-digit CF randomizzato)
  - Risultato quality gates:
    - `npm test -- --runInBand` -> PASS (34/34)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - Stress loop `test/lint/build` -> 5/5 PASS
    - `validation_framework.py --no-interactive --max-attempts-per-problem 0 --max-global-iterations 0` -> PASS (0 problemi)
  - Runtime check locale in start mode:
    - `/`, `/about`, `/percentuali`, `/giorni-tra-date`, `/scorporo-iva`, `/codice-fiscale`, `/rata-mutuo`, `/sitemap.xml`, `/robots.txt` -> 200
    - `sitemap.xml` contiene `/about` -> True
  - Runtime check produzione `${NEXT_PUBLIC_BASE_URL}`:
    - `/`, `/about`, `/percentuali`, `/giorni-tra-date`, `/scorporo-iva`, `/codice-fiscale`, `/rata-mutuo`, `/sitemap.xml`, `/robots.txt` -> 200
    - JSON-LD su `/percentuali`: parse OK 3/3
    - `GA_SCRIPT_LOADED=False`

- Recursive verification cycle (2026-03-30, run 4):
  - Nuovo bug fix calcoli CF:
    - supporto completo a `birthPlace` come comune oppure codice catastale diretto (es. `H501`)
    - errore esplicito se comune/codice non risolvibile, evitando codici fiscali con valore placeholder
  - Hardening test:
    - aggiunto `lib/__tests__/codice-fiscale-utils.test.ts`
    - corretto test flakey su antisimmetria giorni (`0` vs `-0`)
  - Risultati:
    - `npm test -- --runInBand` -> PASS (40/40)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `validation_framework.py --no-interactive --max-attempts-per-problem 0 --max-global-iterations 0` -> PASS (0 problemi)
    - stress loop qualitÃ  `test/lint/build` -> 5/5 PASS
  - Runtime locale:
    - `/`, `/about`, `/percentuali`, `/giorni-tra-date`, `/scorporo-iva`, `/codice-fiscale`, `/rata-mutuo`, `/sitemap.xml`, `/robots.txt` -> 200
  - Runtime produzione `${NEXT_PUBLIC_BASE_URL}`:
    - `/`, `/about`, `/percentuali`, `/giorni-tra-date`, `/scorporo-iva`, `/codice-fiscale`, `/rata-mutuo`, `/sitemap.xml`, `/robots.txt` -> 200
    - JSON-LD su `/percentuali`: parse OK 3/3
    - `GA_SCRIPT_LOADED=False`

- Recursive verification cycle (2026-03-30, run 5):
  - Estensione portale: +10 nuovi calcolatori (totale 15)
    - `/sconto-percentuale`, `/aumento-percentuale`, `/interesse-semplice`, `/interesse-composto`, `/indice-massa-corporea`, `/consumo-carburante`, `/area-rettangolo`, `/area-cerchio`, `/media-voti`, `/conversione-temperatura`
  - Formula engine aggiornato con nuove funzioni e guardie su edge case
  - Smoke runtime locale (`next start`):
    - tutte le 15 route calcolatori + `/about` + `/sitemap.xml` + `/robots.txt` -> 200
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (57/57)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `validation_framework.py --no-interactive --max-attempts-per-problem 0 --max-global-iterations 0` -> PASS (0 problemi)
    - stress loop `test/lint/build` -> 5/5 PASS

- Recursive verification cycle (2026-03-30, run 6):
  - Upgrade funzionalita comuni applicate a tutti i 21 calcolatori via `components/Calculator.tsx`
    - preferiti locali e lista recenti
    - snapshot input automatici con ripristino
    - export/import cronologia JSON
    - azioni rapide globali: copia link, condivisione, stampa, reset form, ricalcolo
  - Qualita e verifiche finali:
    - `npm test -- --runInBand` -> PASS (80/80)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 problemi)
  - Sincronizzazione e produzione:
    - commit `17ba522` pushato su `origin/calcolasubito-main`
    - deploy Vercel produzione: `dpl_F35kyg7rPinzdzdz5u9boGtSRUQF`
    - alias confermato: `https://calcolasubito.vercel.app` -> `https://calcolasubito-asm059e02-mattew821s-projects.vercel.app`
    - health-check HTTP su dominio finale:
      - `/` -> 200
      - `/percentuali` -> 200
      - `/numeri-casuali` -> 200
      - `/sitemap.xml` -> 200
      - `/robots.txt` -> 200

- Recursive verification cycle (2026-03-30, run 7):
  - Quality gates ripetuti:
    - `npm test -- --runInBand` -> PASS (80/80)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 3 --max-global-iterations 3` -> PASS (0 problemi)
  - Stress loop deterministico:
    - 3 iterazioni consecutive `test + lint + build` -> PASS 3/3
  - Smoke runtime locale (`next start`, porta 3100):
    - tutte le route del portale (home, pagine statiche, 21 calcolatori, `sitemap.xml`, `robots.txt`) -> 200
  - Smoke runtime produzione (`https://calcolasubito.vercel.app`):
    - home, pagine statiche, 21 calcolatori, `sitemap.xml`, `robots.txt` -> 200
  - SEO/coerenza URL:
    - canonical presente e corretto su tutte le pagine principali verificate
    - `sitemap.xml`: `sitemap_count=25`, `missing_count=0`, `extra_count=0`
    - `robots.txt` valido e allineato al dominio `calcolasubito.vercel.app`
  - Esito:
    - nessun bug riproducibile emerso in questo ciclo; nessuna correzione codice necessaria.

- Recursive verification cycle (2026-03-30, run 8):
  - Nuove funzionalita implementate:
    - integrazione GA4 migliorata con tracciamento page-view su cambio route (`components/GoogleAnalytics.tsx`)
    - redirect canonico host in produzione via `middleware.ts`
    - nuovi calcolatori: `/calcolo-imu` e `/busta-paga-netta`
    - motore formule esteso in `lib/calculations.ts` (IMU + simulatore netto busta paga)
    - validazioni dedicate aggiunte in `lib/validations.ts`
    - suite E2E Playwright aggiunta (`playwright.config.ts`, `e2e/calculators.spec.ts`)
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (91/91)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `npx playwright test` -> PASS (24/24)
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 problemi)
  - SEO/runtime:
    - sitemap aggiornata automaticamente a 27 URL (23 calcolatori + pagine statiche + home)
    - canonical verificato in E2E su tutte le route calcolatori

- Recursive verification cycle (2026-03-30, run 9):
  - Rilancio completo qualitÃ  in modalitÃ  ricorsiva:
    - `npm test -- --runInBand` -> PASS (91/91)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 3 --max-global-iterations 3` -> PASS (0 problemi)
  - E2E:
    - individuato falso negativo quando `validation_framework` e Playwright venivano eseguiti in parallelo (contesa su `.next`)
    - esecuzione corretta in sequenza: 2 loop completi `test + lint + build + playwright` -> PASS 2/2
    - `npx playwright test` -> PASS (24/24) stabile
  - Runtime/SEO produzione:
    - smoke check su tutte le route portale (incluse `/calcolo-imu` e `/busta-paga-netta`) -> 200
    - canonical valido su tutte le route verificate
    - `sitemap.xml`: `sitemap_count=27` con nuove route presenti
    - redirect host non canonico verificato (es. `calcolasubito-psi.vercel.app` -> 308 verso `calcolasubito.vercel.app`)
  - Esito:
    - nessun bug applicativo riproducibile; unico issue emerso era infrastrutturale/test-runner (parallelismo), risolto con sequenziamento.


- Recursive verification cycle (2026-03-31, security hardening):
  - Threat mitigation applicata in edge middleware:
    - blocco scanner path/file comuni (es. `/wp-admin`, `/.env`, `phpmyadmin`, probe php/sql)
    - blocco metodi HTTP non ammessi sulle pagine pubbliche (`Allow: GET, HEAD, OPTIONS`)
    - blocco query malevole e user-agent di scanner noti
    - rate limiting IP su due livelli:
      - burst limit (default `80 req / 10s`, block `120s`)
      - window limit (default `240 req / 60s`, block `600s`)
  - Nuovi moduli e test:
    - `lib/security/request-guard.ts`
    - `lib/security/rate-limiter.ts`
    - `lib/__tests__/request-guard.test.ts`
    - `lib/__tests__/rate-limiter.test.ts`
  - Configurazione:
    - `.env.example` aggiornato con variabili `REQUEST_RATE_LIMIT_*`
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (103/103)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 problemi)
  - Runtime checks in `next start` (porta 3200/3202):
    - `/` -> 200
    - `/wp-admin` -> 403
    - `/percentuali?q=%27%20OR%201%3D1--` -> 403
    - `POST /percentuali` -> 405
    - stress rapido 120 request su `/percentuali` -> `200:79`, `429:41` (rate limit attivo)
  - Esito:
    - nessun errore residuo rilevato; baseline anti-bot/flood attiva lato applicazione.

- Recursive verification cycle (2026-03-31, enigma calculator):
  - Nuovo calcolatore implementato: `/cifrario-enigma`
    - simulazione Enigma con 3 rotori (I-V), reflector (B/C), ring settings, posizioni iniziali e plugboard
    - stepping corretto con double-step e cifratura/decifratura simmetrica
  - Moduli aggiunti/aggiornati:
    - `lib/calculations.ts`: `runEnigmaCipher` + tipi Enigma
    - `lib/validations.ts`: `enigmaSchema` con vincoli su rotori/plugboard
    - `app/cifrario-enigma/page.tsx` + `app/cifrario-enigma/layout.tsx`
    - `lib/calculator-catalog.ts` + `README.md` aggiornati
  - Test aggiunti:
    - vettore noto `HELLOWORLD -> ILBDAAMTAZ`
    - reversibilità con stesse impostazioni iniziali
    - validazioni errori su plugboard e rotori duplicati
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (111/111)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 problemi)
  - Esito:
    - implementazione Enigma + Plugboard completa e stabile, senza errori residui rilevati.

- Recursive verification cycle (2026-03-31, observability + anti-bypass hardening):
  - Analisi Vercel produzione (ultime 24h):
    - nessun errore 5xx rilevato
    - eventi 403 confermati su probe malevoli (/wp-admin, query sospette)
    - redirect canonici 308 presenti e coerenti con policy host
  - Correzione sicurezza applicata:
    - lib/security/request-guard.ts
      - i blocchi blocked-path e blocked-file ora valutano anche la versione URL-decoded del path
      - mitigato bypass con path encoded (es. /wp-admin%2F..., /backup%2Fdatabase%2Esql)
  - Test regressione aggiunti:
    - lib/__tests__/request-guard.test.ts
      - blocks encoded scanner paths
      - blocks encoded suspicious file probes
  - Quality gates:
    - npm test -- --runInBand -> PASS (113/113)
    - npm run lint -> PASS
    - npm run build -> PASS
    - python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2 -> PASS (0 problemi)
  - Esito:
    - hardening anti-bypass attivo, nessuna regressione rilevata.
- Recursive verification cycle (2026-03-31, temporary security audit + hardening):
  - Script temporaneo creato ed eseguito: temp-security-audit.mjs
    - controlli coperti: security headers, path/query malevoli, user-agent scanner, metodi HTTP, redirect canonico, mitigazione flood
  - Gap individuati e risolti:
    - middleware hardening:
      - request guard attivo in modalita secure-by-default (non dipende piu da NODE_ENV=production)
      - bypass consentito solo in development esplicito
      - rate limit disabilitabile solo in development
    - request guard hardening:
      - blocco richieste con componenti anomale per dimensione (path/query/user-agent oversized)
    - header hardening in next.config.mjs:
      - X-DNS-Prefetch-Control: off
      - X-Permitted-Cross-Domain-Policies: none
      - Origin-Agent-Cluster: ?1
  - Test e verifiche:
    - npm test -- --runInBand -> PASS (114/114)
    - npm run lint -> PASS
    - npm run build -> PASS
    - python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2 -> PASS (0 problemi)
    - audit temporaneo su next start locale (porta 4301) -> PASS (28/28)
  - Esito:
    - hardening completato con regressione nulla; baseline sicurezza rinforzata su input malevoli, header e comportamento middleware.

- Recursive verification cycle (2026-03-31, generic calculator expansion):
  - Estensioni motore calcolo:
    - carburante: nuova funzione calculateFuelConsumptionDetailed con unita distanza (km/mi), unita energia-carburante (L, gal US/UK, kg, kWh), MPG US/UK e costi viaggio
    - temperatura: nuova conversione generica convertTemperature tra C/F/K/Rankine, con controllo zero assoluto
    - lunghezze: nuova convertLength da qualsiasi unita (m, km, cm, mm, mi, yd, ft, in, nmi)
  - Compatibilita preservata:
    - calculateFuelConsumption, convertCelsius, convertLengthFromMeters mantenute come wrapper backward-compatible
  - UI calcolatori aggiornata:
    - /consumo-carburante: supporto multi-unita + profili alimentazione + costo per unita + costo/100km
    - /conversione-temperatura: input su scala selezionabile e output completo C/F/K/Rankine
    - /convertitore-unita-lunghezza: input con unita di partenza selezionabile e output esteso
  - Catalogo aggiornato (lib/calculator-catalog.ts) con nuove descrizioni funzionali
  - Quality gates:
    - npm test -- --runInBand -> PASS (119/119)
    - npm run lint -> PASS
    - npm run build -> PASS
    - python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2 -> PASS (0 problemi)
  - Esito:
    - calcolatori resi significativamente piu generici su unita e scenari reali, con test di regressione verde.
- Recursive verification cycle (2026-03-31, advanced generic calculators pass):
  - Expanded calculators for broader real-world input spaces:
    - `/area-rettangolo`: area + perimeter + full surface-unit conversion (m2, km2, ha, acre, ft2, in2)
    - `/area-cerchio`: area + diameter + circumference + full surface-unit conversion
    - `/indice-massa-corporea`: multi-unit BMI (kg/lb/st + cm/m/ft/in), BMI Prime, healthy-weight range
    - `/fabbisogno-calorico`: metric/imperial support, calorie goal target (% cut/bulk), macro presets
    - `/calcolo-mancia`: service charge and split-rounding strategies
    - `/numeri-casuali`: integer/decimal mode, deterministic seed, sort mode, duplicate control
  - Engine enhancements (`lib/calculations.ts`):
    - `calculateBmiDetailed`
    - `calculateCaloriePlan`
    - `calculateRectangleAreaDetailed` / `calculateCircleAreaDetailed` / `convertAreaFromSquareMeters`
    - `calculateTipDetailed`
    - `generateRandomNumbers`
    - Backward compatibility preserved for legacy wrappers
  - Catalog metadata updated (`lib/calculator-catalog.ts`) for expanded calculators.
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (128/128)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 issues)
  - Outcome:
    - Genericity significantly improved across units, modes and edge-case handling with full regression green.

- Recursive verification cycle (2026-03-31, advanced completion pass):
  - Completed remaining high-priority calculator tasks:
    - `/percentuali`:
      - added modes: direct %, inverse %, percentage change, sequential chained percentages
    - `/giorni-tra-date`:
      - added modes: calendar days vs business days (Mon-Fri)
      - added options: include end date, custom holiday dates list
    - `/rata-mutuo`:
      - added advanced simulation with extra monthly payment, monthly fees and upfront costs
      - added outputs: effective duration, months saved, interest saved, total cost with fees/costs
  - Engine extensions (`lib/calculations.ts`):
    - `calculatePercentageChange`, `applySequentialPercentages`
    - `calculateBusinessDaysBetween`
    - `calculateMortgageAdvanced`
  - Tests added (`lib/__tests__/calculations.test.ts`):
    - percentage change + sequential chain invariants
    - business-day calculations with inclusive mode and holidays
    - advanced mortgage scenarios (months/interest saved, fee+cost accounting)
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (138/138)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 issues)
  - Outcome:
    - all pending finite enhancement tasks from prior backlog closed for these calculators; no residual errors found in validation loop.

- Recursive verification cycle (2026-03-31, frontend UX modernization pass):
  - Implemented global preferences layer for UI/UX:
    - dark/light/system theme switching with CSS custom properties and persisted preference
    - automatic language detection + dynamic language switching (IT/EN/ES) without reload
    - localStorage persistence for theme/language
  - New shared modules/components:
    - `lib/i18n.ts` (typed translations + locale/theme helpers)
    - `components/AppPreferencesProvider.tsx` (global preferences context)
    - `components/ScrollReveal.tsx` (intersection-based reveal animations)
  - Layout integration:
    - preload script in `app/layout.tsx` to apply theme/language before hydration (reduced flicker)
    - provider + scroll reveal mounted globally
  - UI updates:
    - `components/Header.tsx`: language selector + theme selector + localized navigation labels
    - `components/Footer.tsx`: localized footer copy and navigation labels
    - `app/page.tsx`: localized hero/search/category/result text and labels
    - `components/Calculator.tsx`: localized shared action labels/messages + reveal attributes
    - `styles/globals.css`: dark theme token set, dark-mode component overrides, reduced-motion support, reveal transitions
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (138/138)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 1 --max-global-iterations 1` -> PASS (0 issues)
  - Outcome:
    - frontend now supports modern animated UX, accessible theming, and runtime multilingual UI controls with production-ready validation green.

- Recursive verification cycle (2026-03-31, full portal re-check pass):
  - End-to-end revalidation executed across unit, integration, build, E2E and bounded framework loops.
  - Real issue found and fixed:
    - E2E regression on homepage search test due hardcoded Italian accessible-name after dynamic i18n support.
    - Fix applied in `e2e/calculators.spec.ts`: search locator now resilient to runtime language (`input[type="search"]`) while preserving functional assertions.
  - Full quality gates after fix:
    - `npm test -- --runInBand` -> PASS (138/138)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `npx playwright test` -> PASS (24/24)
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 issues)
  - Outcome:
    - no remaining reproducible defects found in current codebase/test surface for this cycle.

- Recursive verification cycle (2026-03-31, locale consistency + share i18n pass):
  - Selected improvement:
    - removed hardcoded `it-IT` formatting from client calculators and switched to active app locale derived from stored language preference.
    - localized `ShareButtons` labels/ARIA titles through existing app preference context.
  - New module:
    - `lib/locale.ts`: `getIntlLocale`, `getActiveLanguage`, `getActiveIntlLocale`.
  - Refactor scope:
    - updated numeric/date formatting in 16 calculator pages to use `getActiveIntlLocale()`:
      - `/area-cerchio`, `/area-rettangolo`, `/aumento-percentuale`, `/busta-paga-netta`, `/calcolo-eta`, `/calcolo-imu`, `/calcolo-mancia`, `/consumo-carburante`, `/convertitore-unita-lunghezza`, `/giorni-tra-date`, `/indice-massa-corporea`, `/interesse-composto`, `/interesse-semplice`, `/percentuali`, `/rata-prestito`, `/sconto-percentuale`
    - `components/ShareButtons.tsx` now uses translated share labels from app preferences.
  - Tests added:
    - `lib/__tests__/locale.test.ts` (mapping + storage/document/navigator fallback behavior).
  - Quality gates:
    - `npm test -- --runInBand` -> PASS (143/143)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 issues)
    - `npx playwright test` -> PASS (24/24, executed sequentially; parallel run with validation was discarded as infrastructure contention on `.next`)
  - Outcome:
    - locale formatting and share accessibility text are now coherent with active UI language without regressions.

- Recursive verification cycle (2026-03-31, legal pages consistency + deterministic loops):
  - Scientific loop execution (bounded recursive):
    - ran 2 full deterministic loops of `npm test -- --runInBand`, `npm run lint`, `npm run build`.
  - Real issue found and fixed:
    - `app/cookie/page.tsx` had JSX parsing failure due raw `->` symbols in list items.
    - replaced with plain readable text separators to keep JSX parse-safe.
  - Consistency fixes:
    - `app/privacy/page.tsx` and `app/cookie/page.tsx` now use a fixed legal update date label via `lib/legal.ts` instead of `new Date()` (avoids misleading moving date).
    - `components/Calculator.tsx` now uses centralized `getIntlLocale(language)` from `lib/locale.ts` for snapshot timestamp formatting.
    - cleaned visible mojibake fragments in legal page copy.
  - Validation and tests:
    - `npm test -- --runInBand` -> PASS (143/143)
    - `npm run lint` -> PASS
    - `npm run build` -> PASS
    - `python validation_framework.py --no-interactive --no-auto-git-push --max-attempts-per-problem 2 --max-global-iterations 2` -> PASS (0 issues)
    - `npx playwright test` -> PASS (24/24, executed sequentially)
  - Production smoke/security checks:
    - `https://calcolasubito.vercel.app/` and key routes (`/percentuali`, `/scorporo-iva`, `/cookie`, `/privacy`, `/sitemap.xml`, `/robots.txt`) -> 200
    - malicious probes (`/wp-admin`, SQLi-like query on `/percentuali`) -> 403
  - Outcome:
    - no residual reproducible defects after recursive loop verification for this cycle.
