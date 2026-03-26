/**
 * Web Worker per esecuzione parallela di tutti i calcoli
 * Offload dal main thread per garantire UI fluida a 60fps
 */

// ===== PERCENTUALI =====
function calculatePercentage(number: number, percentage: number): number {
  return (number * percentage) / 100
}

function calculatePercentageOf(part: number, total: number): number {
  return (part / total) * 100
}

// ===== GIORNI TRA DATE =====
function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((end.getTime() - start.getTime()) / msPerDay)
}

// ===== SCORPORO IVA =====
interface IVAResult {
  gross: number
  net: number
  iva: number
  percentage: number
}

function calculateIVA(
  amount: number,
  rate: number,
  mode: 'gross' | 'net'
): IVAResult {
  if (mode === 'gross') {
    const ivaAmount = (amount * rate) / (100 + rate)
    const netAmount = amount - ivaAmount
    return {
      gross: amount,
      net: netAmount,
      iva: ivaAmount,
      percentage: rate,
    }
  } else {
    const ivaAmount = (amount * rate) / 100
    const grossAmount = amount + ivaAmount
    return {
      gross: grossAmount,
      net: amount,
      iva: ivaAmount,
      percentage: rate,
    }
  }
}

// ===== CODICE FISCALE =====
function calculateCodiceFiscaleSimplified(
  surname: string,
  name: string,
  birthDate: string,
  gender: 'M' | 'F'
): string {
  const consonants = 'BCDFGHJKLMNPRSTVWXYZ'
  const vowels = 'AEIOU'

  const extractLetters = (str: string, type: 'consonants' | 'vowels'): string[] => {
    const cleanStr = str.toUpperCase().replace(/[^A-Z\s]/g, '')
    const parts = cleanStr.split(/\s+/).filter((p) => p.length > 0)
    const letters = type === 'consonants' ? consonants : vowels
    let result: string[] = []
    for (const part of parts) {
      const extracted = part.split('').filter((c) => letters.includes(c))
      result = result.concat(extracted)
    }
    return result
  }

  const surnameConsonants = extractLetters(surname, 'consonants')
  const surnameVowels = extractLetters(surname, 'vowels')
  const surnamePart = (surnameConsonants.slice(0, 3).join('') + surnameVowels.slice(0, 3).join('') + '   ').slice(0, 3)

  const nameConsonants = extractLetters(name, 'consonants')
  const nameVowels = extractLetters(name, 'vowels')

  let namePartBase = ''
  if (nameConsonants.length > 3) {
    namePartBase = nameConsonants[0] + nameConsonants[1] + nameConsonants[3]
  } else {
    namePartBase = nameConsonants.slice(0, 3).join('')
  }

  const namePart = (namePartBase + nameVowels.slice(0, 3 - namePartBase.length).join('') + '   ').slice(0, 3)

  const date = new Date(birthDate)
  const year = date.getFullYear().toString().slice(-2)
  const monthChars = 'ABCDEHLMPRST'
  const monthLetter = monthChars[date.getMonth()]
  const dayPart = String(date.getDate() + (gender === 'F' ? 40 : 0)).padStart(2, '0')
  const datePart = year + monthLetter + dayPart

  return (surnamePart + namePart + datePart).toUpperCase()
}

// ===== RATA MUTUO =====
interface MortgageCalculation {
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

function calculateMortgage(
  principal: number,
  annualRate: number,
  months: number
): MortgageCalculation {
  const monthlyRate = annualRate / 100 / 12

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
      balance: Math.max(0, balance),
    })
  }

  return {
    monthlyPayment,
    totalInterest: monthlyPayment * months - principal,
    totalAmountPaid: monthlyPayment * months,
    amortizationSchedule: schedule,
  }
}

// Worker message handler
self.onmessage = async (event: MessageEvent) => {
  const { id, type, payload } = event.data

  try {
    let result: any

    switch (type) {
      case 'percentage':
        result = calculatePercentage(payload.number, payload.percentage)
        break
      case 'percentageOf':
        result = calculatePercentageOf(payload.part, payload.total)
        break
      case 'daysBetween':
        result = calculateDaysBetween(payload.startDate, payload.endDate)
        break
      case 'iva':
        result = calculateIVA(payload.amount, payload.rate, payload.mode)
        break
      case 'codiceFiscale':
        result = calculateCodiceFiscaleSimplified(
          payload.surname,
          payload.name,
          payload.birthDate,
          payload.gender
        )
        break
      case 'mortgage':
        result = calculateMortgage(payload.principal, payload.annualRate, payload.months)
        break
      default:
        throw new Error(`Unknown calculation type: ${type}`)
    }

    self.postMessage({ id, result, error: null })
  } catch (error) {
    self.postMessage({
      id,
      result: null,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
