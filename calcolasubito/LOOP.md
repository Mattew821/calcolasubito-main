# LOOP.md — CalcolaSubito
**Revisione:** 2026-08-05

## 0. Missione

Completare, correggere e validare CalcolaSubito come portale italiano di calcolatori affidabile, indicizzabile, accessibile, sicuro e adatto alla produzione.

Target: `https://calcolasubito.vercel.app`.

Stack storico da verificare: Next.js 14 App Router, React/TypeScript/Tailwind, React Hook Form/Zod, Jest/Testing Library, Playwright, modulo Python Pydantic/pytest, Vercel e GitHub Actions. Correttezza matematica, fiscale e finanziaria prevale su grafica, SEO e velocità.

## 1. Principio di correttezza

Ogni calcolatore deve avere:

`INPUT → UNITÀ → VINCOLI → FORMULA/ALGORITMO → ROUNDING → OUTPUT → EDGE CASE → FONTE/VERSIONE → TEST INDIPENDENTE → SPIEGAZIONE`.

Numero plausibile o pagina renderizzata non equivalgono a correttezza.

Classifica: matematica stabile, conversione, finanziario, fiscale/normativo, salute, data/tempo o altro.

Per parametri variabili registra fonte primaria, effective date, versione e last verified. Non inventare aliquote, soglie, coefficienti, tassi o normative.


## 2. Fonti di verità

Verità normativa:
1. `AGENTS.md`, se presente;
2. questo file;
3. requirements, traceability, ADR e specifiche approvate;
4. fonti primarie applicabili.

Verità empirica:
1. comportamento osservato;
2. repository e configurazione reali;
3. test, metriche ed evidenze;
4. preview/produzione quando pertinente;
5. `STATUS.md`/`status.md`;
6. conversazione come ultima risorsa.

In caso di divergenza:

`RIPRODUCI → VERIFICA → ROOT CAUSE → CORREGGI → TESTA → DOCUMENTA`.

Classifica i fatti come `VERIFIED`, `MEASURED`, `INFERRED`, `ASSUMED`, `UNKNOWN`, `BLOCKED` o `REJECTED`. Non trasformare ipotesi in prove.

## 3. Bootstrap e ripresa

Alla prima esecuzione, dopo compaction, cambio modello/provider o modifica della governance:

1. individua la root;
2. leggi integralmente `AGENTS.md`, questo file e poi `STATUS`;
3. esegui `git status --short`, se disponibile;
4. preserva ogni modifica preesistente;
5. ricostruisci stack, script, moduli, test, CI, deploy e milestone reali;
6. confronta lo stato dichiarato con repository e runtime;
7. correggi `STATUS` se obsoleto;
8. scegli un solo task atomico ad alto valore.

Nelle iterazioni successive usa:

`STATUS → MILESTONE → REQUISITO → FILE → TEST → STATUS`.

Prima di chiudere una milestone o dichiarare completato il progetto, rileggi integralmente il loop.

## 4. Ciclo ingegneristico

`OSSERVA → BASELINE/CRITERI → IMPLEMENTA → TESTA → RIFATTORIZZA → RETEST → DIFF REVIEW → STATUS → PROSSIMO TASK`.

Non fermarti a un piano quando esiste lavoro sicuro. Una feature interattiva non è completa se esistono soltanto backend, tipi, API, componenti non montati o build verde.

## 5. Refactoring obbligatorio

Dopo ogni modifica controlla codice morto, duplicazioni, file/cartelle obsolete, classi/componenti troppo grandi, responsabilità sovrapposte, naming, import/export, helper/hook/servizi duplicati, dipendenze, configurazioni, test fragili, documentazione, asset, segreti e log sensibili.

Cancella, sposta, rinomina, dividi o unifica soltanto dopo verifica delle referenze. Riesegui i test pertinenti dopo il refactoring.

## 6. Test ed evidenze

Ricava i comandi dal repository:

`TARGETED → UNIT/PROPERTY → MODULE/COMPONENT → TYPECHECK/LINT/STATIC → INTEGRATION → BUILD → E2E → VISUAL/A11Y → SECURITY/PERFORMANCE → RELEASE/PRODUCTION`.

Bug:

`RIPRODUCI → EXPECTED/OBSERVED → ROOT CAUSE → TEST FALLENTE quando ragionevole → FIX → RETEST → REGRESSION → VERIFIED`.

Non rimuovere test, indebolire assert, aggiungere skip o nascondere errori per ottenere verde.

Stati: `PASS`, `FAIL`, `NON_ESEGUITO`, `NON_DISPONIBILE`, `BLOCCATO_DA_DIPENDENZA`.

## 7. Contesto, OmniRoute e Ollama

