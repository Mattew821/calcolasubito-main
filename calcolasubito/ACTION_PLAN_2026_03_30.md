# 🎯 CalcolaSubito - Action Plan Completo (30/03/2026)

**Status Attuale:** 5/5 calcolatori live + SEO content + Deploy in testing
**Blocco Critico:** TypeScript error in AdUnit.tsx (RISOLTO)
**Prossimi Step:** Multilingue + Stranieri + Deploy

---

## 📊 ANALISI RICORSIVA FILE .MD

### Da README.md
- ✅ 5 calcolatori implementati
- ✅ Stack: Next.js 14, Tailwind, TypeScript
- ⏳ Deploy su Vercel (in testing, TypeScript error fixed)
- ⏳ SEO setup (sitemap.xml, robots.txt creati)
- 🎯 **Target:** 100€+/mese by mese 7-8

### Da SETUP.md
- ✅ Setup locale OK (`npm install` → `npm run dev`)
- ✅ Struttura progetto completa
- ⏳ Deploy guide (npm run build → vercel)
- ⏳ Test locale (lint, build test)

### Da PROGRESS_TODO.txt (26/03/2026)
**Completato (100%):**
- ✅ 5 calcolatori con SEO content
- ✅ Metadata + layout.tsx per ogni calcolatore
- ✅ JSON-LD schema (partial)
- ✅ Cookie policy page
- ✅ Sitemap.ts dinamico

**TODO (14 task rimanenti):**
1. ⏳ Migliora Codice Fiscale con mapping ISTAT comuni
2. ⏳ Form Validation (React Hook Form + Zod) - PARTIALLY DONE
3. ⏳ GA4 Implementation
4. ⏳ Deploy su Vercel (BLOCCATO per TypeScript error - NOW FIXED)
5. ⏳ Google Search Console setup
6. ⏳ Link building + backlinks
7. ⏳ Social media marketing
8. ⏳ Email newsletter setup
9. ⏳ Aggiungi 10+ nuovi calcolatori
10. ⏳ Monetizzazione AdSense
11. ⏳ Affiliazioni (Fiscozen, Flextax)
12. ⏳ **NUOVO: Multilingue (IT/EN)**
13. ⏳ **NUOVO: Supporto stranieri per codice fiscale**
14. ⏳ **NUOVO: Affiliazione programmi finanziari**

---

## 🆕 FEATURE RICHIESTE NUOVE

### 1️⃣ MULTILINGUE (IT/EN)

**Implementazione:**
- [ ] Installare `next-intl` package (Next.js 14 recommended)
- [ ] Creare struttura routing: `/it/...` e `/en/...`
- [ ] Translations file JSON (IT/EN) per:
  - Navbar + Footer
  - Titoli pagine
  - Descrizioni calcolatori
  - Placeholder input
  - Messaggi errore/success
  - SEO content sections
  - FAQ
- [ ] Aggiungere language switcher nel Header
- [ ] Fallback a IT se lingua non supportata
- [ ] Update sitemap per lingua (hreflang tags)
- [ ] Test su tutte le pagine

**Files da creare:**
```
locales/
├── it.json         # Traduzioni italiano
├── en.json         # Traduzioni inglese
├── config.ts       # next-intl config
└── middleware.ts   # Routing middleware
```

**Impatto:**
- 🟢 Basso (non cambiano logiche di calcolo)
- 🟡 Medio effort (tradurre 5000+ parole contenuto)
- 🟢 Alto valore (accesso a pubblico EN = +50% traffico potenziale)

---

### 2️⃣ SUPPORTO STRANIERI - CODICE FISCALE

**Problema attuale:**
- Codice fiscale è ufficiale solo per cittadini italiani
- Stranieri residenti hanno codici diversi
- Nessun disclaimer per utenti stranieri

**Implementazione:**

**Opzione A: Toggle "Cittadino/Straniero"**
```typescript
type CodiceFiscaleMode = 'italian' | 'foreigner_italy' | 'foreigner_check'

// Italian: Genera da cognome+nome+data+luogo+sesso
// Foreigner in Italy: Campo testo per inserire codice (assegnato Agenzia Entrate)
// Foreigner check: Valida formato codice fornito
```

**A.1 - Se cittadino italiano:**
- Form attuale (cognome, nome, data, luogo, sesso)
- Genera codice come ora
- Messaggio: "Codice Fiscale italiano ufficiale"

**A.2 - Se straniero residente in Italia:**
- Mostra campo testo: "Inserisci il codice fiscale assegnato"
- Valida formato (16 caratteri, pattern regex)
- Mostra disclaimer: "Il codice è fornito da Agenzia delle Entrate"
- Tasto "Genera" → valida syntax

