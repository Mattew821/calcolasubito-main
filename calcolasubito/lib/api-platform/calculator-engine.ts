import { z } from 'zod'
import {
  applySequentialPercentages,
  calculateAge,
  calculateBmiDetailed,
  calculateBusinessDaysBetween,
  calculateCalorieNeeds,
  calculateCaloriePlan,
  calculateCircleAreaDetailed,
  calculateCompoundInterest,
  calculateDaysBetween,
  calculateDiscount,
  calculateFuelConsumptionDetailed,
  calculateGrossFromNet,
  calculateImu,
  calculateIncrease,
  calculateLoanPayment,
  calculateMortgage,
  calculateMortgageAdvanced,
  calculateMonthsBetween,
  calculateNetFromGross,
  calculateNetSalary,
  calculatePercentage,
  calculatePercentageChange,
  calculatePercentageOf,
  calculateSimpleInterest,
  calculateTipDetailed,
  calculateWeeksBetween,
  calculateWeightedAverage,
  calculateRectangleAreaDetailed,
  convertLength,
  convertTemperature,
  generateRandomNumbers,
  runEnigmaCipher,
} from '@/lib/calculations'

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

function parseStrictIsoDate(value: string): Date {
  const match = ISO_DATE_REGEX.exec(value)
  if (!match) {
    throw new Error(`Data non valida: ${value}`)
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`Data non valida: ${value}`)
  }
  return parsed
}

const baseRequestSchema = z.object({
  calculatorId: z.string().min(1),
  operation: z.string().optional(),
  input: z.unknown(),
})

const percentualiInputSchema = z.object({
  number: z.number().finite(),
  percentage: z.number().finite(),
  part: z.number().finite().optional(),
  total: z.number().finite().optional(),
  initialValue: z.number().finite().optional(),
  finalValue: z.number().finite().optional(),
  baseValue: z.number().finite().optional(),
  changes: z.array(z.number().finite()).optional(),
})

const giorniInputSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  includeEndDate: z.boolean().optional(),
  holidays: z.array(z.string()).optional(),
})

const ivaInputSchema = z.object({
  amount: z.number().finite(),
  rate: z.number().finite(),
})

const mutuoInputSchema = z.object({
  principal: z.number().finite(),
  annualRate: z.number().finite(),
  years: z.number().int().positive().optional(),
  months: z.number().int().positive().optional(),
  extraMonthlyPayment: z.number().finite().nonnegative().optional(),
  monthlyFees: z.number().finite().nonnegative().optional(),
  upfrontCosts: z.number().finite().nonnegative().optional(),
})

const prestitoInputSchema = z.object({
  principal: z.number().finite(),
  annualRate: z.number().finite(),
  years: z.number().int().positive().optional(),
  months: z.number().int().positive().optional(),
})

const interesseSempliceInputSchema = z.object({
  principal: z.number().finite(),
  annualRate: z.number().finite(),
  years: z.number().finite(),
})

const interesseCompostoInputSchema = z.object({
  principal: z.number().finite(),
  annualRate: z.number().finite(),
  years: z.number().finite(),
  compoundsPerYear: z.number().int().positive(),
})

const bmiInputSchema = z.object({
  weight: z.number().finite().positive(),
  height: z.number().finite().positive(),
  weightUnit: z.enum(['kg', 'lb', 'st']).optional(),
  heightUnit: z.enum(['cm', 'm', 'ft', 'in']).optional(),
})

const calorieInputSchema = z.object({
  sex: z.enum(['male', 'female']),
  age: z.number().int().positive(),
  weightKg: z.number().finite().positive().optional(),
  heightCm: z.number().finite().positive().optional(),
  weight: z.number().finite().positive().optional(),
  height: z.number().finite().positive().optional(),
  activityFactor: z.number().finite().positive(),
  weightUnit: z.enum(['kg', 'lb', 'st']).optional(),
  heightUnit: z.enum(['cm', 'm', 'ft', 'in']).optional(),
  goalPercent: z.number().finite().optional(),
  macroSplit: z
    .object({
      proteinPercent: z.number().finite(),
      carbsPercent: z.number().finite(),
      fatPercent: z.number().finite(),
    })
    .optional(),
})

const mediaVotiInputSchema = z.object({
  values: z.array(z.number().finite()).min(1),
  weights: z.array(z.number().finite()).min(1),
})

const areaRettangoloInputSchema = z.object({
  base: z.number().finite().nonnegative(),
  height: z.number().finite().nonnegative(),
  inputUnit: z.enum(['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd']).optional(),
})

const areaCerchioInputSchema = z.object({
  radius: z.number().finite().nonnegative(),
  inputUnit: z.enum(['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd']).optional(),
})

const temperaturaInputSchema = z.object({
  value: z.number().finite(),
  fromUnit: z.enum(['c', 'f', 'k', 'r']),
})

const lunghezzaInputSchema = z.object({
  value: z.number().finite().nonnegative(),
  fromUnit: z.enum(['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in', 'nmi']),
})

