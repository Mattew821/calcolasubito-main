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
