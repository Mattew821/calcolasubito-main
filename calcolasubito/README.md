# CalcolaSubito.it

Suite di calcolatori online gratuiti per l'Italia, ottimizzati per SEO e user experience.

## Setup

### Prerequisiti
- Node.js 18+ e npm/yarn
- Git

### Installazione

```bash
# Clona il repository
git clone <repo-url>
cd calcolasubito

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Visita `http://localhost:3000` nel browser.

## Struttura del Progetto

```
calcolasubito/
â”œâ”€â”€ app/                    # Next.js App Router
â”‚   â”œâ”€â”€ layout.tsx         # Layout principale
â”‚   â”œâ”€â”€ page.tsx           # Homepage
â”‚   â”œâ”€â”€ percentuali/       # Calcolatore percentuali
â”‚   â”œâ”€â”€ giorni-tra-date/   # Calcolatore giorni
â”‚   â”œâ”€â”€ scorporo-iva/      # Calcolatore IVA
â”‚   â”œâ”€â”€ codice-fiscale/    # Calcolatore codice fiscale
â”‚   â”œâ”€â”€ rata-mutuo/        # Calcolatore mutuo
â”‚   â”œâ”€â”€ privacy/           # Pagina privacy
â”‚   â”œâ”€â”€ cookie/            # Pagina cookie policy
â”‚   â””â”€â”€ sitemap.ts         # Sitemap XML
â”œâ”€â”€ components/            # Componenti React
â”‚   â”œâ”€â”€ Header.tsx        # Header navigazione
â”‚   â”œâ”€â”€ Footer.tsx        # Footer
â”‚   â””â”€â”€ Calculator.tsx    # Wrapper calcolatore generico
â”œâ”€â”€ lib/
â”‚   â””â”€â”€ calculations.ts   # Utility funzioni calcolo
â”œâ”€â”€ styles/
â”‚   â””â”€â”€ globals.css       # Stili globali Tailwind
â”œâ”€â”€ public/
â”‚   â””â”€â”€ robots.txt        # Robots.txt per SEO
â”œâ”€â”€ tailwind.config.ts    # Configurazione Tailwind
â”œâ”€â”€ next.config.ts        # Configurazione Next.js
â”œâ”€â”€ tsconfig.json         # Configurazione TypeScript
â””â”€â”€ package.json          # Dipendenze npm
```

## Calcolatori Implementati

1. **Calcolo Percentuali** - Calcola percentuali e proporzioni
2. **Giorni tra Date** - Calcola giorni/settimane/mesi tra due date
3. **Scorporo IVA** - Calcola imponibile e IVA da importi lordi/netti
4. **Codice Fiscale** - Genera il codice fiscale italiano
5. **Rata Mutuo** - Calcola rata mensile e ammortamento

## Build e Deploy

### Build Locale
```bash
npm run build
npm start
```

### Deploy su Vercel
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## SEO e Performance

- âœ… Static Site Generation (SSG) per performance eccellente
- âœ… Meta tags ottimizzati per ogni pagina
- âœ… Open Graph e schema JSON-LD
- âœ… Sitemap.xml dinamica
- âœ… Robots.txt configurato
- âœ… Mobile-first responsive design
- âœ… PageSpeed Insights target: 95+

## Stack Tecnico

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Hosting**: Vercel (free tier)
- **Analytics**: Google Analytics (optional)
- **Ads**: Google AdSense (optional)

## Roadmap

### Fase 1 (Settimana 1-2) âœ…
- [x] Setup progetto
- [x] 5 calcolatori base
- [x] Layout e componenti
- [x] Deploy su Vercel

### Fase 2 (Settimana 3-4)
- [ ] SEO content writing
- [x] Meta tags e schema markup
- [ ] Google Search Console setup
- [ ] AdSense request

### Fase 3 (Mese 2-3)
- [ ] Aggiungi altri 10 calcolatori
- [ ] Link building
- [ ] Affiliazioni (Fiscozen, Flextax, etc.)

### Fase 4 (Mese 4+)
- [ ] Monitoring e optimization
- [ ] Aggiungi 25+ calcolatori totali
- [ ] Possibile versione spagnola

## Metriche di Successo

| Milestone | Target | Timeline |
|-----------|--------|----------|
| 5 calcolatori live | âœ… | Settimana 1-2 |
| Google Search Console | 10+ indexed | Mese 1 |
| Traffico | 500-1K pageview | Mese 1-2 |
| Entrate AdSense | 5-30â‚¬ | Mese 2 |
| 15 calcolatori | +10K pageview | Mese 3-4 |
| **100â‚¬+/mese** | 20K+ pageview | Mese 7-8 âœ… |

## Contribuendo

Le PR sono benvenute. Per modifiche maggiori, apri un issue prima.

## License

MIT License - Vedi LICENSE file per dettagli.

## Contatti

Per domande o suggerimenti, apri un issue nel repository.

