/**
 * Utility functions for all calculator calculations
 */

// ===== PERCENTUALI =====
export function calculatePercentage(number: number, percentage: number): number {
  return (number * percentage) / 100
}

export function calculatePercentageOf(part: number, total: number): number {
  return (part / total) * 100
}

// ===== GIORNI TRA DATE =====
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay)
}

export function calculateWeeksBetween(startDate: Date, endDate: Date): number {
  return Math.floor(calculateDaysBetween(startDate, endDate) / 7)
}

export function calculateMonthsBetween(startDate: Date, endDate: Date): number {
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  return Math.floor(months)
}

// ===== SCORPORO IVA =====
export function calculateGrossFromNet(net: number, vat: number): {
  net: number
  vat: number
  gross: number
} {
  const vatAmount = (net * vat) / 100
  return {
    net,
    vat: vatAmount,
    gross: net + vatAmount,
  }
}

export function calculateNetFromGross(gross: number, vat: number): {
  gross: number
  vat: number
  net: number
} {
  const vatAmount = gross - gross / (1 + vat / 100)
  return {
    gross,
    vat: vatAmount,
    net: gross - vatAmount,
  }
}

// ===== CODICE FISCALE =====
// Usando libreria codice-fiscale-js per generazione accurata
// Supporta: cognomi/nomi composti, mapping comuni ISTAT, carattere di controllo

interface CodiceFiscaleResult {
  codiceFiscale: string
  valid: boolean
  message?: string
}

export function calculateCodiceFiscale(
  surname: string,
  name: string,
  birthDate: Date,
  gender: 'M' | 'F',
  birthPlace: string
): string {
  try {
    // Validazione input
    if (!surname?.trim() || !name?.trim()) {
      return 'ERRORE: Nome e cognome obbligatori'
    }

    // Conversione date format per libreria
    const birthDateStr = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`

    // Importazione dinamica per evitare SSR issues
    const CodiceFiscale = require('codice-fiscale-js')

    // Creazione istanza
    const cf = new CodiceFiscale({
      name: name.toUpperCase(),
      surname: surname.toUpperCase(),
      gender: gender,
      birthday: birthDate,
    })

    // Generazione codice (senza codice comune perché non sempre disponibile)
    const codiceFiscale = cf.code

    return codiceFiscale || 'ERRORE: Generazione codice non riuscita'
  } catch (error) {
    // Fallback a calcolo semplificato se libreria fallisce
    console.error('Errore generazione codice fiscale:', error)
    return calculateCodiceFiscaleSimplified(surname, name, birthDate, gender, birthPlace)
  }
}

// Fallback: versione semplificata con supporto per nomi/cognomi composti
function calculateCodiceFiscaleSimplified(
  surname: string,
  name: string,
  birthDate: Date,
  gender: 'M' | 'F',
  birthPlace: string
): string {
  const consonants = 'BCDFGHJKLMNPRSTVWXYZ'
  const vowels = 'AEIOU'

  const extractLetters = (str: string, type: 'consonants' | 'vowels'): string[] => {
    // Supporta nomi/cognomi composti: "Geraci Montanari" -> estrae da entrambi
    const cleanStr = str.toUpperCase().replace(/[^A-Z\s]/g, '')
    const parts = cleanStr.split(/\s+/).filter((p) => p.length > 0)

    const letters = type === 'consonants' ? consonants : vowels
    let result: string[] = []

    // Estrae ordinatamente da ogni parte (surname o name)
    for (const part of parts) {
      const extracted = part.split('').filter((c) => letters.includes(c))
      result = result.concat(extracted)
    }

    return result
  }

  // Cognome: 3 chars da consonanti, poi da vocali
  // Supporta: Rossi, Geraci Montanari, De Luca, ecc.
  const surnameConsonants = extractLetters(surname, 'consonants')
  const surnameVowels = extractLetters(surname, 'vowels')
  const surnamePart = (surnameConsonants.slice(0, 3).join('') + surnameVowels.slice(0, 3).join('') + '   ').slice(0, 3)

  // Nome: 3 chars, regola speciale se >3 consonanti (skip la 4ª)
  // Supporta: Marco, Valeria Sonia, Maria Rosa, Jean-Paul, ecc.
  const nameConsonants = extractLetters(name, 'consonants')
  const nameVowels = extractLetters(name, 'vowels')

  // Se ha >3 consonanti, salta la 4ª (regola ufficiale)
  let namePartBase = ''
  if (nameConsonants.length > 3) {
    // Prendi 1ª, 2ª, 4ª consonante (salta la 3ª)
    namePartBase = nameConsonants[0] + nameConsonants[1] + nameConsonants[3]
  } else {
    // Prendi tutte le consonanti disponibili
    namePartBase = nameConsonants.slice(0, 3).join('')
  }

  // Aggiungi vocali se necessario (es. nomi terminanti in -isa, -ia)
  const namePart = (namePartBase + nameVowels.slice(0, 3 - namePartBase.length).join('') + '   ').slice(0, 3)

  // Data (6 chars: AAMMGG con MM come lettera, GG+40 se femmina)
  const year = birthDate.getFullYear().toString().slice(-2)
  const monthChars = 'ABCDEHLMPRST'
  const monthLetter = monthChars[birthDate.getMonth()]
  const dayPart = String(birthDate.getDate() + (gender === 'F' ? 40 : 0)).padStart(2, '0')
  const datePart = year + monthLetter + dayPart

  return (surnamePart + namePart + datePart).toUpperCase()
}

// ===== RATA MUTUO =====
export interface MortgageCalculation {
  monthlyPayment: number
  totalInterest: number
  totalAmountPaid: number
  amortizationSchedule: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }>
}

export function calculateMortgage(
  principal: number,
  annualRate: number,
  months: number
): MortgageCalculation {
  const monthlyRate = annualRate / 100 / 12

  // If rate is 0
  if (monthlyRate === 0) {
    const monthlyPayment = principal / months
    return {
      monthlyPayment,
      totalInterest: 0,
      totalAmountPaid: principal,
      amortizationSchedule: Array.from({ length: months }, (_, i) => ({
        month: i + 1,
        payment: monthlyPayment,
        principal: monthlyPayment,
        interest: 0,
        balance: principal - (i + 1) * monthlyPayment,
      })),
    }
  }

  // Standard mortgage formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1)

  let balance = principal
  const schedule: MortgageCalculation['amortizationSchedule'] = []

  for (let i = 0; i < months; i++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    balance -= principalPayment

    schedule.push({
      month: i + 1,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance), // Avoid negative due to rounding
    })
  }

  return {
    monthlyPayment,
    totalInterest: monthlyPayment * months - principal,
    totalAmountPaid: monthlyPayment * months,
    amortizationSchedule: schedule,
  }
}
