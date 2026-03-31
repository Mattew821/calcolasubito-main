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
- Hardening sicurezza edge in `middleware.ts`:
  - blocco metodi HTTP non necessari (`POST`, `PUT`, ecc.) sulle pagine pubbliche
  - blocco path e probe tipici da scanner (`/wp-admin`, `/.env`, `phpmyadmin`, ecc.)
  - blocco query e user-agent malevoli noti
  - rate limiting per IP su due livelli (burst + finestra principale) con risposta `429`
- Google Analytics GA4 con tracking page-view anche sulle navigazioni interne
- Nuovo calcolatore: `numeri-casuali`
- Nuovo calcolatore: `cifrario-enigma` (simulatore Enigma con rotori, ring setting, reflector e plugboard)
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
npm run verify:full
npm run current:update
```

## Automazione CURRENT ad ogni push

Il repository include hook Git versionati in `calcolasubito/.githooks`:

- `pre-push`: esegue `npm run verify:full` e blocca il push se fallisce

Installazione hook (una sola volta per clone):

```bash
npm run hooks:install
```

L'aggiornamento automatico di `CURRENT.md` su ogni push e gestito dal workflow GitHub:

- `.github/workflows/current-sync.yml`: aggiorna `CURRENT.md` e, se cambia, crea commit `docs(current): auto-update after push`

## CURRENT e stato Vercel

`CURRENT.md` viene aggiornato dallo script `scripts/update-current.mjs` con:

- branch, commit e timestamp dell'ultimo push
- stato runtime pubblico del dominio
- route principali e probe sicurezza
- stato deployment Vercel da API quando `VERCEL_TOKEN` e disponibile

Per abilitare la lettura deployment via API:

```bash
# PowerShell (sessione corrente)
$env:VERCEL_TOKEN="xxxxxxxx"
```

## Configurazione dominio

Il dominio base del portale e centralizzato:
- `lib/site-config.ts` -> `BASE_URL`
- variabile consigliata: `NEXT_PUBLIC_BASE_URL`

Esempio `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=https://calcolasubito.vercel.app
```

## Configurazione sicurezza anti-abuso (opzionale)

Le soglie di protezione edge sono configurabili via env:

```bash
REQUEST_RATE_LIMIT_DISABLED=false
REQUEST_RATE_LIMIT_WINDOW_MS=60000
REQUEST_RATE_LIMIT_MAX_PER_WINDOW=240
REQUEST_RATE_LIMIT_BLOCK_MS=600000
REQUEST_RATE_LIMIT_BURST_WINDOW_MS=10000
REQUEST_RATE_LIMIT_BURST_MAX=80
REQUEST_RATE_LIMIT_BURST_BLOCK_MS=120000
REQUEST_RATE_LIMIT_MAX_KEYS=20000
```

Nota: il rate limit in-memory a livello middleware riduce flood/bot semplici, ma non sostituisce un WAF/CDN enterprise.

## API commerciale (API key + quota + pagamento)

Sistema implementato:
- creazione API key per singolo calcolatore
- quota mensile inclusa per key
- blocco automatico oltre soglia (`402`)
- link checkout Stripe per acquistare crediti extra
- webhook Stripe che accredita i crediti sulla key

Route disponibili:
- `POST /api/v1/keys` (admin) -> crea key
- `GET /api/v1/keys` (admin) -> lista key
- `PATCH /api/v1/keys/{keyId}` (admin) -> aggiorna key
- `GET /api/v1/usage` (x-api-key) -> uso e quota corrente
- `POST /api/v1/calculate` (x-api-key) -> esegue calcolo
- `POST /api/v1/billing/webhook` (Stripe) -> accredito crediti

Header auth:
- admin: `x-admin-token: <API_ADMIN_TOKEN>`
- client API: `x-api-key: <rawApiKey>`

Esempio creazione key:

```bash
curl -X POST http://localhost:3000/api/v1/keys \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Cliente A - Percentuali",
    "calculatorId": "percentuali",
    "monthlyQuota": 5000,
    "overagePackCredits": 10000,
    "overagePackPriceCents": 1990,
    "currency": "eur"
  }'
```

Esempio chiamata calcolo:

```bash
curl -X POST http://localhost:3000/api/v1/calculate \
  -H "Content-Type: application/json" \
  -H "x-api-key: cs_live...." \
  -d '{
    "calculatorId": "percentuali",
    "operation": "calculate",
    "input": { "number": 250, "percentage": 22 }
  }'
```

Se la quota e finita la risposta e `402` con `checkoutUrl`.

## Calcolatori disponibili (24)

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
24. Cifrario Enigma

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Jest
- Playwright (E2E)

## Note

I calcoli sono forniti a scopo informativo. Per casi fiscali, legali o sanitari critici e consigliata anche una verifica professionale.
