# Guida Teoria React + TypeScript (TSX)

_Generata il 2026-04-03 18:05_

## 1. Introduzione
Questa guida e scritta per chi conosce JavaScript base (object, array, funzioni, async)
ma non ha ancora una base solida su React, TSX e TypeScript.

Obiettivo pratico:
1. capire la teoria reale dietro React
2. vedere esempi di codice concreti
3. leggere riga per riga ogni esempio
4. sapere risalire da output UI al codice che lo produce

---

## 2. Cos e React
React e una libreria UI basata su componenti.

Formula mentale:
`UI = f(props, state)`

Significato:
- component: funzione che restituisce interfaccia
- props: input della funzione (come parametri)
- state: memoria interna del componente
- render: output visuale del componente
- re-render: React ricalcola la UI quando cambia state o props

Analogia con JavaScript puro:
- in JS: chiami funzione con argomenti e ottieni un valore
- in React: chiami componente con props e ottieni UI

---

## 3. Cos e TypeScript e cos e TSX
TypeScript = JavaScript + tipi statici.

Vantaggi:
- errori in fase di sviluppo, non in produzione
- codice piu leggibile
- refactor piu sicuro

TSX = TypeScript + sintassi JSX.
Esempio:

```tsx
return <h1>Ciao {name}</h1>;
```

React non usa HTML reale dentro JS.
Quel TSX viene trasformato in chiamate funzione che costruiscono un albero UI.

---

## 4. Architettura moderna frontend
Nel tuo progetto (Next.js App Router):
- `app/` -> route e pagine
- `components/` -> blocchi UI riusabili
- `hooks/` -> logica React riusabile
- `lib/` -> formule, validazioni, servizi, sicurezza
- `app/api/` -> endpoint backend integrati
- `styles/` -> CSS globale

Diagramma:

```mermaid
flowchart TD
  U[Utente] --> P[app page.tsx]
  P --> C[components]
  C --> H[hooks]
  H --> L[lib]
  P --> A[/api/v1]
  A --> L
  L --> O[Output UI o JSON]
```

---

## 5. Esempio 1: component, props, state, eventi

```tsx
1  import React, { useState } from "react";
2
3  interface CounterProps {
4    start: number;
5    label?: string;
6  }
7
8  export default function Counter({ start, label = "Contatore" }: CounterProps) {
9    const [count, setCount] = useState<number>(start);
10
11   const increment = () => setCount((prev) => prev + 1);
12   const decrement = () => setCount((prev) => prev - 1);
13
14   return (
15     <section>
16       <h2>{label}</h2>
17       <p>Valore: {count}</p>
18       <button onClick={decrement}>-</button>
19       <button onClick={increment}>+</button>
20     </section>
21   );
22 }
```

Spiegazione riga per riga:
- L1: import hook `useState`.
- L3-6: tipo props.
- L5: `label?` significa opzionale.
- L8: destructuring props + default value.
- L9: stato locale `count`.
- L11-12: handler click con updater function (`prev`).
- L14-21: TSX render.
- L18-19: eventi utente.

Perche `setCount((prev) => prev + 1)` e meglio di `setCount(count + 1)`:
- evita bug quando React batcha update multipli.

Analisi inversa:
- output "Valore: 7" deriva da L17
- L17 usa `count`
- `count` cambia in L11/L12
- L11/L12 sono legati ai click L18/L19

---

## 6. Esempio 2: form controllata + useEffect + useMemo

```tsx
1  import React, { useEffect, useMemo, useState } from "react";
2
3  type FormState = { part: string; whole: string };
4  const STORAGE_KEY = "percent-form-v1";
5
6  function parseSafe(value: string): number | null {
7    const n = Number(value);
8    return Number.isFinite(n) ? n : null;
9  }
10
11 export default function PercentForm() {
12   const [form, setForm] = useState<FormState>({ part: "", whole: "" });
13   const [error, setError] = useState<string>("");
14
15   useEffect(() => {
16     const raw = localStorage.getItem(STORAGE_KEY);
17     if (!raw) return;
18     const saved = JSON.parse(raw) as FormState;
19     setForm(saved);
20   }, []);
21
22   useEffect(() => {
23     localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
24   }, [form]);
25
26   const preview = useMemo(() => {
27     const part = parseSafe(form.part);
28     const whole = parseSafe(form.whole);
29     if (part === null || whole === null || whole === 0) return null;
30     return (part / whole) * 100;
31   }, [form]);
32
33   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
34     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
35   };
36
37   const onSubmit = (e: React.FormEvent) => {
38     e.preventDefault();
39     if (preview === null) {
40       setError("Input non valido");
41       return;
42     }
43     setError("");
44   };
45
46   return (
47     <form onSubmit={onSubmit}>
48       <input name="part" value={form.part} onChange={onChange} />
49       <input name="whole" value={form.whole} onChange={onChange} />
50       <button type="submit">Calcola</button>
51       {preview !== null && <p>{preview.toFixed(2)}%</p>}
52       {error && <p role="alert">{error}</p>}
53     </form>
54   );
55 }
```

