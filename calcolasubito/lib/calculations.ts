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

export interface PercentageChangeResult {
  initialValue: number
  finalValue: number
  absoluteChange: number
  percentChange: number
}

export function calculatePercentageChange(
  initialValue: number,
  finalValue: number
): PercentageChangeResult {
  if (!Number.isFinite(initialValue) || !Number.isFinite(finalValue)) {
    throw new Error('Values must be finite numbers')
  }
  if (initialValue === 0) {
    throw new Error('Initial value cannot be zero')
  }

  const absoluteChange = finalValue - initialValue
  const percentChange = (absoluteChange / initialValue) * 100
  return {
    initialValue,
    finalValue,
    absoluteChange,
    percentChange,
  }
}

export interface SequentialPercentageResult {
  baseValue: number
  changes: number[]
  finalValue: number
  totalPercentChange: number
  steps: Array<{
    changePercent: number
    previousValue: number
    nextValue: number
  }>
}

export function applySequentialPercentages(
  baseValue: number,
  changes: number[]
): SequentialPercentageResult {
  if (!Number.isFinite(baseValue)) {
    throw new Error('Base value must be finite')
  }
  if (!changes.every((value) => Number.isFinite(value))) {
    throw new Error('All percentage changes must be finite numbers')
  }

  let currentValue = baseValue
  const steps: SequentialPercentageResult['steps'] = []

  for (const changePercent of changes) {
    const previousValue = currentValue
    currentValue = currentValue * (1 + changePercent / 100)
    steps.push({
      changePercent,
      previousValue,
      nextValue: currentValue,
    })
  }

  const totalPercentChange =
    baseValue === 0 ? Number.NaN : ((currentValue - baseValue) / baseValue) * 100

  return {
    baseValue,
    changes,
    finalValue: currentValue,
    totalPercentChange,
    steps,
  }
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

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function isWeekendDay(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export interface BusinessDaysOptions {
  includeEndDate?: boolean
  holidays?: Date[]
}

export function calculateBusinessDaysBetween(
  startDate: Date,
  endDate: Date,
  options: BusinessDaysOptions = {}
): number {
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid start or end date')
  }
  if (startDate > endDate) {
    throw new Error('Start date must be before or equal to end date')
  }

  const includeEndDate = options.includeEndDate ?? false
  const holidays = new Set(
    (options.holidays ?? []).map((date) => {
      const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      return normalized.getTime()
    })
  )

  const normalizedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const normalizedEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  const endBoundary = includeEndDate ? addDays(normalizedEnd, 1) : normalizedEnd

  let current = normalizedStart
  let businessDays = 0

  while (current < endBoundary) {
    const timestamp = current.getTime()
    if (!isWeekendDay(current) && !holidays.has(timestamp)) {
      businessDays += 1
    }
    current = addDays(current, 1)
  }

  return businessDays
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

export interface MortgageAdvancedInput {
  principal: number
  annualRate: number
  months: number
  extraMonthlyPayment?: number
  monthlyFees?: number
  upfrontCosts?: number
}

export interface MortgageAdvancedResult extends MortgageCalculation {
  extraMonthlyPayment: number
  monthlyFees: number
  upfrontCosts: number
  actualMonths: number
  monthsSaved: number
  totalInterestSaved: number
  totalPaidWithFeesAndCosts: number
}

export function calculateMortgageAdvanced(
  input: MortgageAdvancedInput
): MortgageAdvancedResult {
  const {
    principal,
    annualRate,
    months,
    extraMonthlyPayment = 0,
    monthlyFees = 0,
    upfrontCosts = 0,
  } = input

  if (!Number.isFinite(extraMonthlyPayment) || extraMonthlyPayment < 0) {
    throw new Error('Extra monthly payment cannot be negative')
  }
  if (!Number.isFinite(monthlyFees) || monthlyFees < 0) {
    throw new Error('Monthly fees cannot be negative')
  }
  if (!Number.isFinite(upfrontCosts) || upfrontCosts < 0) {
    throw new Error('Upfront costs cannot be negative')
  }

  const baseline = calculateMortgage(principal, annualRate, months)
  const monthlyRate = annualRate / 100 / 12
  const baseMonthlyPayment = baseline.monthlyPayment

  let remainingBalance = principal
  let currentMonth = 0
  let totalInterest = 0
  let totalPaid = 0
  const schedule: MortgageCalculation['amortizationSchedule'] = []

  while (remainingBalance > 1e-8 && currentMonth < months) {
    currentMonth += 1
    const interestPayment = remainingBalance * monthlyRate
    let principalPayment = baseMonthlyPayment + extraMonthlyPayment - interestPayment

    if (monthlyRate === 0) {
      principalPayment = Math.min(
        remainingBalance,
        principal / months + extraMonthlyPayment
      )
    } else {
      principalPayment = Math.min(remainingBalance, Math.max(0, principalPayment))
    }

    const actualPaymentWithoutFees = principalPayment + interestPayment
    const actualPaymentWithFees = actualPaymentWithoutFees + monthlyFees

    remainingBalance -= principalPayment
    totalInterest += interestPayment
    totalPaid += actualPaymentWithFees

    schedule.push({
      month: currentMonth,
      payment: actualPaymentWithoutFees,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance),
    })
  }

  const totalAmountPaid = schedule.reduce((sum, row) => sum + row.payment, 0)
  const totalPaidWithFeesAndCosts = totalPaid + upfrontCosts

  return {
    monthlyPayment: baseMonthlyPayment,
    totalInterest,
    totalAmountPaid,
    amortizationSchedule: schedule,
    extraMonthlyPayment,
    monthlyFees,
    upfrontCosts,
    actualMonths: schedule.length,
    monthsSaved: Math.max(0, months - schedule.length),
    totalInterestSaved: Math.max(0, baseline.totalInterest - totalInterest),
    totalPaidWithFeesAndCosts,
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

export type WeightUnit = 'kg' | 'lb' | 'st'
export type HeightUnit = 'cm' | 'm' | 'ft' | 'in'

const WEIGHT_TO_KG: Record<WeightUnit, number> = {
  kg: 1,
  lb: 0.45359237,
  st: 6.35029318,
}

const HEIGHT_TO_CM: Record<HeightUnit, number> = {
  cm: 1,
  m: 100,
  ft: 30.48,
  in: 2.54,
}

function toKg(weight: number, unit: WeightUnit): number {
  return weight * WEIGHT_TO_KG[unit]
}

function fromKg(weightKg: number, unit: WeightUnit): number {
  return weightKg / WEIGHT_TO_KG[unit]
}

function toCm(height: number, unit: HeightUnit): number {
  return height * HEIGHT_TO_CM[unit]
}

export type BmiCategory =
  | 'Sottopeso'
  | 'Normopeso'
  | 'Sovrappeso'
  | 'Obesita I'
  | 'Obesita II'
  | 'Obesita III'

export interface BmiDetailedResult {
  bmi: number
  bmiPrime: number
  category: BmiCategory
  weightKg: number
  heightCm: number
  healthyWeightRangeKg: {
    min: number
    max: number
  }
}

function classifyBmi(value: number): BmiCategory {
  if (value < 18.5) return 'Sottopeso'
  if (value < 25) return 'Normopeso'
  if (value < 30) return 'Sovrappeso'
  if (value < 35) return 'Obesita I'
  if (value < 40) return 'Obesita II'
  return 'Obesita III'
}

export function calculateBmiDetailed(input: {
  weight: number
  height: number
  weightUnit?: WeightUnit
  heightUnit?: HeightUnit
}): BmiDetailedResult {
  const weightUnit = input.weightUnit ?? 'kg'
  const heightUnit = input.heightUnit ?? 'cm'

  if (!Number.isFinite(input.weight) || input.weight <= 0) {
    throw new Error('Weight must be greater than zero')
  }
  if (!Number.isFinite(input.height) || input.height <= 0) {
    throw new Error('Height must be greater than zero')
  }

  const weightKg = toKg(input.weight, weightUnit)
  const heightCm = toCm(input.height, heightUnit)
  const heightM = heightCm / 100

  const bmi = weightKg / (heightM * heightM)
  const bmiPrime = bmi / 25

  return {
    bmi,
    bmiPrime,
    category: classifyBmi(bmi),
    weightKg,
    heightCm,
    healthyWeightRangeKg: {
      min: 18.5 * heightM * heightM,
      max: 24.9 * heightM * heightM,
    },
  }
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  return calculateBmiDetailed({
    weight: weightKg,
    height: heightCm,
    weightUnit: 'kg',
    heightUnit: 'cm',
  }).bmi
}

export interface FuelConsumptionResult {
  kmPerLiter: number
  litersPer100Km: number
}

export type DistanceUnit = 'km' | 'mi'
export type FuelUnit = 'l' | 'gal_us' | 'gal_uk' | 'kg' | 'kwh'

export interface FuelConsumptionDetailedInput {
  distance: number
  distanceUnit?: DistanceUnit
  fuelAmount: number
  fuelUnit?: FuelUnit
  unitPrice?: number | null
}

export interface FuelConsumptionDetailedResult {
  distanceKm: number
  distanceUnit: DistanceUnit
  fuelAmount: number
  fuelUnit: FuelUnit
  kmPerFuelUnit: number
  fuelUnitsPer100Km: number
  kmPerLiter: number | null
  litersPer100Km: number | null
  mpgUs: number | null
  mpgUk: number | null
  totalCost: number | null
  costPer100Km: number | null
}

const DISTANCE_TO_KM: Record<DistanceUnit, number> = {
  km: 1,
  mi: 1.609344,
}

const FUEL_TO_LITER: Partial<Record<FuelUnit, number>> = {
  l: 1,
  gal_us: 3.785411784,
  gal_uk: 4.54609,
}

function toKm(distance: number, unit: DistanceUnit): number {
  const factor = DISTANCE_TO_KM[unit]
  return distance * factor
}

function toLiters(fuelAmount: number, unit: FuelUnit): number | null {
  const factor = FUEL_TO_LITER[unit]
  if (factor === undefined) {
    return null
  }
  return fuelAmount * factor
}

export function calculateFuelConsumptionDetailed(
  input: FuelConsumptionDetailedInput
): FuelConsumptionDetailedResult {
  const distanceUnit = input.distanceUnit ?? 'km'
  const fuelUnit = input.fuelUnit ?? 'l'

  if (!Number.isFinite(input.distance) || input.distance <= 0) {
    throw new Error('Distance must be greater than zero')
  }
  if (!Number.isFinite(input.fuelAmount) || input.fuelAmount <= 0) {
    throw new Error('Fuel amount must be greater than zero')
  }
  if (input.unitPrice !== undefined && input.unitPrice !== null) {
    if (!Number.isFinite(input.unitPrice) || input.unitPrice < 0) {
      throw new Error('Unit price must be greater or equal to zero')
    }
  }

  const distanceKm = toKm(input.distance, distanceUnit)
  const liters = toLiters(input.fuelAmount, fuelUnit)
  const kmPerFuelUnit = distanceKm / input.fuelAmount
  const fuelUnitsPer100Km = (input.fuelAmount / distanceKm) * 100

  const kmPerLiter = liters ? distanceKm / liters : null
  const litersPer100Km = liters ? (liters / distanceKm) * 100 : null
  const mpgUs = kmPerLiter ? kmPerLiter * 2.352145833 : null
  const mpgUk = kmPerLiter ? kmPerLiter * 2.824809364548 : null

  const totalCost =
    input.unitPrice !== undefined && input.unitPrice !== null
      ? input.fuelAmount * input.unitPrice
      : null
  const costPer100Km = totalCost !== null ? (totalCost / distanceKm) * 100 : null

  return {
    distanceKm,
    distanceUnit,
    fuelAmount: input.fuelAmount,
    fuelUnit,
    kmPerFuelUnit,
    fuelUnitsPer100Km,
    kmPerLiter,
    litersPer100Km,
    mpgUs,
    mpgUk,
    totalCost,
    costPer100Km,
  }
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

  const detailed = calculateFuelConsumptionDetailed({
    distance: distanceKm,
    distanceUnit: 'km',
    fuelAmount: fuelLiters,
    fuelUnit: 'l',
  })
  if (detailed.kmPerLiter === null || detailed.litersPer100Km === null) {
    throw new Error('Fuel liters conversion unavailable')
  }
  return {
    kmPerLiter: detailed.kmPerLiter,
    litersPer100Km: detailed.litersPer100Km,
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

export type AreaInputUnit = 'm' | 'km' | 'cm' | 'mm' | 'mi' | 'yd' | 'ft' | 'in'

const AREA_INPUT_TO_METERS: Record<AreaInputUnit, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
}

export interface AreaConversionResult {
  squareMeters: number
  squareKilometers: number
  squareCentimeters: number
  squareMillimeters: number
  squareMiles: number
  squareYards: number
  squareFeet: number
  squareInches: number
  hectares: number
  acres: number
}

export interface RectangleAreaDetailedResult {
  inputUnit: AreaInputUnit
  base: number
  height: number
  perimeterInInputUnit: number
  areaInInputUnit: number
  area: AreaConversionResult
}

export interface CircleAreaDetailedResult {
  inputUnit: AreaInputUnit
  radius: number
  diameterInInputUnit: number
  circumferenceInInputUnit: number
  areaInInputUnit: number
  area: AreaConversionResult
}

export function convertAreaFromSquareMeters(squareMeters: number): AreaConversionResult {
  if (!Number.isFinite(squareMeters)) {
    throw new Error('Area value must be finite')
  }
  if (squareMeters < 0) {
    throw new Error('Area value cannot be negative')
  }

  return {
    squareMeters,
    squareKilometers: squareMeters / 1_000_000,
    squareCentimeters: squareMeters * 10_000,
    squareMillimeters: squareMeters * 1_000_000,
    squareMiles: squareMeters / 2_589_988.110336,
    squareYards: squareMeters * 1.1959900463011,
    squareFeet: squareMeters * 10.7639104167097,
    squareInches: squareMeters * 1550.0031000062,
    hectares: squareMeters / 10_000,
    acres: squareMeters / 4046.8564224,
  }
}

export function calculateRectangleAreaDetailed(
  base: number,
  height: number,
  inputUnit: AreaInputUnit = 'm'
): RectangleAreaDetailedResult {
  if (!Number.isFinite(base) || !Number.isFinite(height)) {
    throw new Error('Rectangle dimensions must be finite')
  }
  if (base < 0 || height < 0) {
    throw new Error('Rectangle dimensions cannot be negative')
  }

  const factor = AREA_INPUT_TO_METERS[inputUnit]
  const areaInInputUnit = base * height
  const squareMeters = areaInInputUnit * factor * factor

  return {
    inputUnit,
    base,
    height,
    perimeterInInputUnit: 2 * (base + height),
    areaInInputUnit,
    area: convertAreaFromSquareMeters(squareMeters),
  }
}

export function calculateCircleAreaDetailed(
  radius: number,
  inputUnit: AreaInputUnit = 'm'
): CircleAreaDetailedResult {
  if (!Number.isFinite(radius)) {
    throw new Error('Radius must be finite')
  }
  if (radius < 0) {
    throw new Error('Radius cannot be negative')
  }

  const factor = AREA_INPUT_TO_METERS[inputUnit]
  const areaInInputUnit = Math.PI * radius * radius
  const squareMeters = areaInInputUnit * factor * factor

  return {
    inputUnit,
    radius,
    diameterInInputUnit: radius * 2,
    circumferenceInInputUnit: 2 * Math.PI * radius,
    areaInInputUnit,
    area: convertAreaFromSquareMeters(squareMeters),
  }
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
  rankine: number
}

export type TemperatureUnit = 'c' | 'f' | 'k' | 'r'

function toCelsius(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'c':
      return value
    case 'f':
      return ((value - 32) * 5) / 9
    case 'k':
      return value - 273.15
    case 'r':
      return ((value - 491.67) * 5) / 9
    default:
      return value
  }
}

export function convertTemperature(value: number, fromUnit: TemperatureUnit): TemperatureConversionResult {
  if (!Number.isFinite(value)) {
    throw new Error('Temperature value must be finite')
  }
  const celsius = toCelsius(value, fromUnit)
  if (celsius < -273.15) {
    throw new Error('Temperature cannot be below absolute zero')
  }

  const kelvin = celsius + 273.15
  const fahrenheit = (celsius * 9) / 5 + 32
  const rankine = (kelvin * 9) / 5

  return {
    celsius,
    fahrenheit,
    kelvin,
    rankine,
  }
}

export function convertCelsius(celsius: number): TemperatureConversionResult {
  return convertTemperature(celsius, 'c')
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

export type TipRoundingMode = 'none' | 'nearest_0_05' | 'up_0_05' | 'up_0_10' | 'up_1'

export interface TipDetailedInput {
  billAmount: number
  tipPercent: number
  people: number
  servicePercent?: number
  rounding?: TipRoundingMode
}

export interface TipDetailedResult extends TipResult {
  serviceAmount: number
  subtotal: number
  perPersonRaw: number
  perPersonRounded: number
  roundingMode: TipRoundingMode
  roundingDelta: number
}

function roundToStep(value: number, step: number, mode: 'nearest' | 'up'): number {
  if (mode === 'up') {
    return Math.ceil(value / step) * step
  }
  return Math.round(value / step) * step
}

function applyTipRounding(value: number, mode: TipRoundingMode): number {
  switch (mode) {
    case 'nearest_0_05':
      return roundToStep(value, 0.05, 'nearest')
    case 'up_0_05':
      return roundToStep(value, 0.05, 'up')
    case 'up_0_10':
      return roundToStep(value, 0.1, 'up')
    case 'up_1':
      return Math.ceil(value)
    case 'none':
    default:
      return value
  }
}

export function calculateTipDetailed(input: TipDetailedInput): TipDetailedResult {
  const servicePercent = input.servicePercent ?? 0
  const roundingMode = input.rounding ?? 'none'

  if (!Number.isFinite(input.billAmount) || input.billAmount < 0) {
    throw new Error('Bill amount cannot be negative')
  }
  if (!Number.isFinite(input.tipPercent) || input.tipPercent < 0) {
    throw new Error('Tip percent cannot be negative')
  }
  if (!Number.isFinite(servicePercent) || servicePercent < 0) {
    throw new Error('Service percent cannot be negative')
  }
  if (!Number.isInteger(input.people) || input.people <= 0) {
    throw new Error('People must be a positive integer')
  }

  const serviceAmount = (input.billAmount * servicePercent) / 100
  const subtotal = input.billAmount + serviceAmount
  const tipAmount = (input.billAmount * input.tipPercent) / 100
  const totalAmount = subtotal + tipAmount
  const perPersonRaw = totalAmount / input.people
  const perPersonRounded = applyTipRounding(perPersonRaw, roundingMode)

  return {
    tipAmount,
    totalAmount,
    perPerson: perPersonRaw,
    serviceAmount,
    subtotal,
    perPersonRaw,
    perPersonRounded,
    roundingMode,
    roundingDelta: perPersonRounded * input.people - totalAmount,
  }
}

export function calculateTip(
  billAmount: number,
  tipPercent: number,
  people: number
): TipResult {
  const detailed = calculateTipDetailed({
    billAmount,
    tipPercent,
    people,
    servicePercent: 0,
    rounding: 'none',
  })
  return {
    tipAmount: detailed.tipAmount,
    totalAmount: detailed.totalAmount,
    perPerson: detailed.perPerson,
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

export interface CalorieMacroSplit {
  proteinPercent: number
  carbsPercent: number
  fatPercent: number
}

export interface CaloriePlanInput {
  sex: BiologicalSex
  age: number
  weight: number
  weightUnit?: WeightUnit
  height: number
  heightUnit?: HeightUnit
  activityFactor: number
  goalPercent?: number
  macroSplit?: CalorieMacroSplit
}

export interface CaloriePlanResult extends CalorieResult {
  weightKg: number
  heightCm: number
  goalPercent: number
  calorieDelta: number
  targetCalories: number
  macros: {
    proteinGrams: number
    carbsGrams: number
    fatGrams: number
  }
}

const DEFAULT_MACRO_SPLIT: CalorieMacroSplit = {
  proteinPercent: 30,
  carbsPercent: 45,
  fatPercent: 25,
}

function validateMacroSplit(split: CalorieMacroSplit): void {
  const values = [split.proteinPercent, split.carbsPercent, split.fatPercent]
  if (!values.every((value) => Number.isFinite(value) && value >= 0)) {
    throw new Error('Macro split values must be finite and non-negative')
  }
  const total = split.proteinPercent + split.carbsPercent + split.fatPercent
  if (Math.abs(total - 100) > 0.001) {
    throw new Error('Macro split must sum to 100')
  }
}

export function calculateCaloriePlan(input: CaloriePlanInput): CaloriePlanResult {
  const weightUnit = input.weightUnit ?? 'kg'
  const heightUnit = input.heightUnit ?? 'cm'
  const goalPercent = input.goalPercent ?? 0
  const macroSplit = input.macroSplit ?? DEFAULT_MACRO_SPLIT

  if (!Number.isFinite(input.weight) || input.weight <= 0) {
    throw new Error('Weight must be greater than zero')
  }
  if (!Number.isFinite(input.height) || input.height <= 0) {
    throw new Error('Height must be greater than zero')
  }
  if (!Number.isFinite(goalPercent) || goalPercent < -80 || goalPercent > 200) {
    throw new Error('Goal percent must be between -80 and 200')
  }

  validateMacroSplit(macroSplit)

  const weightKg = toKg(input.weight, weightUnit)
  const heightCm = toCm(input.height, heightUnit)
  const baseline = calculateCalorieNeeds({
    sex: input.sex,
    age: input.age,
    weightKg,
    heightCm,
    activityFactor: input.activityFactor,
  })

  const calorieDelta = baseline.tdee * (goalPercent / 100)
  const targetCalories = baseline.tdee + calorieDelta
  if (targetCalories <= 0) {
    throw new Error('Target calories must be greater than zero')
  }

  return {
    ...baseline,
    weightKg,
    heightCm,
    goalPercent,
    calorieDelta,
    targetCalories,
    macros: {
      proteinGrams: (targetCalories * (macroSplit.proteinPercent / 100)) / 4,
      carbsGrams: (targetCalories * (macroSplit.carbsPercent / 100)) / 4,
      fatGrams: (targetCalories * (macroSplit.fatPercent / 100)) / 9,
    },
  }
}

// ===== CONVERSIONE LUNGHEZZE =====
export interface LengthConversionResult {
  meters: number
  kilometers: number
  centimeters: number
  millimeters: number
  miles: number
  yards: number
  feet: number
  inches: number
  nauticalMiles: number
}

export type LengthUnit = 'm' | 'km' | 'cm' | 'mm' | 'mi' | 'yd' | 'ft' | 'in' | 'nmi'

const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
  nmi: 1852,
}

export function convertLength(value: number, fromUnit: LengthUnit): LengthConversionResult {
  if (!Number.isFinite(value)) {
    throw new Error('Length value must be finite')
  }
  if (value < 0) {
    throw new Error('Length value cannot be negative')
  }

  const factor = LENGTH_TO_METERS[fromUnit]
  const meters = value * factor

  return {
    meters,
    kilometers: meters / 1000,
    centimeters: meters * 100,
    millimeters: meters * 1000,
    miles: meters / 1609.344,
    yards: meters / 0.9144,
    feet: meters * 3.280839895,
    inches: meters * 39.37007874,
    nauticalMiles: meters / 1852,
  }
}

export function convertLengthFromMeters(meters: number): LengthConversionResult {
  if (!Number.isFinite(meters)) {
    throw new Error('Meters value must be finite')
  }
  if (meters < 0) {
    throw new Error('Meters value cannot be negative')
  }
  return convertLength(meters, 'm')
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

// ===== IMU =====
export interface ImuInput {
  cadastralIncome: number
  multiplier: number
  ratePerMille: number
  ownershipPercent: number
  ownedMonths: number
  annualDeduction: number
}

export interface ImuResult {
  taxableBase: number
  grossAnnualTax: number
  ownershipTax: number
  proportionalDeduction: number
  netAnnualTax: number
  installmentJune: number
  installmentDecember: number
  effectiveRatePerMille: number
}

export function calculateImu(input: ImuInput): ImuResult {
  const {
    cadastralIncome,
    multiplier,
    ratePerMille,
    ownershipPercent,
    ownedMonths,
    annualDeduction,
  } = input

  if (!Number.isFinite(cadastralIncome) || cadastralIncome <= 0) {
    throw new Error('Cadastral income must be greater than zero')
  }
  if (!Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error('Multiplier must be greater than zero')
  }
  if (!Number.isFinite(ratePerMille) || ratePerMille < 0) {
    throw new Error('Rate per mille must be greater or equal to zero')
  }
  if (!Number.isFinite(ownershipPercent) || ownershipPercent <= 0 || ownershipPercent > 100) {
    throw new Error('Ownership percent must be between 0 and 100')
  }
  if (!Number.isInteger(ownedMonths) || ownedMonths < 1 || ownedMonths > 12) {
    throw new Error('Owned months must be an integer between 1 and 12')
  }
  if (!Number.isFinite(annualDeduction) || annualDeduction < 0) {
    throw new Error('Annual deduction cannot be negative')
  }

  const taxableBase = cadastralIncome * 1.05 * multiplier
  const grossAnnualTax = taxableBase * (ratePerMille / 1000)
  const ownershipFactor = (ownershipPercent / 100) * (ownedMonths / 12)
  const ownershipTax = grossAnnualTax * ownershipFactor
  const proportionalDeduction = annualDeduction * ownershipFactor
  const netAnnualTax = Math.max(0, ownershipTax - proportionalDeduction)
  const installmentJune = roundCurrency(netAnnualTax / 2)
  const installmentDecember = roundCurrency(netAnnualTax - installmentJune)

  return {
    taxableBase: roundCurrency(taxableBase),
    grossAnnualTax: roundCurrency(grossAnnualTax),
    ownershipTax: roundCurrency(ownershipTax),
    proportionalDeduction: roundCurrency(proportionalDeduction),
    netAnnualTax: roundCurrency(netAnnualTax),
    installmentJune,
    installmentDecember,
    effectiveRatePerMille: roundCurrency(taxableBase === 0 ? 0 : (netAnnualTax / taxableBase) * 1000),
  }
}

// ===== BUSTA PAGA NETTA =====
export interface NetSalaryInput {
  grossAnnualSalary: number
  employeeContributionRate: number
  monthlyPayments: number
  regionalAdditionalRate: number
  municipalAdditionalRate: number
  applyIntegrativeTreatment: boolean
  employerContributionRate: number
}

export interface NetSalaryResult {
  grossAnnualSalary: number
  grossMonthlySalary: number
  employeeContributionsAnnual: number
  taxableIncomeAnnual: number
  irpefGrossAnnual: number
  employeeDetractionAnnual: number
  irpefNetAnnual: number
  additionalTaxesAnnual: number
  integrativeTreatmentAnnual: number
  netAnnualSalary: number
  netMonthlySalary: number
  employerContributionsAnnual: number
  companyCostAnnual: number
}

function calculateIrpefGrossAnnual(taxableIncome: number): number {
  if (taxableIncome <= 28000) {
    return taxableIncome * 0.23
  }
  if (taxableIncome <= 50000) {
    return 28000 * 0.23 + (taxableIncome - 28000) * 0.35
  }
  return 28000 * 0.23 + 22000 * 0.35 + (taxableIncome - 50000) * 0.43
}

function calculateEmployeeDetractionAnnual(taxableIncome: number): number {
  if (taxableIncome <= 15000) {
    return 1955
  }
  if (taxableIncome <= 28000) {
    return 1910 + 1190 * ((28000 - taxableIncome) / 13000)
  }
  if (taxableIncome <= 50000) {
    return 1910 * ((50000 - taxableIncome) / 22000)
  }
  return 0
}

function calculateIntegrativeTreatmentAnnual(
  taxableIncome: number,
  applyIntegrativeTreatment: boolean
): number {
  if (!applyIntegrativeTreatment) {
    return 0
  }
  if (taxableIncome <= 15000) {
    return 1200
  }
  if (taxableIncome <= 28000) {
    return 1200 * ((28000 - taxableIncome) / 13000)
  }
  return 0
}

export function calculateNetSalary(input: NetSalaryInput): NetSalaryResult {
  const {
    grossAnnualSalary,
    employeeContributionRate,
    monthlyPayments,
    regionalAdditionalRate,
    municipalAdditionalRate,
    applyIntegrativeTreatment,
    employerContributionRate,
  } = input

  if (!Number.isFinite(grossAnnualSalary) || grossAnnualSalary <= 0) {
    throw new Error('Gross annual salary must be greater than zero')
  }
  if (!Number.isFinite(employeeContributionRate) || employeeContributionRate < 0) {
    throw new Error('Employee contribution rate must be greater or equal to zero')
  }
  if (!Number.isInteger(monthlyPayments) || monthlyPayments < 12 || monthlyPayments > 14) {
    throw new Error('Monthly payments must be an integer between 12 and 14')
  }
  if (!Number.isFinite(regionalAdditionalRate) || regionalAdditionalRate < 0) {
    throw new Error('Regional additional rate must be greater or equal to zero')
  }
  if (!Number.isFinite(municipalAdditionalRate) || municipalAdditionalRate < 0) {
    throw new Error('Municipal additional rate must be greater or equal to zero')
  }
  if (!Number.isFinite(employerContributionRate) || employerContributionRate < 0) {
    throw new Error('Employer contribution rate must be greater or equal to zero')
  }

  const employeeContributionsAnnual = grossAnnualSalary * (employeeContributionRate / 100)
  const taxableIncomeAnnual = Math.max(0, grossAnnualSalary - employeeContributionsAnnual)
  const irpefGrossAnnual = calculateIrpefGrossAnnual(taxableIncomeAnnual)
  const employeeDetractionAnnual = calculateEmployeeDetractionAnnual(taxableIncomeAnnual)
  const irpefNetAnnual = Math.max(0, irpefGrossAnnual - employeeDetractionAnnual)
  const additionalTaxesAnnual =
    taxableIncomeAnnual * ((regionalAdditionalRate + municipalAdditionalRate) / 100)
  const integrativeTreatmentAnnual = calculateIntegrativeTreatmentAnnual(
    taxableIncomeAnnual,
    applyIntegrativeTreatment
  )
  const netAnnualSalary =
    grossAnnualSalary - employeeContributionsAnnual - irpefNetAnnual - additionalTaxesAnnual + integrativeTreatmentAnnual
  const grossMonthlySalary = grossAnnualSalary / monthlyPayments
  const netMonthlySalary = netAnnualSalary / monthlyPayments
  const employerContributionsAnnual = grossAnnualSalary * (employerContributionRate / 100)
  const companyCostAnnual = grossAnnualSalary + employerContributionsAnnual

  return {
    grossAnnualSalary: roundCurrency(grossAnnualSalary),
    grossMonthlySalary: roundCurrency(grossMonthlySalary),
    employeeContributionsAnnual: roundCurrency(employeeContributionsAnnual),
    taxableIncomeAnnual: roundCurrency(taxableIncomeAnnual),
    irpefGrossAnnual: roundCurrency(irpefGrossAnnual),
    employeeDetractionAnnual: roundCurrency(employeeDetractionAnnual),
    irpefNetAnnual: roundCurrency(irpefNetAnnual),
    additionalTaxesAnnual: roundCurrency(additionalTaxesAnnual),
    integrativeTreatmentAnnual: roundCurrency(integrativeTreatmentAnnual),
    netAnnualSalary: roundCurrency(netAnnualSalary),
    netMonthlySalary: roundCurrency(netMonthlySalary),
    employerContributionsAnnual: roundCurrency(employerContributionsAnnual),
    companyCostAnnual: roundCurrency(companyCostAnnual),
  }
}

// ===== NUMERI CASUALI =====
export interface RandomNumbersResult {
  numbers: number[]
  min: number
  max: number
  count: number
  allowDuplicates: boolean
}

export type RandomNumberMode = 'integer' | 'decimal'
export type RandomSortMode = 'none' | 'asc' | 'desc'

export interface RandomGenerationInput {
  min: number
  max: number
  count: number
  allowDuplicates: boolean
  mode?: RandomNumberMode
  decimalPlaces?: number
  seed?: string | null
  sort?: RandomSortMode
}

export interface RandomGenerationResult extends RandomNumbersResult {
  mode: RandomNumberMode
  decimalPlaces: number
  seed: string | null
  sort: RandomSortMode
}

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function roundDecimal(value: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces)
  return Math.round(value * factor) / factor
}

function generateOneRandomValue(
  min: number,
  max: number,
  mode: RandomNumberMode,
  decimalPlaces: number,
  random: () => number
): number {
  if (mode === 'integer') {
    const rangeSize = max - min + 1
    return min + Math.floor(random() * rangeSize)
  }
  const raw = min + random() * (max - min)
  return roundDecimal(raw, decimalPlaces)
}

export function generateRandomNumbers(input: RandomGenerationInput): RandomGenerationResult {
  const mode = input.mode ?? 'integer'
  const decimalPlaces = mode === 'integer' ? 0 : (input.decimalPlaces ?? 2)
  const seed = input.seed ?? null
  const sort = input.sort ?? 'none'

  if (!Number.isFinite(input.min) || !Number.isFinite(input.max)) {
    throw new Error('Min and max must be finite numbers')
  }
  if (mode === 'integer' && (!Number.isInteger(input.min) || !Number.isInteger(input.max))) {
    throw new Error('Min and max must be integers')
  }
  if (input.min > input.max) {
    throw new Error('Min cannot be greater than max')
  }
  if (!Number.isInteger(input.count) || input.count <= 0) {
    throw new Error('Count must be a positive integer')
  }
  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0 || decimalPlaces > 10) {
    throw new Error('Decimal places must be an integer between 0 and 10')
  }

  const random = seed !== null ? mulberry32(hashSeed(seed)) : Math.random
  const numbers: number[] = []

  if (!input.allowDuplicates) {
    if (mode === 'integer') {
      const rangeSize = input.max - input.min + 1
      if (input.count > rangeSize) {
        throw new Error('Count cannot exceed range size when duplicates are disabled')
      }
    } else {
      const steps = Math.floor((input.max - input.min) * Math.pow(10, decimalPlaces)) + 1
      if (input.count > steps) {
        throw new Error('Count cannot exceed range size when duplicates are disabled')
      }
    }
  }

  if (input.allowDuplicates) {
    for (let i = 0; i < input.count; i++) {
      numbers.push(generateOneRandomValue(input.min, input.max, mode, decimalPlaces, random))
    }
  } else {
    const selected = new Set<string>()
    let attempts = 0
    const maxAttempts = Math.max(1000, input.count * 500)
    while (selected.size < input.count) {
      attempts += 1
      if (attempts > maxAttempts) {
        throw new Error('Unable to generate enough unique values with current range')
      }
      const value = generateOneRandomValue(input.min, input.max, mode, decimalPlaces, random)
      const key = mode === 'integer' ? String(value) : value.toFixed(decimalPlaces)
      if (!selected.has(key)) {
        selected.add(key)
        numbers.push(value)
      }
    }
  }

  if (sort === 'asc') {
    numbers.sort((a, b) => a - b)
  } else if (sort === 'desc') {
    numbers.sort((a, b) => b - a)
  }

  return {
    numbers,
    min: input.min,
    max: input.max,
    count: input.count,
    allowDuplicates: input.allowDuplicates,
    mode,
    decimalPlaces,
    seed,
    sort,
  }
}

export function generateRandomIntegers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean
): RandomNumbersResult {
  const result = generateRandomNumbers({
    min,
    max,
    count,
    allowDuplicates,
    mode: 'integer',
    decimalPlaces: 0,
    seed: null,
    sort: 'none',
  })
  return {
    numbers: result.numbers,
    min: result.min,
    max: result.max,
    count: result.count,
    allowDuplicates: result.allowDuplicates,
  }
}

// ===== CIFRARIO ENIGMA =====
const ENIGMA_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export type EnigmaRotorName = 'I' | 'II' | 'III' | 'IV' | 'V'
export type EnigmaReflectorName = 'B' | 'C'

interface EnigmaRotorSpec {
  wiring: string
  notches: string[]
}

const ENIGMA_ROTOR_SPECS: Record<EnigmaRotorName, EnigmaRotorSpec> = {
  I: { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notches: ['Q'] },
  II: { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notches: ['E'] },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notches: ['V'] },
  IV: { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notches: ['J'] },
  V: { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notches: ['Z'] },
}

const ENIGMA_REFLECTOR_SPECS: Record<EnigmaReflectorName, string> = {
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
}

export interface EnigmaMachineInput {
  text: string
  rotors: [EnigmaRotorName, EnigmaRotorName, EnigmaRotorName]
  ringSettings: [number, number, number]
  positions: [string, string, string]
  reflector: EnigmaReflectorName
  plugboardPairs?: string
  preserveNonLetters?: boolean
}

export interface EnigmaMachineResult {
  input: string
  normalizedInput: string
  output: string
  finalPositions: [string, string, string]
  steppedLetters: number
}

function mod(value: number, base: number): number {
  return ((value % base) + base) % base
}

function letterToIndex(letter: string): number {
  return ENIGMA_ALPHABET.indexOf(letter)
}

function indexToLetter(index: number): string {
  return ENIGMA_ALPHABET.charAt(mod(index, ENIGMA_ALPHABET.length))
}

function toForwardMap(wiring: string): number[] {
  return wiring.split('').map((letter) => letterToIndex(letter))
}

function toInverseMap(forwardMap: number[]): number[] {
  const inverseMap = new Array<number>(forwardMap.length)
  for (let index = 0; index < forwardMap.length; index += 1) {
    const output = forwardMap[index]
    if (output === undefined) {
      throw new Error('Rotor mapping non valido')
    }
    inverseMap[output] = index
  }
  return inverseMap
}

const ENIGMA_ROTOR_FORWARD_MAPS: Record<EnigmaRotorName, number[]> = {
  I: toForwardMap(ENIGMA_ROTOR_SPECS.I.wiring),
  II: toForwardMap(ENIGMA_ROTOR_SPECS.II.wiring),
  III: toForwardMap(ENIGMA_ROTOR_SPECS.III.wiring),
  IV: toForwardMap(ENIGMA_ROTOR_SPECS.IV.wiring),
  V: toForwardMap(ENIGMA_ROTOR_SPECS.V.wiring),
}

const ENIGMA_ROTOR_REVERSE_MAPS: Record<EnigmaRotorName, number[]> = {
  I: toInverseMap(ENIGMA_ROTOR_FORWARD_MAPS.I),
  II: toInverseMap(ENIGMA_ROTOR_FORWARD_MAPS.II),
  III: toInverseMap(ENIGMA_ROTOR_FORWARD_MAPS.III),
  IV: toInverseMap(ENIGMA_ROTOR_FORWARD_MAPS.IV),
  V: toInverseMap(ENIGMA_ROTOR_FORWARD_MAPS.V),
}

const ENIGMA_REFLECTOR_MAPS: Record<EnigmaReflectorName, number[]> = {
  B: toForwardMap(ENIGMA_REFLECTOR_SPECS.B),
  C: toForwardMap(ENIGMA_REFLECTOR_SPECS.C),
}

function normalizeEnigmaChar(char: string): string {
  return char
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
}

function normalizeEnigmaLetter(char: string): string | null {
  const normalized = normalizeEnigmaChar(char)
  const candidate = normalized.charAt(0)
  if (!candidate) {
    return null
  }
  return /^[A-Z]$/.test(candidate) ? candidate : null
}

function parsePlugboardPairs(rawValue: string | undefined): [number[], string[]] {
  const mapping = Array.from({ length: ENIGMA_ALPHABET.length }, (_, index) => index)
  if (!rawValue) {
    return [mapping, []]
  }

  const tokens = rawValue
    .trim()
    .toUpperCase()
    .split(/[\s,;]+/)
    .filter((token) => token.length > 0)

  if (tokens.length > 10) {
    throw new Error('Plugboard: massimo 10 coppie')
  }

  const seenLetters = new Set<string>()
  const normalizedPairs: string[] = []

  for (const token of tokens) {
    if (!/^[A-Z]{2}$/.test(token)) {
      throw new Error('Plugboard: usa coppie di due lettere (es. AB CD EF)')
    }

    const a = token.charAt(0)
    const b = token.charAt(1)
    if (a === b) {
      throw new Error('Plugboard: una coppia non può usare la stessa lettera due volte')
    }
    if (seenLetters.has(a) || seenLetters.has(b)) {
      throw new Error('Plugboard: ogni lettera può comparire in una sola coppia')
    }
    seenLetters.add(a)
    seenLetters.add(b)
    normalizedPairs.push(`${a}${b}`)
  }

  for (const pair of normalizedPairs) {
    const a = letterToIndex(pair.charAt(0))
    const b = letterToIndex(pair.charAt(1))
    if (a < 0 || b < 0) {
      throw new Error('Plugboard: coppia non valida')
    }
    mapping[a] = b
    mapping[b] = a
  }

  return [mapping, normalizedPairs]
}

function passRotorForward(
  signal: number,
  rotor: EnigmaRotorName,
  position: number,
  ringOffset: number
): number {
  const shifted = mod(signal + position - ringOffset, ENIGMA_ALPHABET.length)
  const wired = ENIGMA_ROTOR_FORWARD_MAPS[rotor][shifted]
  if (wired === undefined) {
    throw new Error('Rotor forward mapping non valido')
  }
  return mod(wired - position + ringOffset, ENIGMA_ALPHABET.length)
}

function passRotorReverse(
  signal: number,
  rotor: EnigmaRotorName,
  position: number,
  ringOffset: number
): number {
  const shifted = mod(signal + position - ringOffset, ENIGMA_ALPHABET.length)
  const wired = ENIGMA_ROTOR_REVERSE_MAPS[rotor][shifted]
  if (wired === undefined) {
    throw new Error('Rotor reverse mapping non valido')
  }
  return mod(wired - position + ringOffset, ENIGMA_ALPHABET.length)
}

function isRotorAtTurnover(rotor: EnigmaRotorName, position: number, ringOffset: number): boolean {
  const notches = ENIGMA_ROTOR_SPECS[rotor].notches
  return notches.some((notchLetter) => {
    const notchIndex = letterToIndex(notchLetter)
    const effectiveNotchIndex = mod(notchIndex - ringOffset, ENIGMA_ALPHABET.length)
    return position === effectiveNotchIndex
  })
}

function assertUniqueRotors(rotors: [EnigmaRotorName, EnigmaRotorName, EnigmaRotorName]): void {
  const uniqueRotors = new Set(rotors)
  if (uniqueRotors.size !== rotors.length) {
    throw new Error('I tre rotori devono essere diversi tra loro')
  }
}

export function runEnigmaCipher(input: EnigmaMachineInput): EnigmaMachineResult {
  const preserveNonLetters = input.preserveNonLetters ?? true
  const { rotors, reflector } = input
  const rings = input.ringSettings.map((value) => value - 1) as [number, number, number]
  const initialPositions = input.positions.map((value) => value.toUpperCase()) as [string, string, string]

  assertUniqueRotors(rotors)

  for (const ring of rings) {
    if (!Number.isInteger(ring + 1) || ring < 0 || ring > 25) {
      throw new Error('Ring setting non valido: usa valori da 1 a 26')
    }
  }

  const positions: [number, number, number] = initialPositions.map((value) => {
    if (!/^[A-Z]$/.test(value)) {
      throw new Error('Posizioni rotori non valide: usa lettere da A a Z')
    }
    return letterToIndex(value)
  }) as [number, number, number]

  const [plugboardMap] = parsePlugboardPairs(input.plugboardPairs)
  const reflectorMap = ENIGMA_REFLECTOR_MAPS[reflector]
  if (!reflectorMap) {
    throw new Error('Reflector non valido')
  }

  let steppedLetters = 0
  let normalizedInput = ''
  let output = ''

  for (const originalChar of input.text) {
    const maybeLetter = normalizeEnigmaLetter(originalChar)

    if (!maybeLetter) {
      if (preserveNonLetters) {
        normalizedInput += originalChar
        output += originalChar
      }
      continue
    }

    normalizedInput += maybeLetter

    // Enigma stepping with historical double-step behaviour.
    const middleAtTurnover = isRotorAtTurnover(rotors[1], positions[1], rings[1])
    const rightAtTurnover = isRotorAtTurnover(rotors[2], positions[2], rings[2])

    if (middleAtTurnover) {
      positions[0] = mod(positions[0] + 1, ENIGMA_ALPHABET.length)
    }
    if (middleAtTurnover || rightAtTurnover) {
      positions[1] = mod(positions[1] + 1, ENIGMA_ALPHABET.length)
    }
    positions[2] = mod(positions[2] + 1, ENIGMA_ALPHABET.length)
    steppedLetters += 1

    let signal = letterToIndex(maybeLetter)
    if (signal < 0) {
      continue
    }

    const fromPlugboard = plugboardMap[signal]
    if (fromPlugboard === undefined) {
      throw new Error('Plugboard mapping non valido')
    }
    signal = fromPlugboard

    // Right -> Middle -> Left
    signal = passRotorForward(signal, rotors[2], positions[2], rings[2])
    signal = passRotorForward(signal, rotors[1], positions[1], rings[1])
    signal = passRotorForward(signal, rotors[0], positions[0], rings[0])

    const reflectedSignal = reflectorMap[signal]
    if (reflectedSignal === undefined) {
      throw new Error('Reflector mapping non valido')
    }
    signal = reflectedSignal

    // Left -> Middle -> Right (reverse path)
    signal = passRotorReverse(signal, rotors[0], positions[0], rings[0])
    signal = passRotorReverse(signal, rotors[1], positions[1], rings[1])
    signal = passRotorReverse(signal, rotors[2], positions[2], rings[2])

    const toPlugboard = plugboardMap[signal]
    if (toPlugboard === undefined) {
      throw new Error('Plugboard mapping non valido')
    }
    signal = toPlugboard
    output += indexToLetter(signal)
  }

  const finalPositions: [string, string, string] = [
    indexToLetter(positions[0]),
    indexToLetter(positions[1]),
    indexToLetter(positions[2]),
  ]

  return {
    input: input.text,
    normalizedInput,
    output,
    finalPositions,
    steppedLetters,
  }
}

// ===== NUOVI CALCOLATORI AGGIUNTI =====

// ===== MEDIA PONDERATA =====
export interface WeightedAverageInput {
  values: number[]
  weights: number[]
}

export interface WeightedAverageResult {
  weightedAverage: number
  totalWeight: number
  values: number[]
  weights: number[]
}

export function calculateWeightedAverageAdvanced(input: WeightedAverageInput): WeightedAverageResult {
  const { values, weights } = input

  if (values.length !== weights.length) {
    throw new Error('Values and weights must have the same length')
  }
  if (values.length === 0) {
    throw new Error('At least one value is required')
  }
  if (values.some(v => !Number.isFinite(v)) || weights.some(w => !Number.isFinite(w))) {
    throw new Error('All values and weights must be finite numbers')
  }
  if (weights.some(w => w < 0)) {
    throw new Error('Weights cannot be negative')
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  if (totalWeight === 0) {
    throw new Error('Total weight cannot be zero')
  }

  let weightedSum = 0
  values.forEach((value, i) => {
    weightedSum += value * (weights[i] ?? 0)
  })

  return {
    weightedAverage: weightedSum / totalWeight,
    totalWeight,
    values,
    weights,
  }
}

// ===== VOLUME PARALLELEPIPEDO =====
export interface ParallelepipedInput {
  length: number
  width: number
  height: number
}

export interface ParallelepipedResult {
  volume: number
  surfaceArea: number
  length: number
  width: number
  height: number
}

export function calculateParallelepipedVolume(input: ParallelepipedInput): ParallelepipedResult {
  const { length, width, height } = input

  if (!Number.isFinite(length) || !Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error('All dimensions must be finite numbers')
  }
  if (length <= 0 || width <= 0 || height <= 0) {
    throw new Error('All dimensions must be positive')
  }

  const volume = length * width * height
  const surfaceArea = 2 * (length * width + length * height + width * height)

  return { volume, surfaceArea, length, width, height }
}

// ===== VOLUME SFERA =====
export interface SphereInput {
  radius: number
}

export interface SphereResult {
  volume: number
  surfaceArea: number
  radius: number
  diameter: number
}

export function calculateSphereVolume(input: SphereInput): SphereResult {
  const { radius } = input

  if (!Number.isFinite(radius)) {
    throw new Error('Radius must be a finite number')
  }
  if (radius <= 0) {
    throw new Error('Radius must be positive')
  }

  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3)
  const surfaceArea = 4 * Math.PI * Math.pow(radius, 2)

  return {
    volume,
    surfaceArea,
    radius,
    diameter: radius * 2,
  }
}

// ===== VOLUME CILINDRO =====
export interface CylinderInput {
  radius: number
  height: number
}

export interface CylinderResult {
  volume: number
  surfaceArea: number
  lateralArea: number
  radius: number
  height: number
}

export function calculateCylinderVolume(input: CylinderInput): CylinderResult {
  const { radius, height } = input

  if (!Number.isFinite(radius) || !Number.isFinite(height)) {
    throw new Error('Radius and height must be finite numbers')
  }
  if (radius <= 0 || height <= 0) {
    throw new Error('Radius and height must be positive')
  }

  const volume = Math.PI * Math.pow(radius, 2) * height
  const lateralArea = 2 * Math.PI * radius * height
  const baseArea = Math.PI * Math.pow(radius, 2)
  const surfaceArea = lateralArea + 2 * baseArea

  return {
    volume,
    surfaceArea,
    lateralArea,
    radius,
    height,
  }
}

// ===== RATA LEASING =====
export interface LeasingInput {
  assetValue: number
  downPayment: number
  residualValue: number
  annualRate: number
  months: number
}

export interface LeasingResult {
  monthlyPayment: number
  totalInterest: number
  totalAmountPaid: number
  financedAmount: number
}

export function calculateLeasingPayment(input: LeasingInput): LeasingResult {
  const { assetValue, downPayment, residualValue, annualRate, months } = input

  if (!Number.isFinite(assetValue) || !Number.isFinite(downPayment) || !Number.isFinite(residualValue) || !Number.isFinite(annualRate) || !Number.isFinite(months)) {
    throw new Error('All inputs must be finite numbers')
  }
  if (assetValue <= 0) throw new Error('Asset value must be positive')
  if (downPayment < 0) throw new Error('Down payment cannot be negative')
  if (residualValue < 0) throw new Error('Residual value cannot be negative')
  if (annualRate < 0) throw new Error('Rate cannot be negative')
  if (months <= 0) throw new Error('Months must be positive')

  const financedAmount = assetValue - downPayment - residualValue
  if (financedAmount <= 0) {
    throw new Error('Financed amount must be positive')
  }

  const monthlyRate = annualRate / 100 / 12
  let monthlyPayment: number

  if (monthlyRate === 0) {
    monthlyPayment = financedAmount / months
  } else {
    monthlyPayment =
      (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  }

  const totalAmountPaid = downPayment + monthlyPayment * months + residualValue
  const totalInterest = totalAmountPaid - assetValue

  return {
    monthlyPayment,
    totalInterest,
    totalAmountPaid,
    financedAmount,
  }
}

// ===== TAN E TAEG =====
export interface TanTaegInput {
  principal: number
  monthlyPayment: number
  months: number
  upfrontCosts: number
  monthlyCosts: number
}

export interface TanTaegResult {
  tan: number
  taeg: number
  totalInterest: number
  totalCost: number
  apr: number
}

export function calculateTanTaeg(input: TanTaegInput): TanTaegResult {
  const { principal, monthlyPayment, months, upfrontCosts, monthlyCosts } = input

  if (!Number.isFinite(principal) || !Number.isFinite(monthlyPayment) || !Number.isFinite(months) || !Number.isFinite(upfrontCosts) || !Number.isFinite(monthlyCosts)) {
    throw new Error('All inputs must be finite numbers')
  }
  if (principal <= 0) throw new Error('Principal must be positive')
  if (monthlyPayment <= 0) throw new Error('Monthly payment must be positive')
  if (months <= 0) throw new Error('Months must be positive')
  if (upfrontCosts < 0 || monthlyCosts < 0) throw new Error('Costs cannot be negative')
  if (upfrontCosts >= principal) throw new Error('Upfront costs must be less than principal')

  // Approximate TAN: find the annual nominal rate r such that
  //   payment = P * (r/1200) * (1+r/1200)^n / ((1+r/1200)^n - 1)
  // The payment function is strictly increasing in r, with minimum P/n at r=0.
  const minPayment = principal / months
  if (monthlyPayment < minPayment) {
    throw new Error(
      `Monthly payment (${monthlyPayment}) is less than the principal share (${minPayment.toFixed(2)}): no real interest rate exists`
    )
  }
  const paymentAt = (rate: number): number => {
    if (rate === 0) return minPayment
    return (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
  }
  const MAX_TAN = 100 // % annuo nominale, limite dell'intervallo di ricerca
  if (paymentAt(MAX_TAN / 100 / 12) < monthlyPayment) {
    throw new Error(
      `Monthly payment (${monthlyPayment}) exceeds the maximum rate supported (${MAX_TAN}% annual): reduce the payment or increase the term`
    )
  }
  let tan = 0
  let low = 0
  let high = MAX_TAN
  const tolerance = 0.0001

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2
    if (mid === 0) {
      tan = 0
      break
    }
    const calculatedPayment = paymentAt(mid / 100 / 12)
    if (Math.abs(calculatedPayment - monthlyPayment) < tolerance) {
      tan = mid
      break
    } else if (calculatedPayment > monthlyPayment) {
      high = mid
    } else {
      low = mid
    }
  }

  if (tan === 0) tan = (low + high) / 2

  const totalPayments = monthlyPayment * months
  const totalCost = upfrontCosts + monthlyCosts * months

  // TAEG: tasso annuo effettivo che equaglia il valore attuale di tutti i flussi
  // (rata + spese periodiche) al capitale netto erogato (capitale - spese iniziali)
  const netPrincipal = principal - upfrontCosts
  const periodicOutflow = monthlyPayment + monthlyCosts

  // PV(r) = outflow * (1 - (1+r)^-n) / r e' decrescente in r, con PV(0) = outflow*n.
  // Se PV(1) > netPrincipal il tasso non esiste nell'intervallo: nessun valore attuale
  // puo' scendere fino a netPrincipal (spese iniziali troppo alte rispetto alla rata).
  const pvAt = (rate: number): number => {
    if (rate === 0) return periodicOutflow * months
    return (periodicOutflow * (1 - Math.pow(1 + rate, -months))) / rate
  }
  if (netPrincipal > periodicOutflow * months || pvAt(1) > netPrincipal) {
    throw new Error(
      'The net principal and the payment/costs are incompatible: no effective rate (TAEG) exists. Reduce upfront costs or increase the payment.'
    )
  }

  let monthlyTaegRate = 0
  low = 0
  high = 1 // tasso mensile in forma decimale (0-100% mese)

  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2
    if (mid === 0) {
      // tasso zero: PV = somma flussi non scontati
      if (Math.abs(periodicOutflow * months - netPrincipal) < tolerance) {
        monthlyTaegRate = 0
        break
      }
      low = mid
      continue
    }
    const presentValue = pvAt(mid)
    if (Math.abs(presentValue - netPrincipal) < tolerance) {
      monthlyTaegRate = mid
      break
    } else if (presentValue > netPrincipal) {
      low = mid
    } else {
      high = mid
    }
  }

  if (monthlyTaegRate === 0) {
    monthlyTaegRate = (low + high) / 2
  }

  // TAEG effettivo annuo: (1+r)^12 - 1, in percentuale
  const taeg = (Math.pow(1 + monthlyTaegRate, 12) - 1) * 100

  const totalInterest = totalPayments - principal

  return {
    tan: Math.round(tan * 100) / 100,
    taeg: Math.round(taeg * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalCost: Math.round((totalCost + totalInterest) * 100) / 100,
    apr: Math.round(taeg * 100) / 100,
  }
}

// ===== BOLLO AUTO =====
// FONTE tariffa base: L. 449/1997 art. 18 (2.58/3.87/4.65/5.82 EUR per kW)
// FONTE superbollo: L. 147/2013 art. 1 c. 636-637 (20 EUR/kW oltre 185 kW,
// raddoppio per classe ambientale Euro 0-3).
// Le maggiorazioni/esenzioni regionali (es. esenzione elettrico) NON sono incluse:
// variano per regione e sono deliberate localmente.
export interface BolloAutoInput {
  power: number // kW
  emissionClass: string // 'Euro 0' ... 'Euro 6'
}

export interface BolloAutoResult {
  annualCost: number // base + superbollo
  power: number
  emissionClass: string
  superbollo: number
  totalCost: number
}

function isEuro03(emissionClass: string): boolean {
  return emissionClass === 'Euro 0' || emissionClass === 'Euro 1' || emissionClass === 'Euro 2' || emissionClass === 'Euro 3'
}

export function calculateBolloAuto(input: BolloAutoInput): BolloAutoResult {
  const { power, emissionClass } = input

  if (!Number.isFinite(power)) throw new Error('Power must be a finite number')
  if (power <= 0) throw new Error('Power must be positive')

  // Tariffa base nazionale per kW (L. 449/1997)
  let baseRate = 0
  if (power <= 100) {
    baseRate = power * 2.58
  } else if (power <= 130) {
    baseRate = 100 * 2.58 + (power - 100) * 3.87
  } else if (power <= 160) {
    baseRate = 100 * 2.58 + 30 * 3.87 + (power - 130) * 4.65
  } else {
    baseRate = 100 * 2.58 + 30 * 3.87 + 30 * 4.65 + (power - 160) * 5.82
  }

  // Superbollo (L. 147/2013): 20 EUR/kW oltre 185 kW, raddoppiato per Euro 0-3
  const superbollo = power > 185 ? (power - 185) * 20 * (isEuro03(emissionClass) ? 2 : 1) : 0

  const annualCost = baseRate + superbollo

  return {
    annualCost: Math.round(annualCost * 100) / 100,
    power,
    emissionClass,
    superbollo: Math.round(superbollo * 100) / 100,
    totalCost: Math.round(annualCost * 100) / 100,
  }
}

// ===== TFR (Trattamento di Fine Rapporto) =====
export interface TfrInput {
  grossAnnualSalary: number
  yearsOfService: number
  monthsOfService: number
  inflationRate: number
  socialSecurityContribution: number
  severancePay: number
}

export interface TfrResult {
  tfrGross: number
  tfrNet: number
  inflationAdjustment: number
  totalWithholding: number
  yearsOfService: number
  monthsOfService: number
}

export function calculateTfr(input: TfrInput): TfrResult {
  const { grossAnnualSalary, yearsOfService, monthsOfService, inflationRate, socialSecurityContribution, severancePay } = input

  if (!Number.isFinite(grossAnnualSalary) || !Number.isFinite(yearsOfService) || !Number.isFinite(monthsOfService) || !Number.isFinite(inflationRate) || !Number.isFinite(socialSecurityContribution) || !Number.isFinite(severancePay)) {
    throw new Error('All inputs must be finite numbers')
  }
  if (grossAnnualSalary <= 0) throw new Error('Gross annual salary must be positive')
  if (yearsOfService < 0) throw new Error('Years of service cannot be negative')
  if (monthsOfService < 0 || monthsOfService > 11) throw new Error('Months must be between 0 and 11')
  if (inflationRate < 0) throw new Error('Inflation rate cannot be negative')

  // MODELLO (art. 2120 c.c., dipendenti post-1993):
  // - Accantonamento mensile = retribuzione mensile lorda / 13.5 * (1 - quota INPS 0,5%)
  // - Rivalutazione annuale = 1,5% fisso + 75% dell'inflazione ISTAT, applicata al fondo al 31/12
  // - Tassazione finale (imposta sostitutiva, DLgs 47/2000): 17% sulla rivalutazione,
  //   23% fino a 28.000 EUR e 35% oltre sulla parte non rivalutata.
  const ssc = socialSecurityContribution / 100
  const monthlyAccrual = (grossAnnualSalary / 12 / 13.5) * (1 - ssc)
  const totalMonths = yearsOfService * 12 + monthsOfService
  const grossAccrual = monthlyAccrual * totalMonths

  // Rivalutazione applicata anno per anno al fondo maturato
  const revalRate = 0.015 + 0.75 * (inflationRate / 100)
  let fund = 0
  const fullYears = Math.floor(totalMonths / 12)
  for (let y = 0; y < fullYears; y++) {
    fund += monthlyAccrual * 12
    fund *= 1 + revalRate
  }
  // Mesi residui: accantonati senza rivalutazione (semplificazione documentata)
  fund += monthlyAccrual * (totalMonths - fullYears * 12)

  // Eventuale buonuscita/indennità extra: non rivalutata
  if (severancePay > 0) {
    fund += severancePay
  }

  const tfrGross = fund
  const inflationAdjustment = tfrGross - grossAccrual

  // Imposta sostitutiva: 17% sulla rivalutazione, 23%/35% sulla parte non rivalutata
  const taxableBase = tfrGross - inflationAdjustment
  let progressiveTax = 0
  if (taxableBase <= 28000) {
    progressiveTax = taxableBase * 0.23
  } else {
    progressiveTax = 28000 * 0.23 + (taxableBase - 28000) * 0.35
  }
  const withholding = inflationAdjustment * 0.17 + progressiveTax

  const tfrNet = tfrGross - withholding

  return {
    tfrGross: Math.round(tfrGross * 100) / 100,
    tfrNet: Math.max(0, Math.round(tfrNet * 100) / 100),
    inflationAdjustment: Math.round(inflationAdjustment * 100) / 100,
    totalWithholding: Math.round(withholding * 100) / 100,
    yearsOfService,
    monthsOfService,
  }
}

// ===== RIVALUTAZIONE MONETARIA =====
export interface RivalutazioneInput {
  initialAmount: number
  startDate: Date
  endDate: Date
  inflationRate: number
  isMonthlyInflation: boolean
}

export interface RivalutazioneResult {
  initialAmount: number
  finalAmount: number
  adjustment: number
  percentAdjustment: number
  months: number
  years: number
}

export function calculateRivalutazioneMonetaria(input: RivalutazioneInput): RivalutazioneResult {
  const { initialAmount, startDate, endDate, inflationRate, isMonthlyInflation } = input

  if (!Number.isFinite(initialAmount) || !Number.isFinite(inflationRate)) {
    throw new Error('Amount and inflation rate must be finite numbers')
  }
  if (initialAmount <= 0) throw new Error('Initial amount must be positive')
  if (startDate >= endDate) throw new Error('End date must be after start date')
  if (inflationRate < 0) throw new Error('Inflation rate cannot be negative')

  const monthsDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())

  let adjustment: number
  if (isMonthlyInflation) {
    // Compound monthly inflation
    const monthlyRate = inflationRate / 100 / 12
    adjustment = initialAmount * (Math.pow(1 + monthlyRate, monthsDiff) - 1)
  } else {
    // Annual inflation
    const years = monthsDiff / 12
    const annualRate = inflationRate / 100
    adjustment = initialAmount * (Math.pow(1 + annualRate, years) - 1)
  }

  const finalAmount = initialAmount + adjustment
  const percentAdjustment = (adjustment / initialAmount) * 100

  return {
    initialAmount,
    finalAmount: Math.round(finalAmount * 100) / 100,
    adjustment: Math.round(adjustment * 100) / 100,
    percentAdjustment: Math.round(percentAdjustment * 100) / 100,
    months: monthsDiff,
    years: Math.round((monthsDiff / 12) * 10) / 10,
  }
}

// ===== CALCOLO PENSIONE =====
export interface PensioneInput {
  currentAge: number
  retirementAge: number
  currentSalary: number
  contributionYears: number
  growthRate: number
}

export interface PensioneResult {
  estimatedPension: number
  replacementRate: number
  contributionYearsAtRetirement: number
  yearsToRetirement: number
}

export function calculatePensioneEstimate(input: PensioneInput): PensioneResult {
  const { currentAge, retirementAge, currentSalary, contributionYears, growthRate } = input

  if (!Number.isFinite(currentAge) || !Number.isFinite(retirementAge) || !Number.isFinite(currentSalary) || !Number.isFinite(contributionYears) || !Number.isFinite(growthRate)) {
    throw new Error('All inputs must be finite numbers')
  }
  if (currentAge <= 0 || retirementAge <= 0) throw new Error('Age must be positive')
  if (currentAge >= retirementAge) throw new Error('Current age must be less than retirement age')
  if (currentSalary <= 0) throw new Error('Salary must be positive')
  if (contributionYears < 0) throw new Error('Contribution years cannot be negative')
  if (growthRate < 0) throw new Error('Growth rate cannot be negative')

  const yearsToRetirement = retirementAge - currentAge
  const contributionYearsAtRetirement = contributionYears + yearsToRetirement

  // Simplified pension formula (contributivo)
  let contributionBasis = 0
  const years = contributionYearsAtRetirement

  // Accumulate contributions with salary growth
  let salary = currentSalary
  for (let i = 0; i < years; i++) {
    contributionBasis += salary * 0.33 // 33% contribution rate
    salary *= 1 + growthRate / 100
  }

  // Coefficienti di trasformazione 2024 (INPS, aggiornamento annuale DM):
  // pensione annua = montante * coeff / 100. La tabella ufficiale copre 57-71 anni.
  const coefficients: Record<number, number> = {
    57: 4.186,
    58: 4.221,
    59: 4.259,
    60: 4.300,
    61: 4.345,
    62: 4.394,
    63: 4.448,
    64: 4.507,
    65: 4.572,
    66: 4.628,
    67: 4.683,
    68: 4.720,
    69: 4.744,
    70: 4.770,
    71: 4.797,
  }

  const ageCoeff = coefficients[retirementAge] ?? 4.572 // fallback: 65 anni
  // Pensione mensile = montante * (coeff/100) / 12
  const estimatedPension = (contributionBasis * (ageCoeff / 100)) / 12
  // Tasso di sostituzione: pensione mensile / stipendio mensile attuale
  const replacementRate = (estimatedPension / (currentSalary / 12)) * 100

  return {
    estimatedPension: Math.round(estimatedPension * 100) / 100,
    replacementRate: Math.round(replacementRate * 10) / 10,
    contributionYearsAtRetirement,
    yearsToRetirement,
  }
}

// ===== CALCOLO AREA TRIANGOLO =====
export interface TriangleInput {
  base: number
  height: number
  sideA?: number
  sideB?: number
  sideC?: number
}

export interface TriangleResult {
  area: number
  perimeter: number
  height: number
  base: number
  isValid: boolean
}

export function calculateTriangleArea(input: TriangleInput): TriangleResult {
  const { base, height, sideA, sideB, sideC } = input

  if (!Number.isFinite(base) || !Number.isFinite(height)) {
    throw new Error('Base and height must be finite numbers')
  }
  if (base <= 0) throw new Error('Base must be positive')
  if (height <= 0) throw new Error('Height must be positive')

  const area = (base * height) / 2

  let perimeter = 0
  let isValid = true

  if (sideA !== undefined && sideB !== undefined && sideC !== undefined) {
    perimeter = sideA + sideB + sideC
    // Triangle inequality
    isValid = sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA
  } else {
    // Assume isosceles if only base and height
    const side = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(height, 2))
    perimeter = base + 2 * side
  }

  return {
    area: Math.round(area * 100) / 100,
    perimeter: Math.round(perimeter * 100) / 100,
    height,
    base,
    isValid,
  }
}

// ===== TEOREMA DI PITAGORA =====
export interface PythagorasInput {
  cathetusA: number
  cathetusB: number
}

export interface PythagorasResult {
  hypotenuse: number
  cathetusA: number
  cathetusB: number
}

export function calculatePythagoras(input: PythagorasInput): PythagorasResult {
  const { cathetusA, cathetusB } = input

  if (!Number.isFinite(cathetusA) || !Number.isFinite(cathetusB)) {
    throw new Error('Both catheti must be finite numbers')
  }
  if (cathetusA <= 0) throw new Error('Cathetus A must be positive')
  if (cathetusB <= 0) throw new Error('Cathetus B must be positive')

  // c = sqrt(a^2 + b^2) — teorema di Pitagora (regola stabile, geometria euclidea)
  const hypotenuse = Math.sqrt(Math.pow(cathetusA, 2) + Math.pow(cathetusB, 2))

  return {
    hypotenuse: Math.round(hypotenuse * 100) / 100,
    cathetusA,
    cathetusB,
  }
}

// ===== REGOLA DEL TRE (PROPORZIONI) =====
export interface RuleOfThreeInput {
  a: number
  b: number
  c: number
}

export interface RuleOfThreeResult {
  x: number
  a: number
  b: number
  c: number
}

export function calculateRuleOfThree(input: RuleOfThreeInput): RuleOfThreeResult {
  const { a, b, c } = input

  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    throw new Error('All three values must be finite numbers')
  }
  if (a === 0) throw new Error('The first value (a) cannot be zero in a proportion')

  // a : b = c : x  =>  x = b * c / a (regola stabile)
  const x = (b * c) / a

  if (!Number.isFinite(x)) throw new Error('Result is not finite')

  return {
    x: Math.round(x * 100) / 100,
    a,
    b,
    c,
  }
}