- ricerche mirate, niente scansioni indiscriminate;
- niente file completi o log lunghi in chat;
- decisioni, bug ed evidenze nel repository;
- `STATUS` conciso, non append-only;
- checkpoint prima che il contesto diventi grande;
- nessuna dipendenza da hash, CCR o dedup opachi.

Se un trigger arriva mentre l'agente lavora, non avviare un secondo task; usa `streamingBehavior: "followUp"` quando disponibile.

`429`, `503`, `chat_admission_busy`, `ResourceExhausted`, timeout, upstream error, fallback OmniRoute o accodamento Ollama non sono automaticamente bug applicativi. Non modificare codice senza evidenza, non creare retry storm, salva il checkpoint e riprendi da `STATUS`.

Nessun limite artificiale al numero totale di iterazioni; una sola iterazione coerente per volta.

## 8. Autonomia e sicurezza

Senza conferma puoi correggere bug, test, refactoring, documentazione, accessibilità, sicurezza e configurazioni non distruttive.

Senza autorizzazione non eseguire reset/clean/force-push, cancellazione di modifiche utente, commit/push/PR/merge, deploy/release, operazioni distruttive su DB/cloud, eliminazione credenziali, transazioni reali o costi.

Usa `BLOCKED` solo dopo aver completato tutto il lavoro indipendente.

## 9. STATUS minimo

Mantieni: snapshot, branch/commit, working tree, ambiente, milestone, task, baseline, criteri, fatti verificati, file/modifiche/refactoring, test/evidenze, bug, decisioni, rischi, blocker, readiness e un solo prossimo task.

Aggiorna lo status all'inizio, dopo errori significativi, dopo i test e prima di terminare. Correggi dati obsoleti invece di accumulare un diario infinito.

## 10. Definition of Done

Task `PASS`: baseline e criteri verificati, implementazione completa, test pertinenti, diff review, refactoring valutato, documentazione/status aggiornati, nessuna regressione obbligatoria nota.

Milestone `PASS`: tutti i requisiti obbligatori verificati, nessun requisito soltanto assunto, test/audit conclusi, nessuno stub/TODO/placeholder obbligatorio, rischi residui dichiarati, repository eseguibile e riprendibile.

`COMPLETATO` solo dopo audit finale contro loop, requisiti, codice, test, runtime e produzione applicabile.


## 11. Inventario e matrice QA

Ricostruisci route, categorie, catalogo, formule, moduli Python/TypeScript, funzioni globali, schema input/output, fonti, test, SEO e stato production.

Mantieni:

`ROUTE × CALCOLATORE × SCENARIO × BROWSER × VIEWPORT × NUMERIC × FUNCTIONAL × SEO × A11Y × STATO × EVIDENZA`.

Nessun calcolatore è verificato senza confronto numerico reale con riferimento indipendente.

## 12. Test numerici

Copri quando pertinenti: caso normale, zero, min/max, boundary, negativo, decimali, virgola/punto, vuoto/null/undefined, NaN/Infinity, unità incompatibili, rounding, overflow/precisione, duplicati, date bisestili/timezone, versione normativa e round-trip per conversioni.

Per salute/YMYL mostra limiti, fonte, data e disclaimer appropriato; non presentare diagnosi.

## 13. UX, accessibilità e SEO

Ogni pagina chiarisce scopo, unità, CTA, risultato, formula/spiegazione, assunzioni, limiti e fonte/versione quando necessaria.

Verifica 320–375, 390–430, 768 e desktop; keyboard, focus, label/error association, live region, contrasto e reduced motion.

Per route indicizzabili: title/description unici, canonical, H1, contenuto utile, formula/esempio/limiti, link interni, sitemap/robots, duplicate content e structured data soltanto se veritiero. Le animazioni non devono nascondere contenuto SEO o generare CLS.

## 14. Sicurezza e serverless

Verifica CSP/headers, XSS/injection/open redirect, env/secret, rate limit compatibile con proxy/IPv6/serverless, method blocking, privacy/analytics, Stripe senza transazioni reali nei test, lifecycle Vercel, nessuna dipendenza da RAM/filesystem persistente, 404/500, cache e asset.

## 15. Production QA

Visita realmente il target dopo i gate locali. Prova form, risultato, reset, ricalcolo, share/copy/print, snapshot/import/export se presenti, reload/persistenza, mobile/desktop, console/network e retest production.

Bug ID `CS-####`: `OPEN → REPRODUCED → FIXING → FIXED → VERIFIED`.

## 16. DoD specifica

Catalogo inventariato; ogni formula verificata; parametri variabili versionati; validation/unità/boundary/rounding verificati; suite TypeScript/Python/E2E passano; funzioni globali verificate; SEO/a11y/responsive verificati; middleware/privacy/analytics coerenti; performance misurata; produzione verificata route per route.
