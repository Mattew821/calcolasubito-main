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
export function calculateCodiceFiscale(
  surname: string,
  name: string,
  birthDate: Date,
  gender: 'M' | 'F',
  birthPlace: string
): string {
  // Simplified version - full implementation would require more logic
  // and a mapping of Italian municipalities to codes

  const consonants = 'BCDFGHJKLMNPRSTVWXYZ'
  const vowels = 'AEIOU'

  // Extract consonants and vowels
  const extractLetters = (str: string, type: 'consonants' | 'vowels'): string[] => {
    const chars = str.toUpperCase().replace(/\s/g, '')
    const letters = type === 'consonants' ? consonants : vowels
    return chars.split('').filter((c) => letters.includes(c))
  }

  // Get surname part (3 chars)
  const surnameConsonants = extractLetters(surname, 'consonants')
  const surnameVowels = extractLetters(surname, 'vowels')
  const surnamePart =
    (surnameConsonants.slice(0, 3).join('') +
      surnameVowels.slice(0, 3).join('') +
      '   ').slice(0, 3)

  // Get name part (3 chars)
  const nameConsonants = extractLetters(name, 'consonants')
  const nameVowels = extractLetters(name, 'vowels')
  const namePart =
    (nameConsonants.slice(0, 4).join('') + nameVowels.slice(0, 3).join('') + '   ').slice(
      nameConsonants.length > 3 ? 1 : 0,
      3
    )

  // Date part (6 chars)
  const year = birthDate.getFullYear().toString().slice(-2)
  const month = String(birthDate.getMonth() + 1).padStart(2, '0')
  const day = String(birthDate.getDate()).padStart(2, '0')
  const monthChars = 'ABCDEHLMPRST'
  const monthLetter = monthChars[birthDate.getMonth()]
  const dayPart = String(
    birthDate.getDate() + (gender === 'F' ? 40 : 0)
  ).padStart(2, '0')
  const datePart = year + monthLetter + dayPart

  // This is a simplified version - full implementation requires municipality codes
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