// ===== AREA TRAPEZIO =====
export interface TrapezoidInput {
  majorBase: number
  minorBase: number
  height: number
}

export interface TrapezoidResult {
  area: number
  majorBase: number
  minorBase: number
  height: number
}

export function calculateTrapezoidArea(input: TrapezoidInput): TrapezoidResult {
  const { majorBase, minorBase, height } = input

  if (!Number.isFinite(majorBase) || !Number.isFinite(minorBase) || !Number.isFinite(height)) {
    throw new Error('Bases and height must be finite numbers')
  }
  if (majorBase <= 0) throw new Error('Major base must be positive')
  if (minorBase <= 0) throw new Error('Minor base must be positive')
  if (height <= 0) throw new Error('Height must be positive')

  // A = (B + b) * h / 2 (regola stabile, geometria euclidea)
  const area = ((majorBase + minorBase) * height) / 2

  return {
    area: Math.round(area * 100) / 100,
    majorBase,
    minorBase,
    height,
  }
}

// ===== VOLUME CONO =====
export interface ConeVolumeInput {
  radius: number
  height: number
}

export interface ConeVolumeResult {
  volume: number
  radius: number
  height: number
}

export function calculateConeVolume(input: ConeVolumeInput): ConeVolumeResult {
  const { radius, height } = input

  if (!Number.isFinite(radius) || !Number.isFinite(height)) {
    throw new Error('Radius and height must be finite numbers')
  }
  if (radius <= 0) throw new Error('Radius must be positive')
  if (height <= 0) throw new Error('Height must be positive')

  // V = (1/3) * pi * r^2 * h (regola stabile, geometria euclidea)
  const volume = (Math.PI * Math.pow(radius, 2) * height) / 3

  return {
    volume: Math.round(volume * 100) / 100,
    radius,
    height,
  }
}