**A.3 - Se straniero (non residente):**
- Mostra disclaimer: "I cittadini stranieri non residenti non hanno codice fiscale italiano"
- Offri link: "Scopri come ottenerlo" (articolo blog)
- Disabilita form di generazione

**Files da modificare:**
```
app/codice-fiscale/page.tsx
├── Aggiungere radio button: Italiano / Straniero residente / Straniero estero
├── Conditional rendering form based on selection
├── Validation per stranieri residente (regex 16 chars)
├── Disclaimer messaggi
├── ShareButtons per ogni type

lib/validations.ts
├── Aggiungere schema per "codiceFiscaleMode"
├── Regex validation per codice straniero
```

**Test cases:**
- [ ] Cittadino italiano: Genera codice
- [ ] Straniero residente: Accetta codice valido, rifiuta invalido
- [ ] Straniero estero: Mostra disclaimer, niente generazione

---

## ✅ ACTION PLAN ORDINATO (Priority)

### FASE 1: STABILITÀ & DEPLOY (1-2 ore)
- [x] Fix TypeScript error in AdUnit.tsx (DONE)
- [ ] Deploy su Vercel (test build locally first)
- [ ] Verifica che tutte le pagine caricano
- [ ] Google Search Console: Richiedi indicizzazione

### FASE 2: CODICE FISCALE STRANIERI (2-3 ore)
- [ ] Aggiungere mode selector (Italiano/Straniero)
- [ ] Implementare form logic per stranieri
- [ ] Aggiungere validation regex
- [ ] Disclaimer messaggi
- [ ] Test UX

### FASE 3: MULTILINGUE IT/EN (4-5 ore)
- [ ] Setup next-intl
- [ ] Tradurre contenuto (5000+ parole)
- [ ] Aggiungere language switcher
- [ ] Update sitemap con hreflang
- [ ] Test routing `/it/` e `/en/`

### FASE 4: QUALITÀ & TESTING (2 ore)
- [ ] Test build locale: `npm run build`
- [ ] Test locale: `npm run dev`
- [ ] Test responsive design
- [ ] Test SEO (sitemap, robots.txt)
- [ ] Test rate limiting on all calculators

### FASE 5: DEPLOY FINALE (1 ora)
- [ ] Commit + Push su GitHub (calcolasubito-main)
- [ ] Vercel deploy automatico
- [ ] Verifica URL: calcolasubito.vercel.app
- [ ] Aggiungi URL a Google Search Console
- [ ] Monitora deployment logs

### FASE 6: POST-DEPLOY (1 settimana)
- [ ] Monitora Google Search Console (indicizzazione)
- [ ] Analizza traffico Google Analytics
- [ ] Raccogli feedback utenti
- [ ] Ottimizza metadata per SEO

---

## 🐛 BUG FISSI (30/03/2026)

### ✅ RISOLTI - Critical 5
1. ✅ Rata Mutuo: Aggiunto rate limit check
2. ✅ IVA: Corretto rounding con Math.round()
3. ✅ Percentuali: Mode reset OK con useEffect
4. ✅ Scorporo IVA: Aggiunto ShareButtons
5. ✅ Type Safety: Safe casting 'as unknown as'

### ✅ OGGI RISOLTI
6. ✅ AdUnit.tsx: TypeScript error fixed (declare global Window.adsbygoogle)

---

## 📈 METRICHE SUCCESSO (6 MESI)

| Metrica | Target | Stato | Timeline |
|---------|--------|-------|----------|
| Pages indicizzate | 10+ | 1/7 | Mese 1 ✅ |
| Traffico mensile | 1K+ pageview | ~50 | Mese 2-3 |
| Click da Search | 500+ | ~30 | Mese 2-3 |
| Entrate AdSense | 5€+ | $0 | Mese 2-3 |
| Calcolatori | 15+ | 5/5 ✅ | Mese 3-4 |
| **REVENUE TARGET** | **100€+/mese** | $0 | **Mese 7-8** ✅ |
| Language support | IT/EN/ES | IT only | Mese 2 |
| Backlinks | 20+ | 0 | Mese 3-6 |

---

## 📝 PROSSIMO STEP (ORA)

1. **Commit fix AdUnit.tsx**
   ```bash
   git add .
   git commit -m "fix(adsense): fix TypeScript error on window.adsbygoogle"
   git push origin main
   ```

2. **Test build locale**
   ```bash
   npm run build
   npm start
   ```

3. **Se build OK**: Vercel deploya automaticamente

4. **Quando build OK su Vercel**: Inizia Fase 2 (Stranieri)

5. **Poi Fase 3**: Multilingue (IT/EN)

---

**Status:** 🟢 READY FOR PHASE 2
**Blockers:** Nessuno (AdUnit fixed)
**Est. Time To 100€/mese:** 4-6 mesi se segui plan
**Last Updated:** 2026-03-30 09:15
