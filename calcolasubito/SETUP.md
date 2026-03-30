# 🚀 Setup CalcolaSubito

## Step 1: Installazione Locale

```bash
cd calcolasubito
npm install
```

## Step 2: Avvia Server di Sviluppo

```bash
npm run dev
```

Accedi a `http://localhost:3000`

## Step 3: Verifica Struttura

La cartella `calcolasubito/` contiene:
- ✅ `app/` - Pagine Next.js (calcolatori, privacy, cookie, sitemap)
- ✅ `components/` - Header, Footer, Calculator wrapper
- ✅ `lib/` - Utility funzioni di calcolo
- ✅ `styles/` - CSS globali Tailwind
- ✅ `public/` - robots.txt
- ✅ Config files - tsconfig, next.config, tailwind.config

## Step 4: Build Produzione

```bash
npm run build
npm start
```

## Step 5: Deploy su Vercel

```bash
npm i -g vercel
vercel
```

Vercel farà auto-deploy da GitHub ad ogni push.

## Calcolatori Live

Dopo npm run dev, accedi:
- http://localhost:3000/ - Homepage
- http://localhost:3000/percentuali - Calcolo Percentuali
- http://localhost:3000/giorni-tra-date - Giorni tra Date
- http://localhost:3000/scorporo-iva - Scorporo IVA
- http://localhost:3000/codice-fiscale - Codice Fiscale
- http://localhost:3000/rata-mutuo - Rata Mutuo

## Test Locale

```bash
npm run lint  # Check linting
npm run build # Build test
```

## Prossimi Step (Settimana 2)

1. Setup GitHub repo privato
2. Deploy su Vercel
3. Setup Google Search Console
4. SEO content writing
5. AdSense request

## Stack Verificato

✅ Next.js 14 (App Router)
✅ Tailwind CSS
✅ TypeScript
✅ Static Site Generation
✅ Zero backend required

## Troubleshooting

**Porta 3000 già in uso?**
```bash
npm run dev -- -p 3001
```

**Errore dipendenze?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problemi build?**
```bash
npm run build
npm run start
```

