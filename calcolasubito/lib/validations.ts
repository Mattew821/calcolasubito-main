import { z } from 'zod'

// Percentuali Calculator
export const percentualiSchema = z.object({
  number: z.number()
    .min(0, 'Il numero deve essere maggiore o uguale a 0')
    .finite('Il numero deve essere un valore finito'),
  percentage: z.number()
    .min(0, 'La percentuale deve essere maggiore o uguale a 0')
    .max(10000, 'La percentuale non deve superare il 10000%')
    .finite('La percentuale deve essere un valore finito'),
})

export type PercentualiInput = z.infer<typeof percentualiSchema>

// Giorni tra Date Calculator
export const giorniTraDateSchema = z.object({
  startDate: z.string()
    .min(1, 'Seleziona una data di inizio')
    .refine((date) => !isNaN(Date.parse(date)), 'Data di inizio non valida'),
  endDate: z.string()
    .min(1, 'Seleziona una data di fine')
    .refine((date) => !isNaN(Date.parse(date)), 'Data di fine non valida'),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'La data di inizio deve essere prima della data di fine',
    path: ['endDate'],
  }
)

export type GiorniTraDateInput = z.infer<typeof giorniTraDateSchema>

// Scorporo IVA Calculator
export const scorporoIvaSchema = z.object({
  amount: z.number()
    .min(0.01, 'L\'importo deve essere maggiore di 0')
    .finite('L\'importo deve essere un valore finito'),
  rate: z.number()
    .min(0, 'L\'aliquota deve essere maggiore o uguale a 0')
    .max(100, 'L\'aliquota deve essere minore o uguale a 100')
    .finite('L\'aliquota deve essere un valore finito'),
  mode: z.enum(['gross', 'net']),
})

export type ScorporoIvaInput = z.infer<typeof scorporoIvaSchema>

// Codice Fiscale Calculator
export const codiceFiscaleSchema = z.object({
  surname: z.string()
    .min(1, 'Il cognome è obbligatorio')
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(100, 'Il cognome non deve superare 100 caratteri')
    .regex(/^[a-zA-Z\s'-]+$/, 'Il cognome può contenere solo lettere, spazi, trattini e apostrofi'),
  name: z.string()
    .min(1, 'Il nome è obbligatorio')
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(100, 'Il nome non deve superare 100 caratteri')
    .regex(/^[a-zA-Z\s'-]+$/, 'Il nome può contenere solo lettere, spazi, trattini e apostrofi'),
  birthDate: z.string()
    .min(1, 'Seleziona una data di nascita')
    .refine((date) => !isNaN(Date.parse(date)), 'Data di nascita non valida'),
  birthPlace: z.string()
    .min(1, 'Seleziona un comune di nascita')
    .min(2, 'Il comune deve avere almeno 2 caratteri'),
  gender: z.enum(['M', 'F']),
})

export type CodiceFiscaleInput = z.infer<typeof codiceFiscaleSchema>

// Rata Mutuo Calculator
export const rataMutuoSchema = z.object({
  principal: z.number()
    .min(1000, 'L\'importo deve essere almeno 1.000€')
    .max(1000000, 'L\'importo non deve superare 1.000.000€')
    .finite('L\'importo deve essere un valore finito'),
  annualRate: z.number()
    .min(0, 'Il tasso deve essere maggiore o uguale a 0')
    .max(20, 'Il tasso non deve superare il 20%')
    .finite('Il tasso deve essere un valore finito'),
  years: z.number()
    .min(1, 'La durata deve essere almeno 1 anno')
    .max(40, 'La durata non deve superare 40 anni')
    .int('La durata deve essere un numero intero'),
})

export type RataMutuoInput = z.infer<typeof rataMutuoSchema>
