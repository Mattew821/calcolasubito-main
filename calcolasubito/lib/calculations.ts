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

// ===== NUOVI CALCOLATORI =====
export interface DiscountResult {
  discountAmount: number
  finalPrice: number
}

export function calculateDiscount(price: number, discountPercent: number): DiscountResult {
  if (price < 0) {
    throw new Error('Price cannot be negative')
  }
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percent must be between 0 and 100')
  }

  const discountAmount = (price * discountPercent) / 100
  return {
    discountAmount,
    finalPrice: price - discountAmount,
  }
}

export interface IncreaseResult {
  increaseAmount: number
  finalValue: number
}

export function calculateIncrease(baseValue: number, increasePercent: number): IncreaseResult {
  if (baseValue < 0) {
    throw new Error('Base value cannot be negative')
  }
  if (increasePercent < 0) {
    throw new Error('Increase percent cannot be negative')
  }

  const increaseAmount = (baseValue * increasePercent) / 100
  return {
    increaseAmount,
    finalValue: baseValue + increaseAmount,
  }
}

export interface SimpleInterestResult {
  interest: number
  totalAmount: number
}

export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  years: number
): SimpleInterestResult {
  if (principal < 0) {
    throw new Error('Principal cannot be negative')
  }
  if (annualRate < 0) {
    throw new Error('Annual rate cannot be negative')
  }
  if (years < 0) {
    throw new Error('Years cannot be negative')
  }

  const interest = principal * (annualRate / 100) * years
  return {
    interest,
    totalAmount: principal + interest,
  }
}

export interface CompoundInterestResult {
  interest: number
  finalAmount: number
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number
): CompoundInterestResult {
  if (principal < 0) {
    throw new Error('Principal cannot be negative')
  }
  if (annualRate < 0) {
    throw new Error('Annual rate cannot be negative')
  }
  if (years < 0) {
    throw new Error('Years cannot be negative')
  }
  if (compoundsPerYear <= 0) {
    throw new Error('Compounds per year must be greater than zero')
  }

  const periodicRate = annualRate / 100 / compoundsPerYear
  const periods = years * compoundsPerYear
  const finalAmount = principal * Math.pow(1 + periodicRate, periods)
  return {
    interest: finalAmount - principal,
    finalAmount,
  }
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0) {
    throw new Error('Weight must be greater than zero')
  }
  if (heightCm <= 0) {
    throw new Error('Height must be greater than zero')
  }

  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export interface FuelConsumptionResult {
  kmPerLiter: number
  litersPer100Km: number
}

export function calculateFuelConsumption(
  distanceKm: number,
  fuelLiters: number
): FuelConsumptionResult {
  if (distanceKm <= 0) {
    throw new Error('Distance must be greater than zero')
  }
  if (fuelLiters <= 0) {
    throw new Error('Fuel liters must be greater than zero')
  }

  return {
    kmPerLiter: distanceKm / fuelLiters,
    litersPer100Km: (fuelLiters / distanceKm) * 100,
  }
}

export function calculateRectangleArea(base: number, height: number): number {
  if (base < 0 || height < 0) {
    throw new Error('Rectangle dimensions cannot be negative')
  }
  return base * height
}

export function calculateCircleArea(radius: number): number {
  if (radius < 0) {
    throw new Error('Radius cannot be negative')
  }
  return Math.PI * radius * radius
}

export function calculateWeightedAverage(values: number[], weights: number[]): number {
  if (values.length === 0) {
    throw new Error('Values cannot be empty')
  }
  if (values.length !== weights.length) {
    throw new Error('Values and weights must have same length')
  }

  let weightedSum = 0
  let totalWeight = 0

  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    const weight = weights[i]
    if (value === undefined || weight === undefined) {
      throw new Error('Values and weights must have same length')
    }
    if (!Number.isFinite(value) || !Number.isFinite(weight)) {
      throw new Error('Values and weights must be finite numbers')
    }
    if (weight < 0) {
      throw new Error('Weights cannot be negative')
    }
    weightedSum += value * weight
    totalWeight += weight
  }

  if (totalWeight === 0) {
    throw new Error('Total weight cannot be zero')
  }

  return weightedSum / totalWeight
}

export interface TemperatureConversionResult {
  celsius: number
  fahrenheit: number
  kelvin: number
}

