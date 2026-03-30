# CalcolaSubito - Guida Deploy Vercel + Google Search Console

## 📋 Pre-Deploy Checklist

- [ ] Tutti i 5 calcolatori funzionano localmente (`npm run dev`)
- [ ] `.env.local` creato con NEXT_PUBLIC_GA_ID (opzionale per deploy)
- [ ] Git repo inizializzato e committed
- [ ] Nessun errore di build: `npm run build`

---

## 🚀 Step 1: Deploy su Vercel (5 minuti)

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

**Risultato:** URL di produzione generato (es: `https://calcolasubito.vercel.app`)

### 1.4 Verifica Deploy
Visita l'URL e testa i calcolatori. Dovrebbe essere identico a localhost ma in produzione.

---

## 🔧 Step 2: Configurare Environment Variables

### 2.1 Aggiungi GA_ID
Nel Vercel dashboard:
1. Vai a **Settings → Environment Variables**
2. Aggiungi: `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX` (tuo GA ID)
3. Seleziona: Production, Preview, Development
4. Salva
5. **Redeploy:** `vercel --prod`

### 2.2 (Opzionale) Custom Domain
1. Vai a **Settings → Domains**
2. Aggiungi il tuo dominio personalizzato
3. Configura DNS sul tuo registrar
4. Verifica possesso dominio

---

## 📊 Step 3: Google Search Console Setup (10 minuti)

### 3.1 Accedi a Google Search Console
- URL: https://search.google.com/search-console
- Accedi con account Google

### 3.2 Aggiungi Sito
1. Clicca **"Aggiungi Proprietà"**
2. Inserisci URL: `https://calcolasubito.vercel.app` (o tuo custom domain)
3. **Verifica proprietà sito:**

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
2. Incolla: `https://calcolasubito.vercel.app/sitemap.xml`
3. Clicca "Invia"

**Risultato:** Google inizia a crawlare il tuo sito!

### 3.4 Monitora Indicizzazione
1. Vai a **Pagine** per vedere quante pagine sono indicizzate
2. Vai a **Rendez-vous di ricerca** per vedere i dati di ricerca (dopo 1-2 settimane)

---

## 🔍 Step 4: Verifica Implementazione

### 4.1 Test SEO
```bash
# Testa Open Graph tags
curl -I https://calcolasubito.vercel.app

# Verifica sitemap
curl https://calcolasubito.vercel.app/sitemap.xml
```

### 4.2 Test Google Analytics
1. Visita il sito
2. Apri Chrome DevTools → Console
3. Digita: `gtag`
4. Se vedi la funzione, GA è caricato correttamente
5. Vai a Google Analytics → Report Realtime → dovresti vederti

### 4.3 Test Schema Markup
1. Vai a https://schema.org/validate
2. Inserisci URL: `https://calcolasubito.vercel.app/percentuali`
3. Clicca "Validate"
4. Dovrebbe mostrare FAQPage schema ✓

---

## 📈 Step 5: Monitoring & Optimization

### 5.1 Setup Alerts
Nel Vercel dashboard:
- **Monitoring** → Enable Analytics
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

## 🔄 Deployment Workflow (Futuro)

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

## 🐛 Troubleshooting

### Problema: "Build failed"
- Verifica che `npm run build` funziona localmente
- Controlla i logs nel Vercel dashboard
- Solitamente è un missing import o TypeScript error

### Problema: "GA non traccia"
- Verifica NEXT_PUBLIC_GA_ID è settato in .env.local E Vercel
- Controlla console per gtag errors
- Assicurati di aver fatto `vercel --prod` per deployment nuovo

### Problema: "Sitemap non trovato"
- Verifica che il file `app/sitemap.ts` esiste
- Testa: `https://calcolasubito.vercel.app/sitemap.xml`
- Se 404, probabile bug nel sitemap.ts

### Problema: "Schema markup non valida"
- Testa su https://schema.org/validate
- Controlla che JSON-LD è valid
- Verifica quotes e parentheses

---

## ✅ Checklist Final

Dopo deploy:
- [ ] Sito raggiungibile da produzione URL
- [ ] Tutti i 5 calcolatori funzionano
- [ ] Sitemap.xml generato correttamente
- [ ] Google Analytics traccia visite
- [ ] Schema markup è valid
- [ ] GSC indica "Sito verificato"
- [ ] GSC ha ricevuto sitemap

**Congratulazioni! CalcolaSubito.it è LIVE! 🎉**

---

## 📞 Supporto & Documentazione

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
