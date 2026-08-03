// ===== CODICE FISCALE — CALCOLO PURO =====
// FONTE: D.M. 12/1976 (regole di codificazione), Agenzia delle Entrate.
// Regola stabile (nessuna variazione annuale). Carattere di controllo al 16° posto.
// NB: omocodia (sostituzione di caratteri per omonimia) NON gestita: per generare
// un CF in assenza di conflitti e' sufficiente questo algoritmo; i CF assegnati
// possono differire per il solo codice omocodico.

const consonants = 'BCDFGHJKLMNPRSTVWXYZ'
const vowels = 'AEIOU'
const MONTH_CHARS = 'ABCDEHLMPRST'

const SPECIAL_LETTER_MAP: Record<string, string> = {
  Æ: 'AE',
  Œ: 'OE',
  Ø: 'O',
  Ł: 'L',
  Đ: 'D',
  Ð: 'D',
  Þ: 'TH',
}

export function normalizeCodiceFiscaleText(value: string): string {
  const mapped = value
    .toUpperCase()
    .replace(/[ÆŒØŁĐÐÞ]/g, (char) => SPECIAL_LETTER_MAP[char] ?? char)

  return mapped
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z\s]/g, '')
}

// Carattere di controllo: mappe ufficiali per posizione (pari/dispari 1-indexed)
const EVEN_POSITION_MAP: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
  K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
  U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
}

const ODD_POSITION_MAP: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21,
  K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14,
  U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
}

export interface CodiceFiscaleInput {
  surname: string
  name: string
  birthDate: string // ISO YYYY-MM-DD
  gender: 'M' | 'F'
  catastaleCode: string // codice catastale del comune di nascita (es. H501)
}

function extractLetters(str: string, type: 'consonants' | 'vowels'): string[] {
  const cleanStr = normalizeCodiceFiscaleText(str)
  const parts = cleanStr.split(/\s+/).filter((p) => p.length > 0)
  const letters = type === 'consonants' ? consonants : vowels
  let result: string[] = []
  for (const part of parts) {
    const extracted = part.split('').filter((c) => letters.includes(c))
    result = result.concat(extracted)
  }
  return result
}

export function buildCodiceFiscale(input: CodiceFiscaleInput): string {
  const { surname, name, birthDate, gender, catastaleCode } = input

  if (!surname || surname.trim() === '') throw new Error('Surname is required')
  if (!name || name.trim() === '') throw new Error('Name is required')
  if (gender !== 'M' && gender !== 'F') throw new Error('Gender must be M or F')
  if (!/^[A-Z0-9]{4}$/.test(catastaleCode)) throw new Error('Catastale code must be 4 characters')

  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) throw new Error('Invalid birth date')

  // Cognome: prime 3 consonanti; se < 3, si aggiungono vocali
  const surnameConsonants = extractLetters(surname, 'consonants')
  const surnameVowels = extractLetters(surname, 'vowels')
  let surnamePart = surnameConsonants.slice(0, 3).join('')
  if (surnamePart.length < 3) {
    surnamePart += surnameVowels.slice(0, 3 - surnamePart.length).join('')
  }
  surnamePart = (surnamePart + '   ').slice(0, 3)

  // Nome: se consonanti > 3 si prendono la 1a, 3a e 4a (regola ufficiale)
  const nameConsonants = extractLetters(name, 'consonants')
  const nameVowels = extractLetters(name, 'vowels')
  let namePartBase = ''
  if (nameConsonants.length > 3) {
    namePartBase = (nameConsonants[0] ?? '') + (nameConsonants[2] ?? '') + (nameConsonants[3] ?? '')
  } else {
    namePartBase = nameConsonants.slice(0, 3).join('')
  }
  const namePart = (namePartBase + nameVowels.slice(0, 3 - namePartBase.length).join('') + '   ').slice(0, 3)

  // Data: anno (2 cifre), mese (lettera), giorno (+40 per donna)
  const year = birth.getFullYear().toString().slice(-2)
  const monthLetter = MONTH_CHARS.charAt(birth.getMonth())
  const dayPart = String(birth.getDate() + (gender === 'F' ? 40 : 0)).padStart(2, '0')
  const datePart = year + monthLetter + dayPart

  const codiceSenza = (surnamePart + namePart + datePart + catastaleCode).toUpperCase()

  // Carattere di controllo (16°): somma ponderata, resto mod 26
  let sum = 0
  for (let i = 0; i < codiceSenza.length; i++) {
    const char = codiceSenza.charAt(i)
    const mapped = i % 2 === 0
      ? ODD_POSITION_MAP[char as keyof typeof ODD_POSITION_MAP]
      : EVEN_POSITION_MAP[char as keyof typeof EVEN_POSITION_MAP]
    if (mapped === undefined) {
      throw new Error(`Invalid character in codice fiscale base: ${char}`)
    }
    sum += mapped
  }

  const resto = sum % 26
  const controlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const controlDigit = controlChars[resto]

  return codiceSenza + controlDigit
}