const randomInputSchema = z.object({
  min: z.number().finite(),
  max: z.number().finite(),
  count: z.number().int().positive(),
  allowDuplicates: z.boolean(),
  mode: z.enum(['integer', 'decimal']).optional(),
  decimalPlaces: z.number().int().min(0).max(10).optional(),
  seed: z.string().nullable().optional(),
  sort: z.enum(['none', 'asc', 'desc']).optional(),
})

const etaInputSchema = z.object({
  birthDate: z.string(),
  referenceDate: z.string().optional(),
})

const manciaInputSchema = z.object({
  billAmount: z.number().finite(),
  tipPercent: z.number().finite(),
  servicePercent: z.number().finite().optional(),
  people: z.number().int().positive(),
  rounding: z.enum(['none', 'nearest_0_05', 'up_0_05', 'up_0_10', 'up_1']).optional(),
})

const carburanteInputSchema = z.object({
  distance: z.number().finite().positive(),
  distanceUnit: z.enum(['km', 'mi']).optional(),
  fuelAmount: z.number().finite().positive(),
  fuelUnit: z.enum(['l', 'gal_us', 'gal_uk', 'kg', 'kwh']).optional(),
  unitPrice: z.number().finite().nonnegative().nullable().optional(),
})

const imuInputSchema = z.object({
  cadastralIncome: z.number().finite(),
  multiplier: z.number().finite(),
  ratePerMille: z.number().finite(),
  ownershipPercent: z.number().finite(),
  ownedMonths: z.number().int(),
  annualDeduction: z.number().finite(),
})

const bustaPagaInputSchema = z.object({
  grossAnnualSalary: z.number().finite(),
  employeeContributionRate: z.number().finite(),
  monthlyPayments: z.number().int(),
  regionalAdditionalRate: z.number().finite(),
  municipalAdditionalRate: z.number().finite(),
  applyIntegrativeTreatment: z.boolean(),
  employerContributionRate: z.number().finite(),
})

const enigmaInputSchema = z.object({
  text: z.string().min(1),
  rotors: z.tuple([z.enum(['I', 'II', 'III', 'IV', 'V']), z.enum(['I', 'II', 'III', 'IV', 'V']), z.enum(['I', 'II', 'III', 'IV', 'V'])]),
  ringSettings: z.tuple([z.number().int().min(1).max(26), z.number().int().min(1).max(26), z.number().int().min(1).max(26)]),
  positions: z.tuple([z.string().regex(/^[A-Za-z]$/), z.string().regex(/^[A-Za-z]$/), z.string().regex(/^[A-Za-z]$/)]),
  reflector: z.enum(['B', 'C']),
  plugboardPairs: z.string().optional(),
  preserveNonLetters: z.boolean().optional(),
})

function resolveMonths(input: { years?: number; months?: number }): number {
  if (input.months && input.months > 0) {
    return input.months
  }
  if (input.years && input.years > 0) {
    return Math.round(input.years * 12)
  }
  throw new Error('Inserisci years o months')
}

