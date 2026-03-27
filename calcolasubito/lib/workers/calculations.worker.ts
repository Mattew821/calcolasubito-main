/**
 * Web Worker per esecuzione parallela di tutti i calcoli
 * Offload dal main thread per garantire UI fluida a 60fps
 */

// ===== CSV PARSER FOR COMUNI ISTAT =====
let csvContent: string | null = null
let csvCache: Map<string, string> = new Map()

async function loadCSV(): Promise<void> {
  if (csvContent) return

  try {
    // Load CSV from public data folder
    const response = await fetch('/data/comuni.csv')
    csvContent = await response.text()

    // Parse and cache on first load
    const lines = csvContent.split('\n')
    if (lines.length < 2) return

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    const nameIndex = headers.indexOf('denominazione_italiano')
    const istatIndex = headers.indexOf('codice_catastale')

    if (nameIndex === -1 || istatIndex === -1) return

    // Build cache map for O(1) lookups
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parse CSV line with quoted field handling
      const fields: string[] = []
      let current = ''
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          fields.push(current.replace(/"/g, '').trim())
          current = ''
        } else {
          current += char
        }
      }
      fields.push(current.replace(/"/g, '').trim())

      const denominazione = fields[nameIndex]?.trim().toUpperCase()
      const catastale = fields[istatIndex]?.trim()

      if (denominazione && catastale) {
        csvCache.set(denominazione, catastale)
      }
    }
  } catch (error) {
    console.warn('Failed to load CSV:', error)
  }
}

function searchCodiceCatastale(nomeComune: string): string {
  if (!csvCache.size) {
    // Fallback if CSV not loaded
    const fallback: Record<string, string> = {
      'TARANTO': 'L049',
      'ROMA': 'H501',
      'MILANO': 'F205',
      'NAPOLI': 'N641',
      'TORINO': 'L219',
    }
    return fallback[nomeComune.trim().toUpperCase()] || 'XXXX'
  }

  const nome = nomeComune?.trim().toUpperCase()
  return csvCache.get(nome) || 'XXXX'
}

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
    // Scorporo IVA: da lordo a netto
    // IVA = (Lordo × Aliquota) ÷ (100 + Aliquota)
    const ivaAmount = (amount * rate) / (100 + rate)
    const netAmount = amount - ivaAmount
    return {
      gross: amount,
      net: netAmount,
      iva: ivaAmount,
      percentage: rate,
    }
  } else {
    // Applicazione IVA: da netto a lordo
    // IVA = Netto × (Aliquota ÷ 100)
    // Lordo = Netto + IVA
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
  gender: 'M' | 'F',
  birthPlace: string = ''
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
  // Fixed: Only add vowels if consonants < 3 (don't include extra vowels)
  let surnamePart = surnameConsonants.slice(0, 3).join('')
  if (surnamePart.length < 3) {
    surnamePart += surnameVowels.slice(0, 3 - surnamePart.length).join('')
  }
  surnamePart = (surnamePart + '   ').slice(0, 3)

  const nameConsonants = extractLetters(name, 'consonants')
  const nameVowels = extractLetters(name, 'vowels')

  let namePartBase = ''
  if (nameConsonants.length > 3) {
    namePartBase = (nameConsonants[0] ?? '') + (nameConsonants[1] ?? '') + (nameConsonants[3] ?? '')
  } else {
    namePartBase = nameConsonants.slice(0, 3).join('')
  }

  const namePart = (namePartBase + nameVowels.slice(0, 3 - namePartBase.length).join('') + '   ').slice(0, 3)

  const date = new Date(birthDate)
  const year = date.getFullYear().toString().slice(-2)
  const monthChars = 'ABCDEHLMPRST'
  const monthLetter = monthChars.charAt(date.getMonth())
  const dayPart = String(date.getDate() + (gender === 'F' ? 40 : 0)).padStart(2, '0')
  const datePart = year + monthLetter + dayPart

  // Get ISTAT code for municipality - search in CSV
  const istatCode = searchCodiceCatastale(birthPlace)

  const codiceSenza = (surnamePart + namePart + datePart + istatCode).toUpperCase()

  // Calcolo del control digit (16° carattere)
  // Algoritmo ufficiale Agenzia delle Entrate
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
  for (let i = 0; i < codiceSenza.length; i++) {
    const char = codiceSenza.charAt(i)
    if (i % 2 === 0) {
      sum += dispariMap[char as keyof typeof dispariMap] || 0
    } else {
      sum += pariMap[char as keyof typeof pariMap] || 0
    }
  }

  const resto = sum % 26
  const controlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const controlDigit = controlChars[resto]

  return codiceSenza + controlDigit
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

// Initialize: Load CSV on first worker startup
loadCSV().catch(err => console.warn('CSV loading error:', err))

// Worker message handler
self.onmessage = async (event: MessageEvent) => {
  const { id, type, payload } = event.data

  try {
    // Ensure CSV is loaded before processing
    await loadCSV()

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
          payload.gender,
          payload.birthPlace
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