export function convertCelsius(celsius: number): TemperatureConversionResult {
  if (!Number.isFinite(celsius)) {
    throw new Error('Celsius value must be finite')
  }
  return {
    celsius,
    fahrenheit: (celsius * 9) / 5 + 32,
    kelvin: celsius + 273.15,
  }
}

// ===== ETA =====
export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  nextBirthdayInDays: number
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getSafeBirthdayForYear(month: number, day: number, year: number): Date {
  if (month === 1 && day === 29 && !isLeapYear(year)) {
    return new Date(year, 1, 28)
  }
  return new Date(year, month, day)
}

export function calculateAge(birthDate: Date, referenceDate: Date = new Date()): AgeResult {
  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(referenceDate.getTime())) {
    throw new Error('Birth date and reference date must be valid')
  }

  const birth = normalizeDate(birthDate)
  const reference = normalizeDate(referenceDate)

  if (birth > reference) {
    throw new Error('Birth date cannot be in the future')
  }

  let years = reference.getFullYear() - birth.getFullYear()
  let months = reference.getMonth() - birth.getMonth()
  let days = reference.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    const previousMonthLastDay = new Date(reference.getFullYear(), reference.getMonth(), 0).getDate()
    days += previousMonthLastDay
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  let nextBirthday = getSafeBirthdayForYear(birth.getMonth(), birth.getDate(), reference.getFullYear())
  if (nextBirthday < reference) {
    nextBirthday = getSafeBirthdayForYear(birth.getMonth(), birth.getDate(), reference.getFullYear() + 1)
  }

  return {
    years,
    months,
    days,
    totalDays: calculateDaysBetween(birth, reference),
    nextBirthdayInDays: calculateDaysBetween(reference, nextBirthday),
  }
}

// ===== PRESTITO =====
export interface LoanResult {
  monthlyPayment: number
  totalInterest: number
  totalAmountPaid: number
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  months: number
): LoanResult {
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
    }
  }

  const monthlyPayment =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1)

  const totalAmountPaid = monthlyPayment * months

  return {
    monthlyPayment,
    totalInterest: totalAmountPaid - principal,
    totalAmountPaid,
  }
}

// ===== MANCIA =====
export interface TipResult {
  tipAmount: number
  totalAmount: number
  perPerson: number
}

export function calculateTip(
  billAmount: number,
  tipPercent: number,
  people: number
): TipResult {
  if (billAmount < 0) {
    throw new Error('Bill amount cannot be negative')
  }
  if (tipPercent < 0) {
    throw new Error('Tip percent cannot be negative')
  }
  if (!Number.isInteger(people) || people <= 0) {
    throw new Error('People must be a positive integer')
  }

  const tipAmount = (billAmount * tipPercent) / 100
  const totalAmount = billAmount + tipAmount

  return {
    tipAmount,
    totalAmount,
    perPerson: totalAmount / people,
  }
}

// ===== FABBISOGNO CALORICO =====
export type BiologicalSex = 'male' | 'female'

export interface CalorieInput {
  sex: BiologicalSex
  age: number
  weightKg: number
  heightCm: number
  activityFactor: number
}

export interface CalorieResult {
  bmr: number
  tdee: number
}

export function calculateCalorieNeeds(input: CalorieInput): CalorieResult {
  const { sex, age, weightKg, heightCm, activityFactor } = input

  if (age <= 0) {
    throw new Error('Age must be greater than zero')
  }
  if (weightKg <= 0) {
    throw new Error('Weight must be greater than zero')
  }
  if (heightCm <= 0) {
    throw new Error('Height must be greater than zero')
  }
  if (activityFactor <= 0) {
    throw new Error('Activity factor must be greater than zero')
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  const bmr = sex === 'male' ? base + 5 : base - 161

  return {
    bmr,
    tdee: bmr * activityFactor,
  }
}

// ===== CONVERSIONE LUNGHEZZE =====
export interface LengthConversionResult {
  meters: number
  kilometers: number
  centimeters: number
  millimeters: number
  miles: number
  feet: number
  inches: number
}

export function convertLengthFromMeters(meters: number): LengthConversionResult {
  if (!Number.isFinite(meters)) {
    throw new Error('Meters value must be finite')
  }
  if (meters < 0) {
    throw new Error('Meters value cannot be negative')
  }

  return {
    meters,
    kilometers: meters / 1000,
    centimeters: meters * 100,
    millimeters: meters * 1000,
    miles: meters / 1609.344,
    feet: meters * 3.280839895,
    inches: meters * 39.37007874,
  }
}
