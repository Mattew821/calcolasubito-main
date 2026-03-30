# CalcolaSubito

Portale di calcolatori online gratuiti in italiano, ottimizzato per SEO, performance e UX.

## Novita introdotte

- Restyling UI completo con look professionale, transizioni e animazioni leggere
- Homepage con barra di ricerca istantanea dei calcolatori
- Filtro per categorie (`Finanza`, `Fisco`, `Matematica`, `Salute`, `Scuola`, `Utilita`)
- Catalogo centralizzato in `lib/calculator-catalog.ts` per mantenere coerenti home + sitemap
- Funzionalita avanzate globali per tutti i calcolatori:
  - preferiti locali
  - cronologia calcolatori visitati
  - snapshot input automatici al submit
  - ripristino ultimi valori
  - export/import snapshot JSON
  - azioni rapide: copia link, condividi, stampa, reset form, ricalcola
- Redirect canonico host in produzione verso `calcolasubito.vercel.app`
- Google Analytics GA4 con tracking page-view anche sulle navigazioni interne
- Nuovo calcolatore: `numeri-casuali`
- Nuovi calcolatori fiscali/lavoro:
  - `calcolo-imu`
  - `busta-paga-netta`
- 5 nuovi calcolatori popolari:
  - `calcolo-eta`
  - `rata-prestito`
  - `calcolo-mancia`
  - `fabbisogno-calorico`
  - `convertitore-unita-lunghezza`

## Setup locale

Prerequisiti:
- Node.js 18+
- npm

Installazione:

```bash
git clone <repo-url>
cd calcolasubito/calcolasubito
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Script principali

```bash
npm test
npm run lint
npm run build
npm run e2e
```

## Configurazione dominio

Il dominio base del portale e centralizzato:
- `lib/site-config.ts` -> `BASE_URL`
- variabile consigliata: `NEXT_PUBLIC_BASE_URL`

Esempio `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=https://calcolasubito.vercel.app
```

## Calcolatori disponibili (23)

1. Calcolo Percentuali
2. Giorni tra Date
3. Scorporo IVA
4. Codice Fiscale
5. Rata Mutuo
6. Rata Prestito
7. Sconto Percentuale
8. Aumento Percentuale
9. Interesse Semplice
10. Interesse Composto
11. Indice Massa Corporea (BMI)
12. Fabbisogno Calorico
13. Consumo Carburante
14. Area Rettangolo
15. Area Cerchio
16. Media Voti Ponderata
17. Conversione Temperatura
18. Convertitore Lunghezze
19. Numeri Casuali
20. Calcolo Età
21. Calcolo Mancia
22. Calcolo IMU
23. Busta Paga Netta

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Jest
- Playwright (E2E)

## Note

I calcoli sono forniti a scopo informativo. Per casi fiscali, legali o sanitari critici e consigliata anche una verifica professionale.
