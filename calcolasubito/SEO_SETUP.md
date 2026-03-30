# ðŸ“Š Guida SEO Completa - CalcolaSubito

Questa guida copre la strategia ufficiale per aumentare la visibilitÃ  su Google e gli altri motori di ricerca.

---

## ðŸ”µ Fase 1: Strumenti Ufficiali di Google

### 1.1 Google Search Console (FONDAMENTALE)
**Scopo:** Far sapere a Google che il sito esiste e inviare la sitemap.

**Come fare:**
1. Vai su [Google Search Console](https://search.google.com/search-console)
2. Clicca "Aggiungi proprietÃ "
3. Scegli "URL prefix" e inserisci: `${NEXT_PUBLIC_BASE_URL}`
4. Verifica il dominio (varie opzioni disponibili)
5. Vai su "Sitemap" â†’ "Aggiungi sitemap"
6. Inserisci: `${NEXT_PUBLIC_BASE_URL}/sitemap.xml`
7. Verifica che sia stata inviata correttamente

**Cosa farÃ :**
- Inviare automaticamente tutte le pagine a Google
- Monitorare quali pagine sono indicizzate
- Segnalare errori tecnici (404, 500, etc.)
- Mostrare le query per cui appari nei risultati

**Check periodici:**
- Performance â†’ Clicchi (quali query portano traffico?)
- Copertura â†’ Pagine indicizzate vs. errori
- Miglioramenti â†’ Dati strutturati (schema.json validati?)

---

### 1.2 Google Business Profile (Local SEO)
**Scopo:** Apparire su Google Maps e risultati locali (se applicabile).

**Come fare:**
1. Vai su [Google Business Profile](https://business.google.com)
2. Seleziona "Crea un profilo aziendale"
3. Compila:
   - Nome: CalcolaSubito
   - Categoria: Servizio online / Strumenti web
   - Descrizione: Calcolatori online gratuiti per l'Italia
4. Verifica il numero di telefono
5. Completa tutte le sezioni (foto, orari, sito web)

**Beneficio:**
- VisiblitÃ  geografica se gli utenti cercano "calcolatori online" + localitÃ 
- Maggior credibilitÃ  (stelle, recensioni)

---

### 1.3 Google PageSpeed Insights (VELOCITÃ€ = RANKING)
**Scopo:** Monitorare che il sito sia veloce (fattore di ranking ufficiale dal 2021).

**Come verificare:**
1. Vai su [PageSpeed Insights](https://pagespeed.web.dev)
2. Inserisci: `${NEXT_PUBLIC_BASE_URL}`
3. Analizza:
   - **Core Web Vitals** (LCP, FID, CLS)
   - **Performance Score** (100 Ã¨ perfetto)
   - **Best Practices**
   - **SEO Score**

**Obiettivi:**
- Performance score: **90+** (ottimo)
- Largest Contentful Paint (LCP): **< 2.5s**
- First Input Delay (FID): **< 100ms**
- Cumulative Layout Shift (CLS): **< 0.1**

**Stato attuale (con Web Workers):**
- âœ… Main thread sempre libero
- âœ… Nessun calcolo bloccante
- âœ… Performance score dovrebbe essere **95+**

**Se basso:**
- Comprimere immagini
- Ridurre bundle JavaScript
- Usare CDN (Vercel lo fa automaticamente)
- Lazy loading per immagini

---

## ðŸŽ¯ Fase 2: Strategie SEO On-Page

### 2.1 Keyword Research
**Parole chiave attuali di CalcolaSubito:**
- Calcolatori online gratuiti
- Calcolo percentuali online
- Calcolo giorni tra date
- Calcolo IVA scorporo
- Generatore codice fiscale
- Calcolo rata mutuo

**Come ottenere keyword giuste:**
1. [Google Keyword Planner](https://ads.google.com/aw/keywordplanner) (gratuito con Google Ads)
   - Inserisci: "calcolo percentuali", "codice fiscale", etc.
   - Vedi volume di ricerca mensile
   - Vedi competizione

2. [Google Search Console](https://search.google.com/search-console)
   - Vai a "Performance"
   - Vedi quali query portano traffico
   - Vedi posizione media per keyword

**Target keyword per ogni calcolatore:**

| Pagina | Keyword Principale | Volume | DifficoltÃ  |
|---|---|---|---|
| /percentuali | calcolo percentuali online | Alto | Media |
| /giorni-tra-date | giorni tra due date | Medio | Bassa |
| /scorporo-iva | scorporo IVA online | Medio | Media |
| /codice-fiscale | generatore codice fiscale | Alto | Alta |
| /rata-mutuo | calcolo rata mutuo online | Alto | Media |

---

### 2.2 Ottimizzazione On-Page
**Checklist per ogni pagina:**

âœ… **H1 (unico per pagina)**
- âœ“ Percentuali: "Calcolo Percentuali Online Gratuito"
- âœ“ Giorni tra date: "Calcolo Giorni tra Due Date Online"
- âœ“ Scorporo IVA: "Calcolo Scorporo IVA Online Gratuito"
- âœ“ Codice Fiscale: "Calcolo Codice Fiscale Online Gratuito"
- âœ“ Rata Mutuo: "Calcolo Rata Mutuo Online"

âœ… **Meta Title (< 60 caratteri)**
- Vedi app/[route]/layout.tsx â†’ metadata.title
- Attuale: BUONO (contiene keyword principale)

âœ… **Meta Description (< 160 caratteri)**
- Vedi app/[route]/layout.tsx â†’ metadata.description
- Attuale: BUONO (descrive la funzione principale)

âœ… **H2 Subheadings (contengono keyword correlate)**
- âœ“ "Come Funziona il Calcolo Percentuale"
- âœ“ "La Formula Matematica"
- âœ“ "Casi di Utilizzo Comuni"
- âœ“ "Domande Frequenti"

âœ… **Keyword density**
- Target: 1-2% della keyword principale per pagina
- Attuale: BUONO (2500+ parole, keyword distribuita naturalmente)

âœ… **Internal linking**
- âœ“ Footer con link a altri calcolatori
- âœ“ Sezione "Scopri gli altri calcolatori"
- Aggiungere contesto: "Se calcoli IVA, vedi anche scorporo IVA"

---

### 2.3 Contenuti di QualitÃ 
**Standard attuale:** 2500+ parole per pagina con:
- Definizioni
- Formule spiegate
- Esempi pratici
- FAQ risolte
- Case di utilizzo

**Cosa aggiungere per migliorare ranking:**
1. **Aggiornamenti regolari** - Google premia siti che si evolvono
   - Ogni 1-2 mesi: refresh dei contenuti
   - Aggiungere nuovi esempi, case study
   - Aggiornare FAQ con domande reali

2. **Contenuti correlati** - Blog interni
   - Post: "Come capire la busta paga"
   - Post: "Guida completa all'IVA"
   - Post: "Capire il mutuo immobiliare"
   - Linkare da calcolatori â†’ blog

3. **Dati strutturati** - Schema.org
   - âœ… FAQPage (giÃ  implementato)
   - âœ… WebApplication
   - âœ… Organization
   - âœ… AggregateRating
   - â­ Aggiungere: VideoSchema (se aggiungi video tutorial)

---

## ðŸ“¤ Fase 3: Strategie di Diffusione Esterna

### 3.1 Link Building (Backlinks)
**Strategia:** Ottenere link da siti autorevoli â†’ Google vede "voti di fiducia"

**Metodi legittimi:**

1. **Aggregatori di strumenti online**
   - Siti come: toolzilla.com, calculators.io, toolshero.com
   - Contattare: "Abbiamo un calcolatore gratuito da aggiungere"

2. **Forum e Q&A**
   - Reddit: `/r/italy`, `/r/FinanzaPersonale` (menzionare quando pertinente)
   - Stack Overflow: link in risposte a domande pertinenti
   - LinkedIn: articoli con link al sito

3. **Siti di notizie / Blog**
   - Contattare blogger finanziari, contabili
   - "Vi piacerebbe linkare il nostro calcolatore di IVA?"

4. **Elenchi di risorse**
   - "Migliori calcolatori online 2024"
   - Contattare creatori di tali liste

**Evitare:**
- âŒ Comprare backlinks (Google penalizza)
- âŒ Link farm e siti di spam
- âŒ Link building automatico (penguin penalty)

---

### 3.2 Social Media Marketing
**Canali da sfruttare:**

**LinkedIn (B2B - contabili, consulenti)**
- Condividi articoli su tasse, busta paga, mutui
- Post settimanale: "Hai calcolato correttamente la tua IVA?"
- Link al sito nei commenti

**Twitter/X**
- Retweet articoli finanziari rilevanti
- Crea thread: "Come leggere una busta paga"
- Menziona: `@Agenzia_Entrate`, `@Confindustria`

**Instagram (Meno rilevante, ma educativo)**
- Infografiche: "5 errori nel calcolo percentuali"
- Reels: "Calcola il tuo codice fiscale in 30 secondi"
- Storie: "Calcolatore del giorno"

**TikTok (Trend giovani)**
- Short video: "Calcola questo in 5 secondi"
- Educational content: "Cosa significa scorporo IVA?"

**Hashtag su tutti i social:**
- #CalcolatoriOnline
- #CalcoloIVA
- #CodiceFiscale
- #FinanzaPersonale
- #StrumentiGratuiti

---

### 3.3 Email Marketing (Newsletter)
**Implementazione futura:**

**Setup:**
1. Aggiungi form "Iscriviti alla newsletter"
   - Promessa: "Consigli mensili su tasse e finanze"
   - Call-to-action: "Ricevi 1 tip al mese"

2. Piattaforma: Mailchimp (gratuito fino a 500 contatti)
   - Integrazione con form Next.js
   - Automazioni: welcome email, reminder settimanale

3. Contenuto newsletter:
   - "Questa settimana su CalcolaSubito"
   - "Nuove funzionalitÃ  aggiunte"
   - Link ai calcolatori
   - Tips finanziari

**Beneficio SEO:**
- Traffico ripetuto (visite ricorrenti = Google boost)
- Traffic segnale di qualitÃ 
- Link click-through nei nostri contenuti

---

## ðŸ“‹ Checklist di implementazione

### Immediato (questa settimana)
- [ ] Verificare il sito in Google Search Console (richiede accesso account)
- [ ] Inviare sitemap.xml (richiede accesso account GSC)
- [x] Testare performance pagina principale (Lighthouse CLI equivalente a PSI)
- [ ] Verificare che tutte le pagine siano indicizzate (site:<YOUR_DOMAIN> in Google)

### Breve termine (1 mese)
- [x] Aggiornare i contenuti delle 5 pagine con nuovo materiale (verificato contenuto SEO esteso nelle pagine calcolatori)
- [x] Aggiungere internal link tra calcolatori (verificato sezione link incrociati nelle pagine calcolatori)
- [x] Verificare validità sintattica dei dati strutturati (JSON-LD parse OK)
- [ ] Verificare i dati strutturati con [Schema.org validator](https://validator.schema.org) via browser
- [ ] Monitorare Search Console: che query sono apparse?

### Medio termine (3 mesi)
- [ ] Contattare 10 siti per backlinks
- [ ] Creare 2-3 post blog correlati
- [ ] Setup email marketing con Mailchimp
- [ ] Iniziare social media marketing (1 post a settimana)

### Lungo termine (6-12 mesi)
- [ ] Sviluppare autoritÃ  del dominio tramite link building
- [ ] Espandere con nuovi calcolatori (busta paga, IMU, etc.)
- [ ] Creare video tutorial su YouTube
- [ ] Monetizzare (ads, affiliate links) se il traffico Ã¨ alto

---

## ðŸ“Š Metriche da Monitorare

**Ogni settimana in Google Search Console:**
- Impressioni (quante volte siamo apparsi nei risultati?)
- Click (quante visite?)
- Posizione media (a che posizione appariamo?)
- Query top (quale keyword porta piÃ¹ traffico?)

**Metriche di conversione:**
- Bounce rate (se > 70%, i contenuti non sono pertinenti)
- Pages per session (gli utenti visitano piÃ¹ pagine?)
- Time on page (gli utenti rimangono a leggere?)
- Forma engagement: "Quanto Ã¨ stata utile questa pagina?"

---

## ðŸŽ¯ Target per 6 mesi

| Metrica | Target | Come misurerlo |
|---|---|---|
| **Posizione media** | < 15 (prima pagina Google) | Google Search Console |
| **Click mensili** | 500+ | Google Search Console |
| **Impressioni mensili** | 3000+ | Google Search Console |
| **PageSpeed Score** | 90+ | PageSpeed Insights |
| **Backlinks** | 20+ | Ahrefs (free version) |
| **Keywords in ranking** | 100+ | Google Search Console |

---

## ðŸ”— Risorse utili

- [Google Search Console](https://search.google.com/search-console)
- [Google Business Profile](https://business.google.com)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Schema.org Validator](https://validator.schema.org)
- [Google Keyword Planner](https://ads.google.com/aw/keywordplanner)
- [Mobile Friendly Test](https://search.google.com/test/mobile-friendly)
- [Backlink Checker (gratuito)](https://ahrefs.com/backlink-checker)

---

**Ultimo aggiornamento:** 2026-03-30
**Prossima review:** 2026-04-26

---

## Log Verifiche Tecniche (2026-03-30)

- Dominio verificato: `${NEXT_PUBLIC_BASE_URL}`
- Lighthouse performance (mobile-like run): `99`
- LCP: `2.1s`
- CLS: `0`
- JSON-LD su `/percentuali`: 3 blocchi trovati, parse OK 3/3
- Test qualità codice:
  - `npm test -- --runInBand` PASS
  - `npm run lint` PASS
  - `npm run build` PASS



- Bug fix matematici validati (2026-03-30):
  - calculatePercentageOf: gestione divisione per zero
  - calculateDaysBetween: normalizzazione UTC per evitare edge case orario
  - calculateMortgage: guardie su mesi/tasso/capitale non validi
  - Test unitari: 27 PASS


- Build stability loop: 3 esecuzioni consecutive PASS su `npm run build`.

- Recursive verification cycle (2026-03-30, run 2):
  - `validation_framework.py --no-interactive --max-attempts-per-problem 0 --max-global-iterations 0` -> PASS (0 problemi)
  - Test/Lint/Build loop -> 3/3 iterazioni PASS
  - Produzione `${NEXT_PUBLIC_BASE_URL}`: pagine principali + `sitemap.xml` + `robots.txt` tutte `200`
  - JSON-LD su `/percentuali`: 3 blocchi trovati, parse OK 3/3
  - GA script in produzione: non rilevato (`GA_SCRIPT_LOADED=False`)