Punti teorici principali:
- controlled input: il valore sta nello state, non nel DOM.
- effect mount (L15-20): carica da storage solo all avvio.
- effect sync (L22-24): salva quando `form` cambia.
- memo (L26-31): calcolo derivato senza ripetizioni inutili.
- guardie input (L29-30, L39-42): evitano NaN e divisione per zero.

---

## 7. Esempio 3: service API tipizzato

```ts
1  export interface CalculatePayload {
2    calculatorId: string;
3    operation?: string;
4    input: unknown;
5  }
6
7  export interface CalculateResponse<T> {
8    calculatorId: string;
9    operation: string | null;
10   result: T;
11 }
12
13 export async function callCalculate<T>(
14   apiKey: string,
15   payload: CalculatePayload
16 ): Promise<CalculateResponse<T>> {
17   const res = await fetch("/api/v1/calculate", {
18     method: "POST",
19     headers: {
20       "Content-Type": "application/json",
21       "x-api-key": apiKey,
22     },
23     body: JSON.stringify(payload),
24   });
25
26   if (!res.ok) {
27     const err = await res.json().catch(() => ({ error: "Errore API" }));
28     throw new Error(err.error || "Errore API");
29   }
30
31   return (await res.json()) as CalculateResponse<T>;
32 }
```

Teoria:
- generics `<T>`: il tipo del risultato e deciso dal chiamante.
- controllo `res.ok`: separa success da error HTTP.
- parse sicuro con fallback in catch.

---

## 8. Hook spiegati bene

### useState
- crea stato locale
- `setState` pianifica update e re-render
- meglio updater function se dipende da valore precedente

### useEffect
- side effects: fetch, localStorage, listener, timer
- dipendenze definiscono quando rieseguire
- cleanup evita leak

### useMemo
- memoizza valore calcolato
- usalo per calcoli costosi o valori derivati stabili

### useCallback
- memoizza funzione
- utile quando passi callback a figli ottimizzati (`React.memo`)

### useRef
- valore mutabile che non triggera re-render
- utile per DOM refs e cache imperativa

---

## 9. Flusso dati corretto
Regola: dati top-down.

- Parent contiene stato.
- Parent passa props ai figli.
- Figli notificano eventi al parent con callback.

Pattern: lifting state up.

---

## 10. Errori comuni
- mutare oggetti/array direttamente
- effect con dipendenze sbagliate
- usare `any` ovunque
- non gestire loading/error nelle chiamate async
- key lista non stabile

---

## 11. Best practices
- tipi espliciti su props, stato, DTO
- separa UI (`components`) da dominio (`lib`)
- valida input in frontend e backend
- test unit su formule + test e2e sui flussi
- logging errori utile ma non rumoroso

---

## 12. Mappa rapida del tuo codice
- `app/page.tsx`: homepage
- `components/Calculator.tsx`: UI condivisa calcolatori
- `lib/calculations.ts`: formule matematiche
- `lib/validations.ts`: validazioni input
- `app/api/v1/*`: API key, usage, billing
- `middleware.ts`: sicurezza edge e rate limit

---

## 13. Come studiare un file reale del progetto
Checklist pratica:
1. leggi import e tipi
2. identifica stato locale e props
3. individua handler eventi
4. segui chiamate a `lib/*` o `services`
5. mappa render condizionali
6. testa mentalmente edge case

Se vuoi, nel prossimo passo prendo un file reale tuo (es. `components/Calculator.tsx`) e te lo spiego veramente riga per riga con questo metodo.
