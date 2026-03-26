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
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principale
│   ├── page.tsx           # Homepage
│   ├── percentuali/       # Calcolatore percentuali
│   ├── giorni-tra-date/   # Calcolatore giorni
│   ├── scorporo-iva/      # Calcolatore IVA
│   ├── codice-fiscale/    # Calcolatore codice fiscale
│   ├── rata-mutuo/        # Calcolatore mutuo
│   ├── privacy/           # Pagina privacy
│   ├── cookie/            # Pagina cookie policy
│   └── sitemap.ts         # Sitemap XML
├── components/            # Componenti React
│   ├── Header.tsx        # Header navigazione
│   ├── Footer.tsx        # Footer
│   └── Calculator.tsx    # Wrapper calcolatore generico
├── lib/
│   └── calculations.ts   # Utility funzioni calcolo
├── styles/
│   └── globals.css       # Stili globali Tailwind
├── public/
│   └── robots.txt        # Robots.txt per SEO
├── tailwind.config.ts    # Configurazione Tailwind
├── next.config.ts        # Configurazione Next.js
├── tsconfig.json         # Configurazione TypeScript
└── package.json          # Dipendenze npm
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

- ✅ Static Site Generation (SSG) per performance eccellente
- ✅ Meta tags ottimizzati per ogni pagina
- ✅ Open Graph e schema JSON-LD
- ✅ Sitemap.xml dinamica
- ✅ Robots.txt configurato
- ✅ Mobile-first responsive design
- ✅ PageSpeed Insights target: 95+

## Stack Tecnico

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Hosting**: Vercel (free tier)
- **Analytics**: Google Analytics (optional)
- **Ads**: Google AdSense (optional)

## Roadmap

### Fase 1 (Settimana 1-2) ✅
- [x] Setup progetto
- [x] 5 calcolatori base
- [x] Layout e componenti
- [ ] Deploy su Vercel

### Fase 2 (Settimana 3-4)
- [ ] SEO content writing
- [ ] Meta tags e schema markup
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
| 5 calcolatori live | ✅ | Settimana 1-2 |
| Google Search Console | 10+ indexed | Mese 1 |
| Traffico | 500-1K pageview | Mese 1-2 |
| Entrate AdSense | 5-30€ | Mese 2 |
| 15 calcolatori | +10K pageview | Mese 3-4 |
| **100€+/mese** | 20K+ pageview | Mese 7-8 ✅ |

## Contribuendo

Le PR sono benvenute. Per modifiche maggiori, apri un issue prima.

## License

MIT License - Vedi LICENSE file per dettagli.

## Contatti

Per domande o suggerimenti, apri un issue nel repository.