export function executeCalculatorRequest(request: unknown): unknown {
  const { calculatorId, operation, input } = baseRequestSchema.parse(request)

  switch (calculatorId) {
    case 'percentuali': {
      const payload = percentualiInputSchema.parse(input)
      if (operation === 'percentage-of') {
        return calculatePercentageOf(payload.part ?? payload.number, payload.total ?? payload.percentage)
      }
      if (operation === 'change') {
        return calculatePercentageChange(payload.initialValue ?? payload.number, payload.finalValue ?? payload.percentage)
      }
      if (operation === 'sequential') {
        return applySequentialPercentages(payload.baseValue ?? payload.number, payload.changes ?? [])
      }
      return calculatePercentage(payload.number, payload.percentage)
    }

    case 'giorni-tra-date': {
      const payload = giorniInputSchema.parse(input)
      const startDate = parseStrictIsoDate(payload.startDate)
      const endDate = parseStrictIsoDate(payload.endDate)
      if (operation === 'weeks') {
        return calculateWeeksBetween(startDate, endDate)
      }
      if (operation === 'months') {
        return calculateMonthsBetween(startDate, endDate)
      }
      if (operation === 'business-days') {
        const holidays = (payload.holidays ?? []).map((value) => parseStrictIsoDate(value))
        return calculateBusinessDaysBetween(startDate, endDate, {
          includeEndDate: payload.includeEndDate,
          holidays,
        })
      }
      return calculateDaysBetween(startDate, endDate)
    }

    case 'scorporo-iva': {
      const payload = ivaInputSchema.parse(input)
      if (operation === 'gross-from-net') {
        return calculateGrossFromNet(payload.amount, payload.rate)
      }
      return calculateNetFromGross(payload.amount, payload.rate)
    }

    case 'rata-mutuo': {
      const payload = mutuoInputSchema.parse(input)
      const months = resolveMonths(payload)
      if (operation === 'advanced') {
        return calculateMortgageAdvanced({
          principal: payload.principal,
          annualRate: payload.annualRate,
          months,
          extraMonthlyPayment: payload.extraMonthlyPayment,
          monthlyFees: payload.monthlyFees,
          upfrontCosts: payload.upfrontCosts,
        })
      }
      return calculateMortgage(payload.principal, payload.annualRate, months)
    }

    case 'rata-prestito': {
      const payload = prestitoInputSchema.parse(input)
      const months = resolveMonths(payload)
      return calculateLoanPayment(payload.principal, payload.annualRate, months)
    }

    case 'interesse-composto': {
      const payload = interesseCompostoInputSchema.parse(input)
      return calculateCompoundInterest(
        payload.principal,
        payload.annualRate,
        payload.years,
        payload.compoundsPerYear
      )
    }

    case 'sconto-percentuale': {
      const payload = z.object({ price: z.number().finite(), discountPercent: z.number().finite() }).parse(input)
      return calculateDiscount(payload.price, payload.discountPercent)
    }

    case 'aumento-percentuale': {
      const payload = z.object({ baseValue: z.number().finite(), increasePercent: z.number().finite() }).parse(input)
      return calculateIncrease(payload.baseValue, payload.increasePercent)
    }

    case 'interesse-semplice': {
      const payload = interesseSempliceInputSchema.parse(input)
      return calculateSimpleInterest(payload.principal, payload.annualRate, payload.years)
    }

    case 'indice-massa-corporea': {
      const payload = bmiInputSchema.parse(input)
      return calculateBmiDetailed(payload)
    }

    case 'fabbisogno-calorico': {
      const payload = calorieInputSchema.parse(input)
      if (operation === 'basic') {
        if (!payload.weightKg || !payload.heightCm) {
          throw new Error('Per operation=basic servono weightKg e heightCm')
        }
        return calculateCalorieNeeds({
          sex: payload.sex,
          age: payload.age,
          weightKg: payload.weightKg,
          heightCm: payload.heightCm,
          activityFactor: payload.activityFactor,
        })
      }
      if (!payload.weight || !payload.height) {
        throw new Error('Per operation=plan servono weight e height')
      }
      return calculateCaloriePlan({
        sex: payload.sex,
        age: payload.age,
        weight: payload.weight,
        height: payload.height,
        activityFactor: payload.activityFactor,
        weightUnit: payload.weightUnit,
        heightUnit: payload.heightUnit,
        goalPercent: payload.goalPercent,
        macroSplit: payload.macroSplit,
      })
    }

    case 'media-voti': {
      const payload = mediaVotiInputSchema.parse(input)
      return calculateWeightedAverage(payload.values, payload.weights)
    }

    case 'area-rettangolo': {
      const payload = areaRettangoloInputSchema.parse(input)
      return calculateRectangleAreaDetailed(payload.base, payload.height, payload.inputUnit)
    }

    case 'area-cerchio': {
      const payload = areaCerchioInputSchema.parse(input)
      return calculateCircleAreaDetailed(payload.radius, payload.inputUnit)
    }

    case 'conversione-temperatura': {
      const payload = temperaturaInputSchema.parse(input)
      return convertTemperature(payload.value, payload.fromUnit)
    }

    case 'convertitore-unita-lunghezza': {
      const payload = lunghezzaInputSchema.parse(input)
      return convertLength(payload.value, payload.fromUnit)
    }

    case 'numeri-casuali': {
      const payload = randomInputSchema.parse(input)
      return generateRandomNumbers(payload)
    }

    case 'calcolo-eta': {
      const payload = etaInputSchema.parse(input)
      return calculateAge(
        parseStrictIsoDate(payload.birthDate),
        payload.referenceDate ? parseStrictIsoDate(payload.referenceDate) : new Date()
      )
    }

    case 'calcolo-mancia': {
      const payload = manciaInputSchema.parse(input)
      return calculateTipDetailed(payload)
    }

    case 'consumo-carburante': {
      const payload = carburanteInputSchema.parse(input)
      return calculateFuelConsumptionDetailed(payload)
    }

    case 'calcolo-imu': {
      const payload = imuInputSchema.parse(input)
      return calculateImu(payload)
    }

    case 'busta-paga-netta': {
      const payload = bustaPagaInputSchema.parse(input)
      return calculateNetSalary(payload)
    }

    case 'cifrario-enigma': {
      const payload = enigmaInputSchema.parse(input)
      return runEnigmaCipher({
        text: payload.text,
        rotors: payload.rotors,
        ringSettings: payload.ringSettings,
        positions: [
          payload.positions[0].toUpperCase(),
          payload.positions[1].toUpperCase(),
          payload.positions[2].toUpperCase(),
        ],
        reflector: payload.reflector,
        plugboardPairs: payload.plugboardPairs,
        preserveNonLetters: payload.preserveNonLetters,
      })
    }

    default:
      throw new Error(`Calculator non supportato via API: ${calculatorId}`)
  }
}
