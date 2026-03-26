# CalcolaSubito.it — Suite di Calcolatori Online per l'Italia

## Piano Operativo Completo per Generare 100€+/mese in Modo Autonomo

---

## 1. OSSERVAZIONE — Il Problema Reale

Ogni giorno migliaia di italiani cercano su Google frasi come:

- "calcolo scorporo IVA" (~18.000 ricerche/mese)
- "calcolo busta paga netta" (~14.000 ricerche/mese)
- "calcolo IMU" (~22.000 ricerche/mese in prossimita delle scadenze)
- "calcolo codice fiscale" (~40.000 ricerche/mese)
- "calcolo rata mutuo" (~12.000 ricerche/mese)
- "calcolo TFR" (~8.000 ricerche/mese)
- "calcolo TARI" (~6.000 ricerche/mese)
- "calcolo interessi legali" (~3.000 ricerche/mese)

I siti esistenti sono spesso vecchi, lenti, pieni di popup e con UX pessima. C'e spazio reale per un sito veloce, pulito e mobile-first che li sostituisca.

---

## 2. IPOTESI — L'Idea Concreta

**CalcolaSubito.it**: un sito statico con 20-30 calcolatori online gratuiti, ognuno ottimizzato SEO per una keyword specifica italiana. Nessun backend necessario, tutto gira nel browser.

### Perche funziona

- Ogni calcolatore e una landing page SEO autonoma
- Il traffico e organico e ricorrente (le persone cercano questi strumenti ogni mese/anno)
- Non serve creare contenuti nuovi continuamente
- Una volta indicizzato, genera traffico passivo per anni
- Il mercato italiano ha meno competizione rispetto a quello anglofono

### Target utenti

