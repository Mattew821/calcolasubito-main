/**
 * Web Worker per esecuzione parallela di tutti i calcoli
 * Offload dal main thread per garantire UI fluida a 60fps
 */

import { resolveCodiceCatastale } from '../codice-fiscale-utils'
import { buildCodiceFiscale } from '../codice-fiscale'

// ===== GENERIC CSV LOADER =====
interface CSVRecord {
  [key: string]: string
}

class GenericCSVLoader {
  private headers: string[] = []
  private cache: Map<string, Map<string, CSVRecord>> = new Map()
  private initialized = false

  async load(csvPath: string): Promise<void> {
    if (this.initialized) return

    try {
      const response = await fetch(csvPath)
      const content = await response.text()
      const lines = content.split('\n')

      if (lines.length < 1 || !lines[0]) return

      // Parse header
      this.headers = this.parseCSVLine(lines[0]!)

      // Build index for first search column (denominazione_italiano)
      const searchIndex = this.headers.indexOf('denominazione_italiano')
      if (searchIndex === -1) return

      const index = new Map<string, CSVRecord>()

      // Parse all data rows
      for (let i = 1; i < lines.length; i++) {
        const line = (lines[i] || '').trim()
        if (!line) continue

        const fields = this.parseCSVLine(line)
        const keyValue = fields[searchIndex]?.trim().toUpperCase()

        if (keyValue) {
          const record: CSVRecord = {}
          this.headers.forEach((header, idx) => {
            record[header] = fields[idx] || ''
          })
          index.set(keyValue, record)
        }
      }

      this.cache.set('denominazione_italiano', index)
      this.initialized = true
    } catch (error) {
      console.warn('CSV loading failed:', error)
    }
  }

  private parseCSVLine(line: string): string[] {
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
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
    return fields
  }

  search(columnName: string, searchValue: string, returnColumn: string): string {
    const index = this.cache.get(columnName)
    if (!index) return 'XXXX'

    const record = index.get(searchValue.trim().toUpperCase())
    return record?.[returnColumn] || 'XXXX'
  }
}

// Create instance
const csvLoader = new GenericCSVLoader()

async function loadComuniCSV(): Promise<void> {
  await csvLoader.load('/data/comuni.csv')
}

function searchCodiceCatastale(nomeComune: string): string {
  return csvLoader.search('denominazione_italiano', nomeComune, 'codice_catastale')
}

// ===== PERCENTUALI =====
function calculatePercentage(number: number, percentage: number): number {
  return (number * percentage) / 100
}

function calculatePercentageOf(part: number, total: number): number {
  if (total === 0) {
    throw new Error('Total cannot be zero')
  }
  return (part / total) * 100
}

// ===== GIORNI TRA DATE =====
function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const msPerDay = 24 * 60 * 60 * 1000
  const startUtc = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  const endUtc = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
  return Math.floor((endUtc - startUtc) / msPerDay)
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
    const ivaAmount = Math.round((amount * rate) / (100 + rate) * 100) / 100
    const netAmount = Math.round((amount - ivaAmount) * 100) / 100
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
    const ivaAmount = Math.round((amount * rate) / 100 * 100) / 100
    const grossAmount = Math.round((amount + ivaAmount) * 100) / 100
    return {
      gross: grossAmount,
      net: amount,
      iva: ivaAmount,
      percentage: rate,
    }
  }
}

// ===== CODICE FISCALE =====
// Logica pura in lib/codice-fiscale.ts (fonte unica, testata in lib/__tests__/codice-fiscale.test.ts).

function calculateCodiceFiscaleSimplified(
  surname: string,
  name: string,
  birthDate: string,
  gender: 'M' | 'F',
  birthPlace: string = ''
): string {
  const catastaleCode = resolveCodiceCatastale(birthPlace, searchCodiceCatastale)
  return buildCodiceFiscale({ surname, name, birthDate, gender, catastaleCode })
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
  if (months <= 0) {
    throw new Error('Months must be greater than zero')
  }
  if (principal < 0) {
    throw new Error('Principal cannot be negative')
  }
  if (annualRate < 0) {
    throw new Error('Annual rate cannot be negative')
  }

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
loadComuniCSV().catch(err => console.warn('CSV loading error:', err))

// Worker message handler
self.onmessage = async (event: MessageEvent) => {
  const { id, type, payload } = event.data

  try {
    // Ensure CSV is loaded before processing
    await loadComuniCSV()

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