// ===== METABOLISMO BASALE (BMR) — MIFFLIN-ST JEOR 1990 =====
// FONTE: Mifflin MD, St Jeor ST, et al. "A new predictive equation for resting
// energy expenditure in healthy individuals". Am J Clin Nutr. 1990;51(2):241-247.
// Validata su adulti 19-78 anni. Equazione stabile, pubblicata e peer-reviewed.
// Uomini:  BMR = 10*kg + 6.25*cm - 5*eta + 5
// Donne:   BMR = 10*kg + 6.25*cm - 5*eta - 161
// NOTA: stima, non misura clinica (calorimetria indiretta). Non usare per diagnosi.
export interface BmrInput {
  weightKg: number
  heightCm: number
  ageYears: number
  sex: 'male' | 'female'
}

export interface BmrResult {
  bmr: number
  weightKg: number
  heightCm: number
  ageYears: number
  sex: 'male' | 'female'
}

export function calculateBmr(input: BmrInput): BmrResult {
  const { weightKg, heightCm, ageYears, sex } = input

  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || !Number.isFinite(ageYears)) {
    throw new Error('Weight, height and age must be finite numbers')
  }
  if (weightKg <= 0) throw new Error('Weight must be positive')
  if (heightCm <= 0) throw new Error('Height must be positive')
  if (ageYears < 18) throw new Error('The Mifflin-St Jeor equation is validated for adults (age >= 18)')
  if (ageYears > 120) throw new Error('Age seems unrealistic (max 120)')
  if (sex !== 'male' && sex !== 'female') throw new Error('Sex must be male or female')

  // Mifflin-St Jeor (1990)
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + (sex === 'male' ? 5 : -161)

  return {
    bmr: Math.round(bmr * 100) / 100,
    weightKg,
    heightCm,
    ageYears,
    sex,
  }
}
