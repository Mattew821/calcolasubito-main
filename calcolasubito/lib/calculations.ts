/**
 * Utility functions for all calculator calculations
 */

// ===== PERCENTUALI =====
export function calculatePercentage(number: number, percentage: number): number {
  return (number * percentage) / 100
}

export function calculatePercentageOf(part: number, total: number): number {
  if (total === 0) {
    throw new Error('Total cannot be zero')
  }
  return (part / total) * 100
}

// ===== GIORNI TRA DATE =====
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000
  const startUtc = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  )
  const endUtc = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  )
  return Math.floor((endUtc - startUtc) / msPerDay)
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
/**
 * Calculates VAT application (Netto → Lordo)
 * Formula: Lordo = Netto + (Netto × Aliquota / 100)
 * Example: 100€ + 22% VAT = 100€ + 22€ = 122€
 * Source: Agenzia delle Entrate
 */
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

/**
 * Calculates VAT extraction/deduction (Lordo → Netto)
 * Formula: IVA = (Lordo × Aliquota) ÷ (100 + Aliquota)
 * Equivalent form: IVA = Lordo - (Lordo ÷ (1 + Aliquota/100))
 *
 * Mathematical proof of equivalence:
 * Let G = Lordo, r = Aliquota/100, N = Netto
 * Form 1: IVA = (G × r) / (1 + r) = (G × r × 100) / (100 + Aliquota)
 * Form 2: IVA = G - (G / (1 + r)) = G(1 - 1/(1+r)) = G × r/(1+r) ✓
 *
 * Example: 122€ lordo at 22% → IVA = 122 - (122/1.22) = 20€
 * Verification: 100€ + 20€ = 120€ (minor rounding on 122€ example)
 *
 * Source: Agenzia delle Entrate, Fiscozen, TeamSystem
 */
export function calculateNetFromGross(gross: number, vat: number): {
  gross: number
  vat: number
  net: number
} {
  const vatAmount = Math.round((gross - gross / (1 + vat / 100)) * 100) / 100
  const net = Math.round((gross - vatAmount) * 100) / 100
  return {
    gross,
    vat: vatAmount,
    net,
  }
}

// ===== CODICE FISCALE =====
// Note: Codice Fiscale calculation is implemented ONLY in lib/workers/calculations.worker.ts
// Reason: The main implementation uses require('codice-fiscale-js') which is synchronous
// and incompatible with Worker environments. Rather than duplicating logic, all Codice
// Fiscale calculations are delegated to the worker pool (see useCalculatorWorker hook).
// This ensures single source of truth and proper async handling.
// Reference: lib/workers/calculations.worker.ts - codiceFiscale handler

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
