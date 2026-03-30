import { z } from 'zod'

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/
const CODICE_CATASTALE_REGEX = /^[A-Za-z][0-9]{3}$/
const COMUNE_NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'.-]+$/u

function parseStrictIsoDate(date: string): Date | null {
  const match = ISO_DATE_REGEX.exec(date)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null
  }

  return parsed
}

function isStrictIsoDate(date: string): boolean {
  return parseStrictIsoDate(date) !== null
}

function isValidBirthPlace(value: string): boolean {
  const trimmed = value.trim()
  return CODICE_CATASTALE_REGEX.test(trimmed) || COMUNE_NAME_REGEX.test(trimmed)
}

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
    .refine(isStrictIsoDate, 'Data di inizio non valida'),
  endDate: z.string()
    .min(1, 'Seleziona una data di fine')
    .refine(isStrictIsoDate, 'Data di fine non valida'),
}).refine(
  (data) => {
    const start = parseStrictIsoDate(data.startDate)
    const end = parseStrictIsoDate(data.endDate)
    if (!start || !end) return true
    return start.getTime() <= end.getTime()
  },
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
// Support for Italian citizens, foreigners in Italy, and foreigners abroad
export const codiceFiscaleItalianSchema = z.object({
  mode: z.literal('italian'),
  surname: z.string()
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(100, 'Il cognome non deve superare 100 caratteri')
    .regex(/^[a-zA-Z\s'-]+$/, 'Il cognome può contenere solo lettere, spazi, trattini e apostrofi'),
  name: z.string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(100, 'Il nome non deve superare 100 caratteri')
    .regex(/^[a-zA-Z\s'-]+$/, 'Il nome può contenere solo lettere, spazi, trattini e apostrofi'),
  birthDate: z.string()
    .min(1, 'Seleziona una data di nascita')
    .refine(isStrictIsoDate, 'Data di nascita non valida'),
  birthPlace: z.string()
    .min(2, 'Il comune deve avere almeno 2 caratteri')
    .max(100, 'Il comune non deve superare 100 caratteri')
    .refine(
      isValidBirthPlace,
      'Inserisci un comune valido o un codice catastale (es. H501)'
    ),
  gender: z.enum(['M', 'F']),
})

function validateCodiceFiscaleCheckDigit(cf: string): boolean {
  if (cf.length !== 16) return false
  const upper = cf.toUpperCase()

  const pariMap: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
    K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
    U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
  }
  const dispariMap: Record<string, number> = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21,
    K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14,
    U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
  }

  let sum = 0
  for (let i = 0; i < 15; i++) {
    const char = upper.charAt(i)
    const mapped = i % 2 === 0 ? dispariMap[char] : pariMap[char]
    if (mapped === undefined) return false
    sum += mapped
  }
  const expectedChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[sum % 26]
  return upper.charAt(15) === expectedChar
}

export const codiceFiscaleForeignerItalySchema = z.object({
  mode: z.literal('foreigner_italy'),
  codiceFiscale: z.string()
    .length(16, 'Il codice fiscale deve essere di 16 caratteri')
    .regex(/^[A-Z0-9]{16}$/, 'Il codice fiscale deve contenere solo lettere maiuscole e numeri')
    .refine(validateCodiceFiscaleCheckDigit, 'Il carattere di controllo del codice fiscale non è valido'),
})

export const codiceFiscaleForeignerAbroadSchema = z.object({
  mode: z.literal('foreigner_abroad'),
})

export const codiceFiscaleSchema = z.discriminatedUnion('mode', [
  codiceFiscaleItalianSchema,
  codiceFiscaleForeignerItalySchema,
  codiceFiscaleForeignerAbroadSchema,
])

export type CodiceFiscaleItalianInput = z.infer<typeof codiceFiscaleItalianSchema>
export type CodiceFiscaleForeignerItalyInput = z.infer<typeof codiceFiscaleForeignerItalySchema>
export type CodiceFiscaleForeignerAbroadInput = z.infer<typeof codiceFiscaleForeignerAbroadSchema>
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
