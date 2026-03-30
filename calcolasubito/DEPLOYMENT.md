# CalcolaSubito - Guida Deploy Vercel + Google Search Console

## ðŸ“‹ Pre-Deploy Checklist

- [x] Tutti i calcolatori disponibili funzionano localmente (`npm run dev`/`npm run start`)
- [x] `.env.local` creato con NEXT_PUBLIC_GA_ID (opzionale per deploy)
- [x] Git repo inizializzato e committed
- [x] Nessun errore di build: `npm run build`

---

## ðŸš€ Step 1: Deploy su Vercel (5 minuti)

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

## ðŸ”§ Step 2: Configurare Environment Variables

### 2.1 Aggiungi GA_ID
Nel Vercel dashboard:
1. Vai a **Settings â†’ Environment Variables**
2. Aggiungi: `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX` (tuo GA ID)
3. Seleziona: Production, Preview, Development
4. Salva
5. **Redeploy:** `vercel --prod`

### 2.2 (Opzionale) Custom Domain
1. Vai a **Settings â†’ Domains**
2. Aggiungi il tuo dominio personalizzato
3. Configura DNS sul tuo registrar
4. Verifica possesso dominio

---

## ðŸ“Š Step 3: Google Search Console Setup (10 minuti)

### 3.1 Accedi a Google Search Console
- URL: https://search.google.com/search-console
- Accedi con account Google

### 3.2 Aggiungi Sito
1. Clicca **"Aggiungi ProprietÃ "**
2. Inserisci URL: `${NEXT_PUBLIC_BASE_URL}` (o tuo custom domain)
3. **Verifica proprietÃ  sito:**

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

## ðŸ” Step 4: Verifica Implementazione

### 4.1 Test SEO
```bash
# Testa Open Graph tags
curl -I ${NEXT_PUBLIC_BASE_URL}

# Verifica sitemap
curl ${NEXT_PUBLIC_BASE_URL}/sitemap.xml
```

### 4.2 Test Google Analytics
1. Visita il sito
2. Apri Chrome DevTools â†’ Console
3. Digita: `gtag`
4. Se vedi la funzione, GA Ã¨ caricato correttamente
5. Vai a Google Analytics â†’ Report Realtime â†’ dovresti vederti

### 4.3 Test Schema Markup
1. Vai a https://schema.org/validate
2. Inserisci URL: `${NEXT_PUBLIC_BASE_URL}/percentuali`
3. Clicca "Validate"
4. Dovrebbe mostrare FAQPage schema âœ“

---

## ðŸ“ˆ Step 5: Monitoring & Optimization

### 5.1 Setup Alerts
Nel Vercel dashboard:
- **Monitoring** â†’ Enable Analytics
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

## ðŸ”„ Deployment Workflow (Futuro)

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

## ðŸ› Troubleshooting

### Problema: "Build failed"
- Verifica che `npm run build` funziona localmente
- Controlla i logs nel Vercel dashboard
- Solitamente Ã¨ un missing import o TypeScript error

### Problema: "GA non traccia"
- Verifica NEXT_PUBLIC_GA_ID Ã¨ settato in .env.local E Vercel
- Controlla console per gtag errors
- Assicurati di aver fatto `vercel --prod` per deployment nuovo

### Problema: "Sitemap non trovato"
- Verifica che il file `app/sitemap.ts` esiste
- Testa: `${NEXT_PUBLIC_BASE_URL}/sitemap.xml`
- Se 404, probabile bug nel sitemap.ts

### Problema: "Schema markup non valida"
- Testa su https://schema.org/validate
- Controlla che JSON-LD Ã¨ valid
- Verifica quotes e parentheses

---

## âœ… Checklist Final

Dopo deploy:
- [x] Sito raggiungibile da produzione URL
- [x] Tutti i calcolatori disponibili funzionano
- [x] Sitemap.xml generato correttamente
- [ ] Google Analytics traccia visite (bloccato: script GA non presente in produzione)
- [ ] Schema markup è valid (JSON-LD valido sintatticamente; conferma finale su validator esterno da account/browser)
- [ ] GSC indica "Sito verificato" (bloccato: richiede accesso account Google Search Console)
- [ ] GSC ha ricevuto sitemap (bloccato: richiede accesso account Google Search Console)

**Congratulazioni! CalcolaSubito è LIVE!**

---

## ðŸ“ž Supporto & Documentazione

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
    - stress loop qualità `test/lint/build` -> 5/5 PASS
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