- Lavoratori dipendenti (busta paga, TFR, ferie)
- Partite IVA e piccoli imprenditori (IVA, scorporo, ritenuta d'acconto)
- Proprietari immobiliari (IMU, TARI, cedolare secca)
- Chiunque debba fare un calcolo specifico e cerchi su Google

---

## 3. MONETIZZAZIONE — Come arrivare a 100€/mese

### Canale primario: Google AdSense

- RPM medio per siti utility italiani: 3-6€ per 1.000 pageview
- Per generare 100€/mese servono circa 20.000-33.000 pageview/mese
- Con 25 calcolatori online, servono in media 800-1.300 visite/mese per calcolatore
- Questo e raggiungibile in 4-8 mesi con buona SEO

### Canale secondario: Affiliazioni

- Link affiliati a commercialisti online (es. Fiscozen, Flextax)
- Link affiliati a comparatori mutui (es. MutuiOnline, Facile.it programma affiliazione)
- Link affiliati a software fatturazione (es. Fatture in Cloud)
- Stima aggiuntiva: 30-80€/mese con traffico maturo

### Canale terziario: Donazioni/Tip (opzionale)

- Pulsante "Offrimi un caffe" (Buy Me a Coffee o Ko-fi)
- Marginale ma a costo zero

### Proiezione realistica

| Mese    | Pageview stimate | Entrate AdSense | Affiliazioni | Totale |
|---------|-----------------|-----------------|--------------|--------|
| 1-2     | 500-1.000       | 2-5€            | 0€           | ~5€    |
| 3-4     | 3.000-5.000     | 15-25€          | 5-10€        | ~30€   |
| 5-6     | 8.000-15.000    | 40-70€          | 15-30€       | ~80€   |
| 7-8     | 20.000-30.000   | 80-120€         | 30-60€       | ~130€  |
| 12+     | 40.000+         | 150-250€        | 50-100€      | ~300€  |

---

## 4. STACK TECNICO — Tutto a Costo Zero

| Componente       | Strumento                      | Costo   |
|-----------------|-------------------------------|---------|
| Framework       | Next.js (App Router, SSG)     | Gratis  |
| Hosting         | Vercel (free tier: 100GB bw)  | Gratis  |
| Dominio         | calcolasubito.vercel.app (*)  | Gratis  |
| Analytics       | Plausible CE o Umami self-hosted, oppure GA4 | Gratis |
| Ads             | Google AdSense                | Gratis  |
| SEO monitoring  | Google Search Console         | Gratis  |
| Repo            | GitHub (privato)              | Gratis  |
| Design          | Tailwind CSS + shadcn/ui      | Gratis  |
| Icone           | Lucide React                  | Gratis  |

(*) Quando il sito genera abbastanza, investi 10-15€/anno in un dominio .it personalizzato.

**Alternativa ancora piu semplice**: deploy su GitHub Pages con un sito HTML/JS statico puro, senza framework. Funziona uguale per AdSense.

---

## 5. ARCHITETTURA — Struttura del Sito

```
calcolasubito.it/
├── /                          → Homepage con lista calcolatori
├── /calcolo-scorporo-iva      → Calcolatore scorporo IVA
├── /calcolo-busta-paga-netta  → Calcolatore stipendio netto
├── /calcolo-codice-fiscale    → Generatore codice fiscale
├── /calcolo-imu               → Calcolatore IMU
├── /calcolo-rata-mutuo        → Calcolatore rata mutuo
├── /calcolo-tfr               → Calcolatore TFR
├── /calcolo-ritenuta-acconto  → Calcolatore ritenuta d'acconto
├── /calcolo-iva               → Calcolatore IVA
├── /calcolo-interessi-legali  → Calcolatore interessi legali
├── /calcolo-cedolare-secca    → Calcolatore cedolare secca
├── /calcolo-giorni-ferie      → Calcolatore giorni ferie
├── /calcolo-tredicesima       → Calcolatore tredicesima
├── /calcolo-quattordicesima   → Calcolatore quattordicesima
├── /conversione-valuta        → Convertitore valuta (con API gratuita)
├── /calcolo-percentuale       → Calcolatore percentuali
├── /calcolo-eta               → Calcolatore eta esatta
├── /calcolo-giorni-tra-date   → Calcolatore giorni tra due date
├── /calcolo-consumo-carburante→ Calcolatore consumo auto
├── /calcolo-bmi               → Calcolatore BMI
├── /sitemap.xml               → Sitemap per Google
└── /robots.txt                → Configurazione crawler
```

### Struttura tipo di ogni pagina calcolatore

1. **H1** con la keyword esatta (es. "Calcolo Scorporo IVA Online Gratis")
2. **Il calcolatore** — form interattivo, risultato immediato, nessun reload
3. **Spiegazione SEO** — 300-500 parole che spiegano come funziona il calcolo, la formula, esempi pratici
4. **FAQ** — 3-5 domande frequenti (schema FAQ per rich snippet Google)
5. **Link interni** — "Ti potrebbe servire anche: Calcolo IVA, Calcolo Ritenuta d'Acconto"
6. **Slot AdSense** — 2-3 posizioni (sopra il calcolatore, sotto il risultato, nel footer)

---

## 6. PIANO ESECUTIVO — Passaggi Operativi

### Settimana 1-2: Setup e primi 5 calcolatori

1. Crea il repo GitHub
2. Inizializza Next.js con Tailwind + shadcn/ui
3. Crea il layout base: header, footer, sidebar con navigazione
4. Implementa i primi 5 calcolatori (quelli con piu volume):
   - Calcolo scorporo IVA
   - Calcolo codice fiscale
   - Calcolo percentuale
   - Calcolo rata mutuo
   - Calcolo giorni tra date
5. Deploy su Vercel
6. Registra il sito su Google Search Console
7. Invia la sitemap

### Settimana 3-4: Altri 10 calcolatori + SEO

8. Implementa altri 10 calcolatori
9. Scrivi il contenuto SEO per ogni pagina (formula, spiegazione, FAQ)
10. Aggiungi schema markup JSON-LD (FAQPage, WebApplication)
11. Ottimizza i meta tag: title, description, Open Graph
12. Testa la velocita con PageSpeed Insights (obiettivo: 95+)

### Mese 2: AdSense + ultimi calcolatori

13. Richiedi approvazione Google AdSense (servono ~15-20 pagine di contenuto)
14. Implementa gli ultimi 5-10 calcolatori
15. Aggiungi la pagina "Chi siamo", "Privacy Policy", "Cookie Policy" (obbligatorie per AdSense e GDPR)
16. Inserisci i blocchi pubblicitari AdSense

### Mese 3-4: Link building organico + affiliazioni

17. Rispondi a domande su forum italiani (Reddit Italia, Forum di Finanza Online, Quora IT) linkando i tuoi calcolatori come risorsa utile
18. Registrati ai programmi di affiliazione (Fiscozen, Fatture in Cloud, MutuiOnline)
19. Inserisci link affiliati contestuali nelle pagine pertinenti
20. Monitora Search Console: identifica keyword per cui stai salendo e ottimizza quelle pagine

### Mese 5+: Ottimizzazione e scaling

21. Analizza le query di ricerca in Search Console
22. Crea nuovi calcolatori basati su keyword emergenti
23. A/B testa le posizioni degli annunci per massimizzare RPM
24. Considera l'aggiunta di una sezione blog per catturare keyword long-tail

---

## 7. LIVELLO DI AUTOMAZIONE

| Attivita                       | Automazione | Note                                      |
|-------------------------------|-------------|-------------------------------------------|
| Calcoli utente                | 100%        | Tutto client-side, nessun server           |
| Hosting/deploy                | 100%        | Vercel auto-deploy da GitHub               |
| Entrate pubblicitarie        | 100%        | AdSense paga automaticamente               |
| Entrate affiliazioni         | 100%        | Tracking automatico via cookie affiliato   |
| Aggiornamento aliquote/leggi | Manuale     | 1-2 volte/anno, ~2 ore totali             |
| Monitoraggio performance     | Semi-auto   | Check mensile Search Console, ~30 min      |

**Lavoro continuativo stimato dopo il lancio: 2-3 ore al mese.**

---

## 8. VALIDAZIONE MVP — Come testare gratis prima di costruire tutto

### Test 1: Validazione della domanda (1 giorno)

- Vai su Google Keyword Planner (gratis con account Google Ads)
- Cerca i volumi per le keyword target
- Verifica che i volumi siano reali e stabili nel tempo
- Controlla la concorrenza: analizza i primi 5 risultati per ogni keyword

### Test 2: MVP minimo (3 giorni)

- Costruisci solo 3 calcolatori
- Deploya su Vercel
- Condividi su Reddit Italia, gruppi Facebook di partite IVA, forum commercialisti
- Misura: quanti click, quanto tempo sulla pagina, feedback

### Test 3: Indicizzazione (2-4 settimane)

- Dopo il deploy, monitora Google Search Console
- Se entro 30 giorni le pagine sono indicizzate e ricevono impression, l'idea e validata
- Se non ricevi impression, rivedi i contenuti SEO e la struttura

### Criterio di successo

- 1.000 pageview/mese entro il mese 3 = l'idea funziona, continua a scalare
- Meno di 200 pageview/mese al mese 3 = rivedi la nicchia o il contenuto

---

## 9. RISCHI E MITIGAZIONI

| Rischio                                    | Probabilita | Mitigazione                                                  |
|-------------------------------------------|-------------|--------------------------------------------------------------|
| Google non approva AdSense                | Media       | Assicurati di avere 20+ pagine di contenuto originale, privacy policy, no contenuto duplicato |
| Concorrenza forte sulle keyword           | Media       | Punta su keyword long-tail ("calcolo scorporo iva 22", "calcolo imu seconda casa 2025") |
| Cambio algoritmo Google                   | Bassa       | Diversifica: non dipendere da una sola keyword. Costruisci 25+ pagine |
| Aliquote fiscali cambiano                 | Certa       | Aggiorna 1-2 volte/anno. Metti un disclaimer "aggiornato a [data]" |
| Traffico lento nei primi mesi             | Alta        | Normale. La SEO richiede 3-6 mesi. Non abbandonare prima del mese 6 |
| Vercel free tier insufficiente            | Bassa       | 100GB bandwidth/mese bastano per ~500K pageview. Eventualmente migra a Cloudflare Pages (gratis illimitato) |

---

## 10. ITERAZIONE RICORSIVA — Piano di Evoluzione

### Iterazione 1 (Mese 1-3): Core

- 20 calcolatori base
- SEO on-page
- AdSense approvato

### Iterazione 2 (Mese 4-6): Ottimizzazione

- Analisi dati Search Console
- Nuovi calcolatori basati su query reali
- Affiliazioni attive
- Obiettivo: 100€/mese

### Iterazione 3 (Mese 7-12): Scaling

- 40+ calcolatori
- Blog con articoli SEO ("Come calcolare l'IMU: guida completa 2026")
- Newsletter opzionale per traffico diretto
- Obiettivo: 200-400€/mese

### Iterazione 4 (Anno 2): Espansione

- Versione in spagnolo (calcula-rapido.es) — stesso modello, mercato piu grande
- API a pagamento per sviluppatori (es. calcolo codice fiscale via API)
- Obiettivo: 500-1.000€/mese tra i due siti

---

## 11. ESEMPIO PRATICO — Calcolatore Scorporo IVA

### Logica (JavaScript puro, zero dipendenze)

```javascript
function calcolaScorporoIVA(prezzoLordo, aliquotaIVA) {
  // Formula: imponibile = prezzoLordo / (1 + aliquotaIVA/100)
  const imponibile = prezzoLordo / (1 + aliquotaIVA / 100);
  // L'IVA e la differenza tra lordo e imponibile
  const iva = prezzoLordo - imponibile;
  return {
    imponibile: Math.round(imponibile * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    totale: prezzoLordo
  };
}

// Esempio: scorporo IVA al 22% da 122€
// Risultato: { imponibile: 100, iva: 22, totale: 122 }
```

### SEO della pagina

```
Title: Calcolo Scorporo IVA Online Gratis | CalcolaSubito
Description: Calcola lo scorporo IVA in un click. Inserisci il prezzo lordo 
e l'aliquota IVA (4%, 10%, 22%) per ottenere imponibile e IVA. Gratis e immediato.
URL: /calcolo-scorporo-iva
H1: Calcolo Scorporo IVA Online
```

---

## 12. RIEPILOGO DECISIONALE

| Parametro                    | Valore                           |
|-----------------------------|----------------------------------|
| Costo iniziale              | 0€                               |
| Costo mensile               | 0€ (fino a ~500K pageview)       |
| Tempo al lancio MVP         | 1-2 settimane                    |
| Tempo a regime (100€/mese)  | 5-8 mesi                         |
| Lavoro post-lancio          | 2-3 ore/mese                     |
| Rischio finanziario         | Zero                             |
| Competenze richieste        | HTML/CSS/JS (base)               |
| Scalabilita                 | Alta (piu calcolatori = piu SEO) |

---

*Documento generato come piano operativo. Tutti i dati di traffico sono stime basate su volumi di ricerca italiani reali. I tempi di monetizzazione dipendono dalla velocita di indicizzazione Google e dalla qualita dei contenuti.*
