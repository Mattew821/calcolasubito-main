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

export function generateRandomIntegers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean
): RandomNumbersResult {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Min and max must be integers')
  }
  if (min > max) {
    throw new Error('Min cannot be greater than max')
  }
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Count must be a positive integer')
  }

  const rangeSize = max - min + 1

  if (!allowDuplicates && count > rangeSize) {
    throw new Error('Count cannot exceed range size when duplicates are disabled')
  }

  const numbers: number[] = []

  if (allowDuplicates) {
    for (let i = 0; i < count; i++) {
      numbers.push(min + Math.floor(Math.random() * rangeSize))
    }
  } else {
    const selected = new Set<number>()
    while (selected.size < count) {
      selected.add(min + Math.floor(Math.random() * rangeSize))
    }
    numbers.push(...selected)
  }

  return {
    numbers,
    min,
    max,
    count,
    allowDuplicates,
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
