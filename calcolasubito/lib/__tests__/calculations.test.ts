import {
  calculatePercentage,
  calculatePercentageOf,
  calculatePercentageChange,
  applySequentialPercentages,
  calculateDaysBetween,
  calculateBusinessDaysBetween,
  calculateWeeksBetween,
  calculateMonthsBetween,
  calculateGrossFromNet,
  calculateNetFromGross,
  calculateMortgage,
  calculateMortgageAdvanced,
  calculateDiscount,
  calculateIncrease,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateBMI,
  calculateBmiDetailed,
  calculateFuelConsumption,
  calculateFuelConsumptionDetailed,
  calculateRectangleArea,
  calculateRectangleAreaDetailed,
  calculateCircleArea,
  calculateCircleAreaDetailed,
  convertAreaFromSquareMeters,
  calculateWeightedAverage,
  convertCelsius,
  convertTemperature,
  calculateAge,
  calculateLoanPayment,
  calculateTip,
  calculateTipDetailed,
  calculateCalorieNeeds,
  calculateCaloriePlan,
  convertLength,
  convertLengthFromMeters,
  generateRandomIntegers,
  generateRandomNumbers,
  calculateImu,
  calculateNetSalary,
  runEnigmaCipher,
  calculateWeightedAverageAdvanced,
  calculateParallelepipedVolume,
  calculateSphereVolume,
  calculateCylinderVolume,
  calculateLeasingPayment,
  calculateTanTaeg,
  calculateBolloAuto,
  calculateTfr,
  calculateRivalutazioneMonetaria,
  calculatePensioneEstimate,
  calculateTriangleArea,
  calculatePythagoras,
  calculateRuleOfThree,
  calculateTrapezoidArea,
  calculateConeVolume,
  calculateBmr,
  type EnigmaMachineInput,
  type EnigmaRotorName,
  type EnigmaReflectorName,
} from '../calculations'

/**
 * Test suite for CalcolaSubito utility functions
 * Based on official documentation and WCAG guidelines
 */

describe('calculatePercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(calculatePercentage(100, 20)).toBe(20)
    expect(calculatePercentage(200, 15)).toBe(30)
    expect(calculatePercentage(50, 50)).toBe(25)
  })

  it('should handle zero values', () => {
    expect(calculatePercentage(0, 20)).toBe(0)
    expect(calculatePercentage(100, 0)).toBe(0)
  })

  it('should handle decimal values', () => {
    expect(calculatePercentage(100.5, 10.5)).toBeCloseTo(10.5525, 4)
  })

  it('should satisfy inverse relation with calculatePercentageOf on random inputs', () => {
    for (let i = 0; i < 200; i++) {
      const number = Math.random() * 100000 + 0.01
      const percentage = Math.random() * 100
      const part = calculatePercentage(number, percentage)
      const back = calculatePercentageOf(part, number)
      expect(back).toBeCloseTo(percentage, 8)
    }
  })
})

describe('calculatePercentageOf', () => {
  it('should calculate percentage of correctly', () => {
    expect(calculatePercentageOf(20, 100)).toBe(20)
    expect(calculatePercentageOf(30, 200)).toBe(15)
    expect(calculatePercentageOf(25, 50)).toBe(50)
  })

  it('should handle edge cases', () => {
    expect(calculatePercentageOf(0, 100)).toBe(0)
  })

  it('should throw when total is zero', () => {
    expect(() => calculatePercentageOf(10, 0)).toThrow('Total cannot be zero')
  })
})

describe('calculatePercentageChange', () => {
  it('should calculate absolute and percent changes', () => {
    const result = calculatePercentageChange(100, 125)
    expect(result.absoluteChange).toBe(25)
    expect(result.percentChange).toBe(25)
  })

  it('should support decreases', () => {
    const result = calculatePercentageChange(200, 150)
    expect(result.absoluteChange).toBe(-50)
    expect(result.percentChange).toBe(-25)
  })

  it('should reject zero initial value', () => {
    expect(() => calculatePercentageChange(0, 10)).toThrow('Initial value cannot be zero')
  })
})

describe('applySequentialPercentages', () => {
  it('should apply chained percentage changes in order', () => {
    const result = applySequentialPercentages(100, [10, -20, 5])
    expect(result.finalValue).toBeCloseTo(92.4, 8)
    expect(result.totalPercentChange).toBeCloseTo(-7.6, 8)
    expect(result.steps).toHaveLength(3)
  })
})

describe('calculateDaysBetween', () => {
  it('should calculate days between two dates', () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-31')
    expect(calculateDaysBetween(startDate, endDate)).toBe(30)
  })

  it('should return 0 for same date', () => {
    const date = new Date('2024-01-01')
    expect(calculateDaysBetween(date, date)).toBe(0)
  })

  it('should handle leap years', () => {
    const startDate = new Date('2024-02-01')
    const endDate = new Date('2024-03-01')
    expect(calculateDaysBetween(startDate, endDate)).toBe(29) // 2024 is leap year
  })

  it('should not be affected by time-of-day differences', () => {
    const startDate = new Date('2024-03-30T23:59:59')
    const endDate = new Date('2024-03-31T00:00:01')
    expect(calculateDaysBetween(startDate, endDate)).toBe(1)
  })

  it('should be antisymmetric across random dates', () => {
    for (let i = 0; i < 200; i++) {
      const a = new Date(2020, 0, 1 + Math.floor(Math.random() * 3650))
      const b = new Date(2020, 0, 1 + Math.floor(Math.random() * 3650))
      const ab = calculateDaysBetween(a, b)
      const ba = calculateDaysBetween(b, a)
      expect(ab + ba).toBe(0)
    }
  })
})

describe('calculateBusinessDaysBetween', () => {
  it('should count weekdays only by default', () => {
    const start = new Date('2026-03-02') // Monday
    const end = new Date('2026-03-09') // next Monday (exclusive)
    expect(calculateBusinessDaysBetween(start, end)).toBe(5)
  })

  it('should include end date when requested', () => {
    const start = new Date('2026-03-02') // Monday
    const end = new Date('2026-03-02') // same day
    expect(calculateBusinessDaysBetween(start, end, { includeEndDate: true })).toBe(1)
  })

  it('should exclude custom holidays', () => {
    const start = new Date('2026-04-01')
    const end = new Date('2026-04-06')
    const holidays = [new Date('2026-04-02')]
    expect(calculateBusinessDaysBetween(start, end, { holidays })).toBe(2)
  })
})

describe('calculateWeeksBetween', () => {
  it('should calculate weeks correctly', () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-29') // 4 weeks exactly
    expect(calculateWeeksBetween(startDate, endDate)).toBe(4)
  })
})

describe('calculateMonthsBetween', () => {
  it('should calculate months correctly', () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-12-01')
    expect(calculateMonthsBetween(startDate, endDate)).toBe(11)
  })

  it('should handle year boundaries', () => {
    const startDate = new Date('2023-12-01')
    const endDate = new Date('2024-01-01')
    expect(calculateMonthsBetween(startDate, endDate)).toBe(1)
  })
})

describe('IVA Calculations', () => {
  describe('calculateGrossFromNet', () => {
    it('should calculate gross correctly from net', () => {
      const result = calculateGrossFromNet(100, 22)
      expect(result.net).toBe(100)
      expect(result.vat).toBe(22)
      expect(result.gross).toBe(122)
    })

    it('should handle different VAT rates', () => {
      const result = calculateGrossFromNet(100, 4)
      expect(result.vat).toBe(4)
      expect(result.gross).toBe(104)
    })

    it('should handle zero VAT', () => {
      const result = calculateGrossFromNet(100, 0)
      expect(result.vat).toBe(0)
      expect(result.gross).toBe(100)
    })
  })

  describe('calculateNetFromGross', () => {
    it('should calculate net correctly from gross (scorporo IVA)', () => {
      const result = calculateNetFromGross(122, 22)
      expect(result.gross).toBe(122)
      expect(result.net).toBeCloseTo(100, 2)
      expect(result.vat).toBeCloseTo(22, 2)
    })

    it('should be inverse of calculateGrossFromNet', () => {
      const gross = calculateGrossFromNet(100, 22)
      const net = calculateNetFromGross(gross.gross, 22)
      expect(net.net).toBeCloseTo(100, 2)
    })
  })
})

describe('calculateMortgage', () => {
  it('should calculate mortgage payment correctly', () => {
    const result = calculateMortgage(200000, 5, 360) // 200k, 5% for 30 years
    expect(result.monthlyPayment).toBeGreaterThan(1000)
    expect(result.monthlyPayment).toBeLessThan(1200)
    expect(result.totalAmountPaid).toBeGreaterThan(200000)
    expect(result.amortizationSchedule.length).toBe(360)
  })

  it('should handle zero interest rate', () => {
    const result = calculateMortgage(100000, 0, 120)
    expect(result.monthlyPayment).toBe(100000 / 120)
    expect(result.totalInterest).toBe(0)
  })

  it('should generate correct amortization schedule', () => {
    const result = calculateMortgage(10000, 5, 12)
    const schedule = result.amortizationSchedule
    expect(schedule.length).toBeGreaterThanOrEqual(12)
    expect(schedule[0]!.month).toBe(1)
    expect(schedule[schedule.length - 1]!.month).toBe(12)
    // Last payment should reduce balance to ~0
    expect(schedule[11]!.balance).toBeLessThan(1)
  })

  it('should throw on invalid months', () => {
    expect(() => calculateMortgage(100000, 5, 0)).toThrow('Months must be greater than zero')
  })

  it('should throw on negative principal', () => {
    expect(() => calculateMortgage(-1, 5, 12)).toThrow('Principal cannot be negative')
  })

  it('should throw on negative annual rate', () => {
    expect(() => calculateMortgage(100000, -1, 12)).toThrow('Annual rate cannot be negative')
  })

  it('should keep payment identity on random valid inputs', () => {
    for (let i = 0; i < 100; i++) {
      const principal = 5000 + Math.random() * 495000
      const annualRate = Math.random() * 10
      const months = 12 + Math.floor(Math.random() * 480)
      const result = calculateMortgage(principal, annualRate, months)
      expect(result.amortizationSchedule.length).toBe(months)
      expect(result.totalAmountPaid).toBeCloseTo(result.monthlyPayment * months, 8)
      expect(result.totalInterest).toBeCloseTo(result.totalAmountPaid - principal, 8)
      const lastEntry = result.amortizationSchedule[months - 1]
      expect(lastEntry).toBeDefined()
      if (lastEntry) {
        expect(lastEntry.balance).toBeGreaterThanOrEqual(0)
        expect(lastEntry.balance).toBeLessThan(1)
      }
    }
  })
})

describe('calculateMortgageAdvanced', () => {
  it('should reduce duration and interest with extra monthly payments', () => {
    const baseline = calculateMortgage(200000, 4.5, 300)
    const advanced = calculateMortgageAdvanced({
      principal: 200000,
      annualRate: 4.5,
      months: 300,
      extraMonthlyPayment: 200,
      monthlyFees: 0,
      upfrontCosts: 0,
    })

    expect(advanced.actualMonths).toBeLessThan(300)
    expect(advanced.totalInterest).toBeLessThan(baseline.totalInterest)
    expect(advanced.totalInterestSaved).toBeGreaterThan(0)
    expect(advanced.monthsSaved).toBeGreaterThan(0)
  })

  it('should include fees and upfront costs in total paid', () => {
    const advanced = calculateMortgageAdvanced({
      principal: 120000,
      annualRate: 3,
      months: 180,
      extraMonthlyPayment: 0,
      monthlyFees: 5,
      upfrontCosts: 1200,
    })

    expect(advanced.totalPaidWithFeesAndCosts).toBeCloseTo(
      advanced.totalAmountPaid + advanced.actualMonths * 5 + 1200,
      6
    )
  })

  it('should reject negative extras and fees', () => {
    expect(() =>
      calculateMortgageAdvanced({
        principal: 100000,
        annualRate: 3.5,
        months: 240,
        extraMonthlyPayment: -1,
      })
    ).toThrow('Extra monthly payment cannot be negative')
  })
})

describe('calculateDiscount', () => {
  it('should calculate discount and final price', () => {
    const result = calculateDiscount(100, 20)
    expect(result.discountAmount).toBe(20)
    expect(result.finalPrice).toBe(80)
  })

  it('should throw on invalid ranges', () => {
    expect(() => calculateDiscount(-1, 10)).toThrow('Price cannot be negative')
    expect(() => calculateDiscount(100, -1)).toThrow('Discount percent must be between 0 and 100')
    expect(() => calculateDiscount(100, 101)).toThrow('Discount percent must be between 0 and 100')
  })
})

describe('calculateIncrease', () => {
  it('should calculate increase amount and final value', () => {
    const result = calculateIncrease(200, 15)
    expect(result.increaseAmount).toBe(30)
    expect(result.finalValue).toBe(230)
  })

  it('should throw on negative inputs', () => {
    expect(() => calculateIncrease(-1, 10)).toThrow('Base value cannot be negative')
    expect(() => calculateIncrease(100, -1)).toThrow('Increase percent cannot be negative')
  })
})

describe('interests', () => {
  it('should calculate simple interest', () => {
    const result = calculateSimpleInterest(1000, 5, 2)
    expect(result.interest).toBe(100)
    expect(result.totalAmount).toBe(1100)
  })

  it('should calculate compound interest', () => {
    const result = calculateCompoundInterest(1000, 12, 1, 12)
    expect(result.finalAmount).toBeCloseTo(1126.825, 3)
    expect(result.interest).toBeCloseTo(126.825, 3)
  })

  it('should validate interest input ranges', () => {
    expect(() => calculateSimpleInterest(-1, 5, 1)).toThrow('Principal cannot be negative')
    expect(() => calculateCompoundInterest(1000, 5, 1, 0)).toThrow(
      'Compounds per year must be greater than zero'
    )
  })
})

describe('calculateBMI', () => {
  it('should calculate BMI correctly', () => {
    expect(calculateBMI(70, 175)).toBeCloseTo(22.857, 3)
  })

  it('should throw on invalid anthropometric values', () => {
    expect(() => calculateBMI(0, 175)).toThrow('Weight must be greater than zero')
    expect(() => calculateBMI(70, 0)).toThrow('Height must be greater than zero')
  })
})

describe('calculateBmiDetailed', () => {
  it('should convert imperial inputs and provide detailed metrics', () => {
    const result = calculateBmiDetailed({
      weight: 180,
      weightUnit: 'lb',
      height: 70,
      heightUnit: 'in',
    })

    expect(result.weightKg).toBeCloseTo(81.6466, 3)
    expect(result.heightCm).toBeCloseTo(177.8, 3)
    expect(result.bmi).toBeCloseTo(25.8, 1)
    expect(result.bmiPrime).toBeCloseTo(result.bmi / 25, 10)
    expect(result.healthyWeightRangeKg.min).toBeLessThan(result.healthyWeightRangeKg.max)
  })
})

describe('calculateFuelConsumption', () => {
  it('should calculate consumption metrics', () => {
    const result = calculateFuelConsumption(500, 25)
    expect(result.kmPerLiter).toBe(20)
    expect(result.litersPer100Km).toBe(5)
  })

  it('should reject invalid distances and liters', () => {
    expect(() => calculateFuelConsumption(0, 10)).toThrow('Distance must be greater than zero')
    expect(() => calculateFuelConsumption(100, 0)).toThrow('Fuel liters must be greater than zero')
  })

  it('should calculate detailed fuel metrics with imperial units', () => {
    const result = calculateFuelConsumptionDetailed({
      distance: 300,
      distanceUnit: 'mi',
      fuelAmount: 10,
      fuelUnit: 'gal_us',
      unitPrice: 1.8,
    })

    expect(result.distanceKm).toBeCloseTo(482.8032, 4)
    expect(result.kmPerFuelUnit).toBeCloseTo(48.28032, 5)
    expect(result.kmPerLiter).toBeCloseTo(12.754, 3)
    expect(result.litersPer100Km).toBeCloseTo(7.8405, 3)
    expect(result.mpgUs).toBeCloseTo(30, 2)
    expect(result.mpgUk).toBeCloseTo(36, 1)
    expect(result.totalCost).toBeCloseTo(18, 8)
    expect(result.costPer100Km).toBeCloseTo(3.7282, 3)
  })

  it('should keep liter-specific metrics null for non-liter fuel units', () => {
    const result = calculateFuelConsumptionDetailed({
      distance: 100,
      distanceUnit: 'km',
      fuelAmount: 12,
      fuelUnit: 'kwh',
    })

    expect(result.kmPerFuelUnit).toBeCloseTo(8.3333, 4)
    expect(result.fuelUnitsPer100Km).toBeCloseTo(12, 8)
    expect(result.kmPerLiter).toBeNull()
    expect(result.litersPer100Km).toBeNull()
    expect(result.mpgUs).toBeNull()
    expect(result.mpgUk).toBeNull()
  })
})

describe('areas', () => {
  it('should calculate rectangle and circle areas', () => {
    expect(calculateRectangleArea(10, 5)).toBe(50)
    expect(calculateCircleArea(2)).toBeCloseTo(12.5663706, 6)
  })

  it('should throw on negative dimensions', () => {
    expect(() => calculateRectangleArea(-1, 2)).toThrow('Rectangle dimensions cannot be negative')
    expect(() => calculateCircleArea(-1)).toThrow('Radius cannot be negative')
  })
})

describe('detailed area conversions', () => {
  it('should compute rectangle area/perimeter with imperial input units', () => {
    const result = calculateRectangleAreaDetailed(10, 5, 'ft')
    expect(result.perimeterInInputUnit).toBe(30)
    expect(result.areaInInputUnit).toBe(50)
    expect(result.area.squareMeters).toBeCloseTo(4.64515, 4)
    expect(result.area.squareFeet).toBeCloseTo(50, 8)
  })

  it('should compute circle diameter/circumference and area conversions', () => {
    const result = calculateCircleAreaDetailed(2, 'm')
    expect(result.diameterInInputUnit).toBe(4)
    expect(result.circumferenceInInputUnit).toBeCloseTo(12.56637, 5)
    expect(result.area.squareMeters).toBeCloseTo(Math.PI * 4, 10)
  })

  it('should convert square meters to common area units', () => {
    const converted = convertAreaFromSquareMeters(10_000)
    expect(converted.hectares).toBeCloseTo(1, 10)
    expect(converted.acres).toBeCloseTo(2.47105, 4)
  })
})

describe('calculateWeightedAverage', () => {
  it('should compute weighted average', () => {
    const result = calculateWeightedAverage([24, 30, 28], [6, 9, 3])
    expect(result).toBeCloseTo(27.666667, 6)
  })

  it('should reject invalid weight vectors', () => {
    expect(() => calculateWeightedAverage([], [])).toThrow('Values cannot be empty')
    expect(() => calculateWeightedAverage([1], [1, 2])).toThrow('Values and weights must have same length')
    expect(() => calculateWeightedAverage([1], [0])).toThrow('Total weight cannot be zero')
  })
})

describe('convertCelsius', () => {
  it('should convert Celsius to Fahrenheit and Kelvin', () => {
    const result = convertCelsius(25)
    expect(result.fahrenheit).toBe(77)
    expect(result.kelvin).toBeCloseTo(298.15, 2)
    expect(result.rankine).toBeCloseTo(536.67, 2)
  })

  it('should reject non-finite Celsius values', () => {
    expect(() => convertCelsius(Number.POSITIVE_INFINITY)).toThrow('Temperature value must be finite')
  })
})

describe('convertTemperature', () => {
  it('should convert Fahrenheit input correctly', () => {
    const result = convertTemperature(32, 'f')
    expect(result.celsius).toBeCloseTo(0, 8)
    expect(result.kelvin).toBeCloseTo(273.15, 8)
    expect(result.rankine).toBeCloseTo(491.67, 2)
  })

  it('should reject temperatures below absolute zero', () => {
    expect(() => convertTemperature(-500, 'f')).toThrow('Temperature cannot be below absolute zero')
  })
})

describe('calculateAge', () => {
  it('should calculate age parts correctly', () => {
    const result = calculateAge(new Date('2000-03-10'), new Date('2026-03-30'))
    expect(result.years).toBe(26)
    expect(result.months).toBe(0)
    expect(result.days).toBe(20)
    expect(result.totalDays).toBeGreaterThan(0)
  })

  it('should handle leap day birthdays on non-leap year', () => {
    const result = calculateAge(new Date('2004-02-29'), new Date('2025-02-28'))
    expect(result.years).toBe(20)
    expect(result.nextBirthdayInDays).toBe(0)
  })

  it('should reject future birth dates', () => {
    expect(() => calculateAge(new Date('2099-01-01'), new Date('2026-01-01'))).toThrow(
      'Birth date cannot be in the future'
    )
  })
})

describe('calculateLoanPayment', () => {
  it('should calculate loan payment and totals', () => {
    const result = calculateLoanPayment(15000, 7.2, 60)
    expect(result.monthlyPayment).toBeGreaterThan(250)
    expect(result.monthlyPayment).toBeLessThan(350)
    expect(result.totalAmountPaid).toBeCloseTo(result.monthlyPayment * 60, 8)
    expect(result.totalInterest).toBeCloseTo(result.totalAmountPaid - 15000, 8)
  })

  it('should handle zero rate loans', () => {
    const result = calculateLoanPayment(1200, 0, 12)
    expect(result.monthlyPayment).toBe(100)
    expect(result.totalInterest).toBe(0)
    expect(result.totalAmountPaid).toBe(1200)
  })

  it('should validate ranges', () => {
    expect(() => calculateLoanPayment(-1, 5, 12)).toThrow('Principal cannot be negative')
    expect(() => calculateLoanPayment(1000, -1, 12)).toThrow('Annual rate cannot be negative')
    expect(() => calculateLoanPayment(1000, 3, 0)).toThrow('Months must be greater than zero')
  })
})

describe('calculateTip', () => {
  it('should compute tip and split bill', () => {
    const result = calculateTip(80, 10, 4)
    expect(result.tipAmount).toBe(8)
    expect(result.totalAmount).toBe(88)
    expect(result.perPerson).toBe(22)
  })

  it('should validate input', () => {
    expect(() => calculateTip(-1, 10, 2)).toThrow('Bill amount cannot be negative')
    expect(() => calculateTip(100, -1, 2)).toThrow('Tip percent cannot be negative')
    expect(() => calculateTip(100, 10, 0)).toThrow('People must be a positive integer')
  })
})

describe('calculateTipDetailed', () => {
  it('should include service charge and rounded split', () => {
    const result = calculateTipDetailed({
      billAmount: 80,
      tipPercent: 10,
      servicePercent: 12.5,
      people: 3,
      rounding: 'up_0_10',
    })

    expect(result.serviceAmount).toBeCloseTo(10, 8)
    expect(result.tipAmount).toBeCloseTo(8, 8)
    expect(result.totalAmount).toBeCloseTo(98, 8)
    expect(result.perPersonRaw).toBeCloseTo(32.6666, 3)
    expect(result.perPersonRounded).toBeCloseTo(32.7, 8)
    expect(result.roundingDelta).toBeCloseTo(0.1, 8)
  })
})

describe('calculateCalorieNeeds', () => {
  it('should calculate BMR and TDEE for male and female', () => {
    const male = calculateCalorieNeeds({
      sex: 'male',
      age: 30,
      weightKg: 80,
      heightCm: 180,
      activityFactor: 1.55,
    })
    const female = calculateCalorieNeeds({
      sex: 'female',
      age: 30,
      weightKg: 80,
      heightCm: 180,
      activityFactor: 1.55,
    })

    expect(male.bmr).toBeGreaterThan(female.bmr)
    expect(male.tdee).toBeCloseTo(male.bmr * 1.55, 8)
  })

  it('should reject invalid calorie input', () => {
    expect(() =>
      calculateCalorieNeeds({
        sex: 'male',
        age: 0,
        weightKg: 70,
        heightCm: 170,
        activityFactor: 1.2,
      })
    ).toThrow('Age must be greater than zero')
  })
})

describe('calculateCaloriePlan', () => {
  it('should compute calorie target and macro grams with imperial units', () => {
    const result = calculateCaloriePlan({
      sex: 'male',
      age: 30,
      weight: 180,
      weightUnit: 'lb',
      height: 70,
      heightUnit: 'in',
      activityFactor: 1.55,
      goalPercent: -15,
      macroSplit: {
        proteinPercent: 30,
        carbsPercent: 45,
        fatPercent: 25,
      },
    })

    expect(result.weightKg).toBeCloseTo(81.6466, 3)
    expect(result.heightCm).toBeCloseTo(177.8, 3)
    expect(result.targetCalories).toBeCloseTo(result.tdee * 0.85, 8)
    expect(result.macros.proteinGrams).toBeGreaterThan(0)
    expect(result.macros.carbsGrams).toBeGreaterThan(0)
    expect(result.macros.fatGrams).toBeGreaterThan(0)
  })

  it('should reject invalid macro split totals', () => {
    expect(() =>
      calculateCaloriePlan({
        sex: 'female',
        age: 28,
        weight: 60,
        height: 165,
        activityFactor: 1.4,
        goalPercent: 0,
        macroSplit: {
          proteinPercent: 30,
          carbsPercent: 30,
          fatPercent: 30,
        },
      })
    ).toThrow('Macro split must sum to 100')
  })
})

describe('convertLengthFromMeters', () => {
  it('should convert meters to other length units', () => {
    const result = convertLengthFromMeters(1000)
    expect(result.kilometers).toBe(1)
    expect(result.centimeters).toBe(100000)
    expect(result.millimeters).toBe(1000000)
    expect(result.miles).toBeCloseTo(0.621371, 6)
    expect(result.yards).toBeCloseTo(1093.6133, 4)
    expect(result.feet).toBeCloseTo(3280.839895, 6)
    expect(result.inches).toBeCloseTo(39370.07874, 5)
    expect(result.nauticalMiles).toBeCloseTo(0.5399568, 6)
  })

  it('should reject invalid meter values', () => {
    expect(() => convertLengthFromMeters(-1)).toThrow('Meters value cannot be negative')
    expect(() => convertLengthFromMeters(Number.NaN)).toThrow('Meters value must be finite')
  })
})

describe('convertLength', () => {
  it('should convert from miles to metric and imperial units', () => {
    const result = convertLength(1, 'mi')
    expect(result.meters).toBeCloseTo(1609.344, 6)
    expect(result.kilometers).toBeCloseTo(1.609344, 6)
    expect(result.yards).toBeCloseTo(1760, 6)
    expect(result.feet).toBeCloseTo(5280, 6)
    expect(result.inches).toBeCloseTo(63360, 4)
  })
})

describe('generateRandomIntegers', () => {
  it('should generate numbers within range when duplicates are allowed', () => {
    const result = generateRandomIntegers(1, 10, 25, true)
    expect(result.numbers.length).toBe(25)
    expect(result.min).toBe(1)
    expect(result.max).toBe(10)
    expect(result.count).toBe(25)
    expect(result.allowDuplicates).toBe(true)

    for (const value of result.numbers) {
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    }
  })

  it('should generate unique numbers when duplicates are disabled', () => {
    const result = generateRandomIntegers(1, 10, 10, false)
    const unique = new Set(result.numbers)

    expect(result.numbers.length).toBe(10)
    expect(unique.size).toBe(10)
    expect([...result.numbers].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('should support single-value ranges', () => {
    const duplicatesEnabled = generateRandomIntegers(7, 7, 3, true)
    expect(duplicatesEnabled.numbers).toEqual([7, 7, 7])

    const duplicatesDisabled = generateRandomIntegers(7, 7, 1, false)
    expect(duplicatesDisabled.numbers).toEqual([7])
  })

  it('should validate random number generation inputs', () => {
    expect(() => generateRandomIntegers(1.5, 10, 2, true)).toThrow('Min and max must be integers')
    expect(() => generateRandomIntegers(10, 1, 2, true)).toThrow('Min cannot be greater than max')
    expect(() => generateRandomIntegers(1, 10, 0, true)).toThrow('Count must be a positive integer')
    expect(() => generateRandomIntegers(1, 3, 4, false)).toThrow(
      'Count cannot exceed range size when duplicates are disabled'
    )
  })
})

describe('generateRandomNumbers', () => {
  it('should generate deterministic sequences with seed', () => {
    const first = generateRandomNumbers({
      min: 1,
      max: 100,
      count: 6,
      allowDuplicates: true,
      mode: 'integer',
      seed: 'seed-2026',
    })
    const second = generateRandomNumbers({
      min: 1,
      max: 100,
      count: 6,
      allowDuplicates: true,
      mode: 'integer',
      seed: 'seed-2026',
    })

    expect(first.numbers).toEqual(second.numbers)
  })

  it('should support decimal mode with unique values and sorting', () => {
    const result = generateRandomNumbers({
      min: 0,
      max: 1,
      count: 5,
      allowDuplicates: false,
      mode: 'decimal',
      decimalPlaces: 3,
      sort: 'asc',
      seed: 'deterministic-decimals',
    })

    expect(result.mode).toBe('decimal')
    expect(result.decimalPlaces).toBe(3)
    expect(result.numbers.length).toBe(5)
    expect([...result.numbers]).toEqual([...result.numbers].sort((a, b) => a - b))
    expect(new Set(result.numbers.map((item) => item.toFixed(3))).size).toBe(5)
  })
})

describe('calculateImu', () => {
  it('should calculate IMU annual tax and installments', () => {
    const result = calculateImu({
      cadastralIncome: 1000,
      multiplier: 160,
      ratePerMille: 10.6,
      ownershipPercent: 100,
      ownedMonths: 12,
      annualDeduction: 0,
    })

    expect(result.taxableBase).toBeCloseTo(168000, 2)
    expect(result.grossAnnualTax).toBeCloseTo(1780.8, 2)
    expect(result.netAnnualTax).toBeCloseTo(1780.8, 2)
    expect(result.installmentJune + result.installmentDecember).toBeCloseTo(result.netAnnualTax, 2)
  })

  it('should apply ownership quota and deductions', () => {
    const result = calculateImu({
      cadastralIncome: 850,
      multiplier: 160,
      ratePerMille: 8.6,
      ownershipPercent: 50,
      ownedMonths: 6,
      annualDeduction: 200,
    })

    expect(result.taxableBase).toBeGreaterThan(0)
    expect(result.ownershipTax).toBeGreaterThan(0)
    expect(result.proportionalDeduction).toBeCloseTo(50, 2)
    expect(result.netAnnualTax).toBeGreaterThanOrEqual(0)
  })

  it('should validate IMU inputs', () => {
    expect(() =>
      calculateImu({
        cadastralIncome: 0,
        multiplier: 160,
        ratePerMille: 10.6,
        ownershipPercent: 100,
        ownedMonths: 12,
        annualDeduction: 0,
      })
    ).toThrow('Cadastral income must be greater than zero')

    expect(() =>
      calculateImu({
        cadastralIncome: 1000,
        multiplier: 160,
        ratePerMille: 10.6,
        ownershipPercent: 100,
        ownedMonths: 13,
        annualDeduction: 0,
      })
    ).toThrow('Owned months must be an integer between 1 and 12')
  })
})

describe('calculateNetSalary', () => {
  it('should estimate annual and monthly net salary', () => {
    const result = calculateNetSalary({
      grossAnnualSalary: 35000,
      employeeContributionRate: 9.19,
      monthlyPayments: 13,
      regionalAdditionalRate: 1.4,
      municipalAdditionalRate: 0.8,
      applyIntegrativeTreatment: true,
      employerContributionRate: 30,
    })

    expect(result.netAnnualSalary).toBeGreaterThan(0)
    expect(result.netAnnualSalary).toBeLessThan(result.grossAnnualSalary)
    expect(Math.abs(result.netMonthlySalary * 13 - result.netAnnualSalary)).toBeLessThanOrEqual(0.13)
    expect(result.companyCostAnnual).toBeCloseTo(result.grossAnnualSalary + result.employerContributionsAnnual, 2)
  })

  it('should grant integrative treatment for low taxable incomes', () => {
    const withTreatment = calculateNetSalary({
      grossAnnualSalary: 15000,
      employeeContributionRate: 9.19,
      monthlyPayments: 13,
      regionalAdditionalRate: 1.2,
      municipalAdditionalRate: 0.8,
      applyIntegrativeTreatment: true,
      employerContributionRate: 30,
    })

    const withoutTreatment = calculateNetSalary({
      grossAnnualSalary: 15000,
      employeeContributionRate: 9.19,
      monthlyPayments: 13,
      regionalAdditionalRate: 1.2,
      municipalAdditionalRate: 0.8,
      applyIntegrativeTreatment: false,
      employerContributionRate: 30,
    })

    expect(withTreatment.integrativeTreatmentAnnual).toBeGreaterThan(0)
    expect(withTreatment.netAnnualSalary).toBeGreaterThan(withoutTreatment.netAnnualSalary)
  })

  it('should validate salary inputs', () => {
    expect(() =>
      calculateNetSalary({
        grossAnnualSalary: -1,
        employeeContributionRate: 9.19,
        monthlyPayments: 13,
        regionalAdditionalRate: 1,
        municipalAdditionalRate: 1,
        applyIntegrativeTreatment: true,
        employerContributionRate: 30,
      })
    ).toThrow('Gross annual salary must be greater than zero')

    expect(() =>
      calculateNetSalary({
        grossAnnualSalary: 30000,
        employeeContributionRate: 9.19,
        monthlyPayments: 11,
        regionalAdditionalRate: 1,
        municipalAdditionalRate: 1,
        applyIntegrativeTreatment: true,
        employerContributionRate: 30,
      })
    ).toThrow('Monthly payments must be an integer between 12 and 14')
  })
})

describe('runEnigmaCipher', () => {
  it('should match a known Enigma I test vector', () => {
    const result = runEnigmaCipher({
      text: 'HELLOWORLD',
      rotors: ['I', 'II', 'III'],
      ringSettings: [1, 1, 1],
      positions: ['A', 'A', 'A'],
      reflector: 'B',
      plugboardPairs: '',
      preserveNonLetters: true,
    })

    expect(result.output).toBe('ILBDAAMTAZ')
    expect(result.steppedLetters).toBe(10)
  })

  it('should be reversible with identical initial settings', () => {
    const settings: EnigmaMachineInput = {
      text: '',
      rotors: ['V', 'III', 'II'] as [EnigmaRotorName, EnigmaRotorName, EnigmaRotorName],
      ringSettings: [2, 21, 12],
      positions: ['M', 'C', 'K'],
      reflector: 'C',
      plugboardPairs: 'AB CD EF GH',
      preserveNonLetters: true,
    }

    const { text: _, ...cipherSettings } = settings
    const plaintext = 'ATTACCO ALL ALBA, ORE 05:30!'
    const encrypted = runEnigmaCipher({
      text: plaintext,
      ...cipherSettings,
    }).output

    const decrypted = runEnigmaCipher({
      text: encrypted,
      ...cipherSettings,
    }).output

    expect(decrypted).toBe(plaintext)
  })

  it('should drop non-letters when preserveNonLetters is false', () => {
    const result = runEnigmaCipher({
      text: 'A B-C!',
      rotors: ['I', 'II', 'III'] as [EnigmaRotorName, EnigmaRotorName, EnigmaRotorName],
      ringSettings: [1, 1, 1],
      positions: ['A', 'A', 'A'],
      reflector: 'B',
      plugboardPairs: '',
      preserveNonLetters: false,
    })

    expect(result.normalizedInput).toBe('ABC')
    expect(result.output).toHaveLength(3)
  })

  it('should reject invalid plugboard pair reuse', () => {
    expect(() =>
      runEnigmaCipher({
        text: 'CIAO',
        rotors: ['I', 'II', 'III'] as [EnigmaRotorName, EnigmaRotorName, EnigmaRotorName],
        ringSettings: [1, 1, 1],
        positions: ['A', 'A', 'A'],
        reflector: 'B',
        plugboardPairs: 'AB AC',
        preserveNonLetters: true,
      })
    ).toThrow('Plugboard: ogni lettera può comparire in una sola coppia')
  })

  it('should reject repeated rotors', () => {
    expect(() =>
      runEnigmaCipher({
        text: 'CIAO',
        rotors: ['I', 'I', 'III'] as [EnigmaRotorName, EnigmaRotorName, EnigmaRotorName],
        ringSettings: [1, 1, 1],
        positions: ['A', 'A', 'A'],
        reflector: 'B',
        plugboardPairs: '',
        preserveNonLetters: true,
      })
    ).toThrow('I tre rotori devono essere diversi tra loro')
  })
})

describe('deterministic grid invariants', () => {
  it('should preserve accounting identity for discount across a wide grid', () => {
    for (let price = 0; price <= 1000; price += 25) {
      for (let discount = 0; discount <= 100; discount += 5) {
        const result = calculateDiscount(price, discount)
        expect(result.discountAmount + result.finalPrice).toBeCloseTo(price, 10)
        expect(result.finalPrice).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('should preserve accounting identity for increases across a wide grid', () => {
    for (let base = 0; base <= 1000; base += 20) {
      for (let increase = 0; increase <= 150; increase += 3) {
        const result = calculateIncrease(base, increase)
        expect(result.finalValue - result.increaseAmount).toBeCloseTo(base, 10)
        expect(result.finalValue).toBeGreaterThanOrEqual(base)
      }
    }
  })

  it('should keep temperature conversion formulas consistent across grid', () => {
    for (let celsius = -100; celsius <= 250; celsius += 5) {
      const result = convertCelsius(celsius)
      const backFromF = ((result.fahrenheit - 32) * 5) / 9
      const backFromK = result.kelvin - 273.15
      expect(backFromF).toBeCloseTo(celsius, 10)
      expect(backFromK).toBeCloseTo(celsius, 10)
    }
  })

  it('should keep length conversion internally consistent across grid', () => {
    for (let meters = 0; meters <= 10000; meters += 137) {
      const result = convertLengthFromMeters(meters)
      expect(result.kilometers * 1000).toBeCloseTo(meters, 10)
      expect(result.centimeters / 100).toBeCloseTo(meters, 10)
      expect(result.millimeters / 1000).toBeCloseTo(meters, 10)
      expect(result.feet / 3.280839895).toBeCloseTo(meters, 8)
      expect(result.inches / 39.37007874).toBeCloseTo(meters, 8)
    }
  })

  it('should keep tip split identities across grid', () => {
    for (let bill = 0; bill <= 500; bill += 25) {
      for (let tipPercent = 0; tipPercent <= 30; tipPercent += 5) {
        for (let people = 1; people <= 10; people++) {
          const result = calculateTip(bill, tipPercent, people)
          expect(result.tipAmount).toBeCloseTo((bill * tipPercent) / 100, 10)
          expect(result.totalAmount).toBeCloseTo(bill + result.tipAmount, 10)
          expect(result.perPerson * people).toBeCloseTo(result.totalAmount, 10)
        }
      }
    }
  })

  it('should match mortgage and loan monthly payment formulas on shared domains', () => {
    const principals = [5000, 10000, 50000, 200000]
    const rates = [0, 1.5, 3.8, 7.25]
    const monthSets = [12, 24, 60, 120, 360]

    for (const principal of principals) {
      for (const annualRate of rates) {
        for (const months of monthSets) {
          const loan = calculateLoanPayment(principal, annualRate, months)
          const mortgage = calculateMortgage(principal, annualRate, months)
          expect(loan.monthlyPayment).toBeCloseTo(mortgage.monthlyPayment, 10)
          expect(loan.totalAmountPaid).toBeCloseTo(mortgage.totalAmountPaid, 8)
          expect(loan.totalInterest).toBeCloseTo(mortgage.totalInterest, 8)
        }
      }
    }
  })

  it('should preserve installment identity for IMU across a wide grid', () => {
    for (let rendita = 500; rendita <= 5000; rendita += 250) {
      for (const coeff of [55, 65, 80, 140, 160]) {
        for (let rate = 0; rate <= 12.6; rate += 1.5) {
          const result = calculateImu({
            cadastralIncome: rendita,
            multiplier: coeff,
            ratePerMille: rate,
            ownershipPercent: 100,
            ownedMonths: 12,
            annualDeduction: 0,
          })
          expect(Math.abs(result.installmentJune + result.installmentDecember - result.netAnnualTax)).toBeLessThanOrEqual(0.02)
          expect(result.netAnnualTax).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })
})

describe('calculateWeightedAverageAdvanced', () => {
  it('computes weighted average with unit weights (equals arithmetic mean)', () => {
    const result = calculateWeightedAverageAdvanced({ values: [7, 8, 6, 9], weights: [1, 1, 1, 1] })
    expect(result.weightedAverage).toBeCloseTo(7.5, 10)
    expect(result.totalWeight).toBe(4)
  })

  it('matches the classic media ponderata example (voti con crediti)', () => {
    // (7*2 + 8*3 + 6*1 + 9*4) / (2+3+1+4) = (14+24+6+36)/10 = 80/10 = 8
    const result = calculateWeightedAverageAdvanced({ values: [7, 8, 6, 9], weights: [2, 3, 1, 4] })
    expect(result.weightedAverage).toBeCloseTo(8, 10)
    expect(result.totalWeight).toBe(10)
  })

  it('throws on mismatched lengths', () => {
    expect(() => calculateWeightedAverageAdvanced({ values: [1, 2], weights: [1] })).toThrow()
  })

  it('throws on empty input', () => {
    expect(() => calculateWeightedAverageAdvanced({ values: [], weights: [] })).toThrow()
  })

  it('throws on negative weights', () => {
    expect(() => calculateWeightedAverageAdvanced({ values: [1, 2], weights: [-1, 2] })).toThrow()
  })

  it('throws on zero total weight', () => {
    expect(() => calculateWeightedAverageAdvanced({ values: [1, 2], weights: [0, 0] })).toThrow()
  })

  it('handles decimals', () => {
    const result = calculateWeightedAverageAdvanced({ values: [5.5, 6.25], weights: [1.5, 2.5] })
    // (5.5*1.5 + 6.25*2.5) / 4 = (8.25 + 15.625)/4 = 23.875/4 = 5.96875
    expect(result.weightedAverage).toBeCloseTo(5.96875, 10)
  })
})

describe('calculateParallelepipedVolume', () => {
  it('computes volume and surface for 10x5x3', () => {
    const result = calculateParallelepipedVolume({ length: 10, width: 5, height: 3 })
    expect(result.volume).toBe(150)
    // 2*(10*5 + 10*3 + 5*3) = 2*(50+30+15) = 190
    expect(result.surfaceArea).toBe(190)
  })

  it('cube side 2: volume 8, surface 24', () => {
    const result = calculateParallelepipedVolume({ length: 2, width: 2, height: 2 })
    expect(result.volume).toBe(8)
    expect(result.surfaceArea).toBe(24)
  })

  it('throws on non-positive dimension', () => {
    expect(() => calculateParallelepipedVolume({ length: 0, width: 5, height: 3 })).toThrow()
    expect(() => calculateParallelepipedVolume({ length: -1, width: 5, height: 3 })).toThrow()
  })
})

describe('calculateSphereVolume', () => {
  it('unit sphere: volume 4/3*pi, surface 4*pi', () => {
    const result = calculateSphereVolume({ radius: 1 })
    expect(result.volume).toBeCloseTo((4 / 3) * Math.PI, 10)
    expect(result.surfaceArea).toBeCloseTo(4 * Math.PI, 10)
    expect(result.diameter).toBe(2)
  })

  it('radius 5 independent reference', () => {
    const result = calculateSphereVolume({ radius: 5 })
    expect(result.volume).toBeCloseTo(523.5987755982989, 6)
    expect(result.surfaceArea).toBeCloseTo(314.1592653589793, 6)
  })

  it('throws on non-positive radius', () => {
    expect(() => calculateSphereVolume({ radius: 0 })).toThrow()
    expect(() => calculateSphereVolume({ radius: -3 })).toThrow()
  })
})

describe('calculateCylinderVolume', () => {
  it('radius 5, height 10', () => {
    const result = calculateCylinderVolume({ radius: 5, height: 10 })
    expect(result.volume).toBeCloseTo(Math.PI * 25 * 10, 10)
    expect(result.lateralArea).toBeCloseTo(2 * Math.PI * 5 * 10, 10)
    expect(result.surfaceArea).toBeCloseTo(2 * Math.PI * 5 * 10 + 2 * Math.PI * 25, 10)
  })

  it('radius 1, height 1: volume pi', () => {
    const result = calculateCylinderVolume({ radius: 1, height: 1 })
    expect(result.volume).toBeCloseTo(Math.PI, 10)
  })

  it('throws on non-positive input', () => {
    expect(() => calculateCylinderVolume({ radius: 0, height: 5 })).toThrow()
    expect(() => calculateCylinderVolume({ radius: 2, height: -1 })).toThrow()
  })
})

describe('calculateLeasingPayment', () => {
  it('zero-rate leasing spreads financed amount over months', () => {
    const result = calculateLeasingPayment({
      assetValue: 30000, downPayment: 3000, residualValue: 6000,
      annualRate: 0, months: 60,
    })
    // financed = 30000 - 3000 - 6000 = 21000; payment = 21000/60 = 350
    expect(result.financedAmount).toBe(21000)
    expect(result.monthlyPayment).toBeCloseTo(350, 10)
    expect(result.totalInterest).toBeCloseTo(0, 10)
  })

  it('matches annuity formula for a positive rate', () => {
    const result = calculateLeasingPayment({
      assetValue: 25000, downPayment: 2500, residualValue: 5000,
      annualRate: 6.5, months: 48,
    })
    const financed = 25000 - 2500 - 5000 // 17500
    const r = 0.065 / 12
    const expected = (financed * r * Math.pow(1 + r, 48)) / (Math.pow(1 + r, 48) - 1)
    expect(result.monthlyPayment).toBeCloseTo(expected, 8)
    expect(result.totalAmountPaid).toBeCloseTo(2500 + expected * 48 + 5000, 6)
  })

  it('throws when financed amount is not positive', () => {
    expect(() => calculateLeasingPayment({
      assetValue: 10000, downPayment: 10000, residualValue: 0, annualRate: 5, months: 12,
    })).toThrow()
  })
})

describe('calculateTanTaeg', () => {
  it('no extra costs: TAEG approximates TAN', () => {
    const result = calculateTanTaeg({
      principal: 10000, monthlyPayment: 310, months: 36,
      upfrontCosts: 0, monthlyCosts: 0,
    })
    expect(Math.abs(result.tan - result.taeg)).toBeLessThan(0.5)
    expect(result.totalInterest).toBeCloseTo(310 * 36 - 10000, 6)
  })

  it('TAN is consistent with amortization: recompute payment from derived TAN', () => {
    const result = calculateTanTaeg({
      principal: 20000, monthlyPayment: 400, months: 60,
      upfrontCosts: 200, monthlyCosts: 3,
    })
    expect(result.tan).toBeGreaterThan(0)
    const r = result.tan / 100 / 12
    const recomputed = (20000 * r * Math.pow(1 + r, 60)) / (Math.pow(1 + r, 60) - 1)
    // derived TAN should reproduce the input payment within tolerance
    expect(Math.abs(recomputed - 400)).toBeLessThan(0.2)
  })

  it('throws on non-positive inputs', () => {
    expect(() => calculateTanTaeg({ principal: 0, monthlyPayment: 100, months: 12, upfrontCosts: 0, monthlyCosts: 0 })).toThrow()
    expect(() => calculateTanTaeg({ principal: 1000, monthlyPayment: 100, months: 0, upfrontCosts: 0, monthlyCosts: 0 })).toThrow()
  })

  it('round-trip: payment from known 1% monthly rate reproduces TAN 12% and TAEG effective', () => {
    // Riferimento indipendente: rata = P * r * (1+r)^n / ((1+r)^n - 1) con r = 1% mensile
    const P = 10000, n = 24, r = 0.01
    const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const result = calculateTanTaeg({ principal: P, monthlyPayment: payment, months: n, upfrontCosts: 0, monthlyCosts: 0 })
    expect(result.tan).toBeCloseTo(12.0, 1) // 12% nominale annuo
    const expectedEffective = (Math.pow(1.01, 12) - 1) * 100
    expect(result.taeg).toBeCloseTo(expectedEffective, 1) // ~12.68%
    // coerenza: TAEG = (1+TAN/1200)^12 - 1 in assenza di costi
    expect(Math.abs(result.taeg - (Math.pow(1 + result.tan / 100 / 12, 12) - 1) * 100)).toBeLessThan(0.1)
  })

  it('upfront costs raise TAEG above zero-cost TAEG (independent bisection in test)', () => {
    const P = 10000, n = 24, r = 0.01
    const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const zeroCost = calculateTanTaeg({ principal: P, monthlyPayment: payment, months: n, upfrontCosts: 0, monthlyCosts: 0 })
    const withCosts = calculateTanTaeg({ principal: P, monthlyPayment: payment, months: n, upfrontCosts: 300, monthlyCosts: 0 })
    // Riferimento indipendente: risolvi 9700 = payment * (1 - (1+r)^-n) / r per bisezione locale
    const netPrincipal = P - 300
    let lo = 0, hi = 0.1
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2
      const pv = (payment * (1 - Math.pow(1 + mid, -n))) / mid
      if (pv > netPrincipal) lo = mid; else hi = mid
    }
    const expectedTaeg = (Math.pow(1 + (lo + hi) / 2, 12) - 1) * 100
    expect(withCosts.taeg).toBeCloseTo(expectedTaeg, 1)
    expect(withCosts.taeg).toBeGreaterThan(zeroCost.taeg)
    expect(withCosts.tan).toBeCloseTo(zeroCost.tan, 1) // TAN non dipende dai costi
  })

  it('monthly costs increase TAEG', () => {
    const base = calculateTanTaeg({ principal: 10000, monthlyPayment: 470.735, months: 24, upfrontCosts: 0, monthlyCosts: 0 })
    const extra = calculateTanTaeg({ principal: 10000, monthlyPayment: 470.735, months: 24, upfrontCosts: 0, monthlyCosts: 5 })
    expect(extra.taeg).toBeGreaterThan(base.taeg)
  })

  it('payment below principal share throws (no real rate exists)', () => {
    // 800/mese su 10000 in 12 mesi non copre nemmeno la quota capitale (833.33)
    expect(() => calculateTanTaeg({ principal: 10000, monthlyPayment: 800, months: 12, upfrontCosts: 0, monthlyCosts: 0 })).toThrow(/no real interest rate exists/)
  })

  it('absurdly high payment throws (beyond supported rate range)', () => {
    expect(() => calculateTanTaeg({ principal: 10000, monthlyPayment: 20000, months: 24, upfrontCosts: 0, monthlyCosts: 0 })).toThrow(/maximum rate supported/)
  })

  it('upfront costs >= principal throws', () => {
    expect(() => calculateTanTaeg({ principal: 10000, upfrontCosts: 10000, monthlyPayment: 1000, months: 12, monthlyCosts: 0 })).toThrow(/less than principal/)
  })

  it('upfront costs that make TAEG impossible throw', () => {
    // TAN e' calcolabile (900 >= 833.33) ma il TAEG no: netto 100 < PV(1) ≈ 900
    expect(() => calculateTanTaeg({ principal: 10000, upfrontCosts: 9900, monthlyPayment: 900, months: 24, monthlyCosts: 0 })).toThrow(/TAEG/)
  })

  it('boundary: payment == principal/months gives zero-rate loan, no throw', () => {
    const result = calculateTanTaeg({ principal: 10000, monthlyPayment: 10000 / 12, months: 12, upfrontCosts: 0, monthlyCosts: 0 })
    expect(result.tan).toBeCloseTo(0, 1)
    expect(result.taeg).toBeCloseTo(0, 1)
    expect(result.totalInterest).toBeCloseTo(0, 2)
  })
})

describe('calculateBolloAuto', () => {
  it('100 kW base: 2.58 EUR/kW = 258 EUR (Euro 6)', () => {
    const result = calculateBolloAuto({ power: 100, emissionClass: 'Euro 6' })
    expect(result.annualCost).toBeCloseTo(258, 6)
    expect(result.totalCost).toBeCloseTo(258, 6)
    expect(result.superbollo).toBe(0)
  })

  it('130 kW: 100*2.58 + 30*3.87 = 258 + 116.1 = 374.1', () => {
    const result = calculateBolloAuto({ power: 130, emissionClass: 'Euro 6' })
    expect(result.annualCost).toBeCloseTo(374.1, 6)
  })

  it('160 kW: 258 + 116.1 + 30*4.65 = 513.6', () => {
    const result = calculateBolloAuto({ power: 160, emissionClass: 'Euro 6' })
    expect(result.annualCost).toBeCloseTo(513.6, 6)
  })

  it('185 kW (threshold): no superbollo, 513.6 + 25*5.82 = 659.1', () => {
    const result = calculateBolloAuto({ power: 185, emissionClass: 'Euro 6' })
    expect(result.annualCost).toBeCloseTo(659.1, 6)
    expect(result.superbollo).toBe(0)
  })

  it('200 kW Euro 6: base 746.4 + superbollo 15*20 = 1046.4', () => {
    const result = calculateBolloAuto({ power: 200, emissionClass: 'Euro 6' })
    expect(result.annualCost).toBeCloseTo(1046.4, 6)
    expect(result.superbollo).toBeCloseTo(300, 6)
  })

  it('200 kW Euro 0: superbollo raddoppiato (20*2 per kW oltre 185)', () => {
    const result = calculateBolloAuto({ power: 200, emissionClass: 'Euro 0' })
    expect(result.superbollo).toBeCloseTo(600, 6)
    expect(result.totalCost).toBeCloseTo(746.4 + 600, 6)
  })

  it('throws on non-positive power', () => {
    expect(() => calculateBolloAuto({ power: 0, emissionClass: 'Euro 6' })).toThrow()
  })

  it('throws on NaN power', () => {
    expect(() => calculateBolloAuto({ power: Number.NaN, emissionClass: 'Euro 6' })).toThrow()
  })
})


describe('calculateTfr', () => {
  it('one year, no inflation: accrual = retribuzione/13.5, revaluation = 1.5% fisso', () => {
    const result = calculateTfr({
      grossAnnualSalary: 27000, yearsOfService: 1, monthsOfService: 0,
      inflationRate: 0, socialSecurityContribution: 0, severancePay: 0,
    })
    const accrual = 27000 / 13.5 // 2000
    expect(result.tfrGross).toBeCloseTo(accrual * 1.015, 6) // 2030
    expect(result.inflationAdjustment).toBeCloseTo(accrual * 0.015, 6)
  })

  it('two years compounds revaluation year by year (closed form)', () => {
    const one = calculateTfr({ grossAnnualSalary: 30000, yearsOfService: 1, monthsOfService: 0, inflationRate: 0, socialSecurityContribution: 0, severancePay: 0 })
    const two = calculateTfr({ grossAnnualSalary: 30000, yearsOfService: 2, monthsOfService: 0, inflationRate: 0, socialSecurityContribution: 0, severancePay: 0 })
    // Riferimento indipendente: fondo_n = accantonamento * (1+r) * ((1+r)^n - 1)/r, r = 0.015
    const accrual = 30000 / 13.5
    const r = 0.015
    const f2 = accrual * (1 + r) * ((Math.pow(1 + r, 2) - 1) / r)
    expect(two.tfrGross).toBeCloseTo(f2, 2) // policy: arrotondamento al centesimo
    expect(two.tfrGross).toBeGreaterThan(one.tfrGross * 2) // compounding > linear doubling
  })

  it('positive inflation increases gross TFR', () => {
    const zero = calculateTfr({ grossAnnualSalary: 30000, yearsOfService: 3, monthsOfService: 0, inflationRate: 0, socialSecurityContribution: 0, severancePay: 0 })
    const infl = calculateTfr({ grossAnnualSalary: 30000, yearsOfService: 3, monthsOfService: 0, inflationRate: 2, socialSecurityContribution: 0, severancePay: 0 })
    expect(infl.tfrGross).toBeGreaterThan(zero.tfrGross)
  })

  it('default case matches independent hand computation (30k, 5y, infl 2%, INPS 0.5%)', () => {
    const result = calculateTfr({
      grossAnnualSalary: 30000, yearsOfService: 5, monthsOfService: 0,
      inflationRate: 2, socialSecurityContribution: 0.5, severancePay: 0,
    })
    // Riferimento indipendente: accantonamento mensile = 30000/12/13.5 * 0.995 = 184.259259
    // fondo dopo 5 anni con rivalutazione 3%/anno: 12091.26185
    expect(result.tfrGross).toBeCloseTo(12091.26, 2)
    // rivalutazione = fondo - accantonamenti = 12091.26 - 11055.56 = 1035.71
    expect(result.inflationAdjustment).toBeCloseTo(1035.71, 2)
    // trattenute = 17% rivalutazione + 23% base = 176.07 + 2542.78 = 2718.85
    expect(result.totalWithholding).toBeCloseTo(2718.85, 2)
    expect(result.tfrNet).toBeCloseTo(9372.41, 2)
  })

  it('throws on invalid months', () => {
    expect(() => calculateTfr({ grossAnnualSalary: 30000, yearsOfService: 1, monthsOfService: 12, inflationRate: 0, socialSecurityContribution: 0, severancePay: 0 })).toThrow()
  })
})

describe('calculateRivalutazioneMonetaria', () => {
  it('annual inflation compounding over 1 year', () => {
    const result = calculateRivalutazioneMonetaria({
      initialAmount: 1000,
      startDate: new Date(2020, 0, 1),
      endDate: new Date(2021, 0, 1),
      inflationRate: 2, isMonthlyInflation: false,
    })
    expect(result.finalAmount).toBeCloseTo(1020, 6)
    expect(result.months).toBe(12)
  })

  it('monthly inflation compounding 12 months at 2%/yr', () => {
    const result = calculateRivalutazioneMonetaria({
      initialAmount: 1000,
      startDate: new Date(2020, 0, 1),
      endDate: new Date(2021, 0, 1),
      inflationRate: 2, isMonthlyInflation: true,
    })
    const monthly = 0.02 / 12
    // Rounding policy: importi arrotondati al centesimo
    expect(result.finalAmount).toBeCloseTo(1000 * Math.pow(1 + monthly, 12), 2)
  })

  it('throws when end date precedes start date', () => {
    expect(() => calculateRivalutazioneMonetaria({
      initialAmount: 1000,
      startDate: new Date(2021, 0, 1),
      endDate: new Date(2020, 0, 1),
      inflationRate: 2, isMonthlyInflation: false,
    })).toThrow()
  })
})

describe('calculatePensioneEstimate', () => {
  it('replacement rate below 100% for a typical case', () => {
    const result = calculatePensioneEstimate({
      currentAge: 35, retirementAge: 67, currentSalary: 30000,
      contributionYears: 10, growthRate: 1,
    })
    expect(result.estimatedPension).toBeGreaterThan(0)
    expect(result.replacementRate).toBeGreaterThan(0)
    expect(result.replacementRate).toBeLessThan(100)
    expect(result.yearsToRetirement).toBe(32)
    expect(result.contributionYearsAtRetirement).toBe(42)
  })

  it('matches independent closed-form contributivo calculation (montante * coeff/100 / 12)', () => {
    const years = 42
    const salary0 = 30000
    const g = 0.01
    // Somma geometrica: montante = 0.33 * salario0 * sum((1+g)^i, i=0..years-1)
    const montante = 0.33 * salary0 * ((Math.pow(1 + g, years) - 1) / g)
    const expectedMonthly = (montante * (4.683 / 100)) / 12
    const result = calculatePensioneEstimate({
      currentAge: 35, retirementAge: 67, currentSalary: salary0,
      contributionYears: 10, growthRate: 1,
    })
    expect(result.estimatedPension).toBeCloseTo(expectedMonthly, 2)
    expect(result.replacementRate).toBeCloseTo((expectedMonthly / (salary0 / 12)) * 100, 1)
  })

  it('zero growth keeps salary constant in montante', () => {
    const result = calculatePensioneEstimate({
      currentAge: 40, retirementAge: 65, currentSalary: 30000,
      contributionYears: 5, growthRate: 0,
    })
    const years = 30 // 25 futuri + 5 già versati
    const montante = 0.33 * 30000 * years
    const expectedMonthly = (montante * (4.572 / 100)) / 12
    expect(result.estimatedPension).toBeCloseTo(expectedMonthly, 2)
  })

  it('later retirement yields higher pension (more years + better coefficient)', () => {
    const a = calculatePensioneEstimate({ currentAge: 40, retirementAge: 62, currentSalary: 30000, contributionYears: 10, growthRate: 1 })
    const b = calculatePensioneEstimate({ currentAge: 40, retirementAge: 67, currentSalary: 30000, contributionYears: 10, growthRate: 1 })
    expect(b.estimatedPension).toBeGreaterThan(a.estimatedPension)
  })

  it('throws when current age >= retirement age', () => {
    expect(() => calculatePensioneEstimate({ currentAge: 67, retirementAge: 67, currentSalary: 30000, contributionYears: 10, growthRate: 1 })).toThrow()
  })
})

describe('calculateTriangleArea', () => {
  it('base 10 height 5: area 25', () => {
    const result = calculateTriangleArea({ base: 10, height: 5 })
    expect(result.area).toBe(25)
  })

  it('perimeter with all sides given (3-4-5 triangle)', () => {
    const result = calculateTriangleArea({ base: 4, height: 3, sideA: 3, sideB: 4, sideC: 5 })
    expect(result.perimeter).toBe(12)
    expect(result.isValid).toBe(true)
  })

  it('invalid triangle flagged', () => {
    const result = calculateTriangleArea({ base: 10, height: 1, sideA: 2, sideB: 2, sideC: 10 })
    expect(result.isValid).toBe(false)
  })

  it('throws on non-positive base or height', () => {
    expect(() => calculateTriangleArea({ base: 0, height: 5 })).toThrow()
    expect(() => calculateTriangleArea({ base: 5, height: -1 })).toThrow()
  })
})

describe('calculatePythagoras', () => {
  it('3-4-5 triangle gives hypotenuse 5', () => {
    const r = calculatePythagoras({ cathetusA: 3, cathetusB: 4 })
    expect(r.hypotenuse).toBeCloseTo(5, 6)
  })

  it('round-trip: hypotenuse^2 == a^2 + b^2 for decimals', () => {
    const r = calculatePythagoras({ cathetusA: 1.5, cathetusB: 2.5 })
    const h = Math.round(Math.sqrt(Math.pow(1.5, 2) + Math.pow(2.5, 2)) * 100) / 100 // policy: 2 decimali
    expect(r.hypotenuse).toBeCloseTo(h, 6)
  })

  it('large values remain finite', () => {
    const r = calculatePythagoras({ cathetusA: 1e6, cathetusB: 1e6 })
    expect(r.hypotenuse).toBeCloseTo(Math.sqrt(2) * 1e6, 2)
  })

  it('throws on zero/negative catheti', () => {
    expect(() => calculatePythagoras({ cathetusA: 0, cathetusB: 4 })).toThrow()
    expect(() => calculatePythagoras({ cathetusA: -3, cathetusB: 4 })).toThrow()
  })
})

describe('calculateRuleOfThree', () => {
  it('2:3 = 4:x gives x=6', () => {
    const r = calculateRuleOfThree({ a: 2, b: 3, c: 4 })
    expect(r.x).toBeCloseTo(6, 6)
  })

  it('inverse proportion: x = b*c/a matches independent computation', () => {
    const { a, b, c } = { a: 12.5, b: 7.3, c: 4.1 }
    const r = calculateRuleOfThree({ a, b, c })
    const expected = Math.round(((b * c) / a) * 100) / 100 // policy: 2 decimali
    expect(r.x).toBeCloseTo(expected, 6)
  })

  it('negative values allowed (proportion still holds)', () => {
    const r = calculateRuleOfThree({ a: -4, b: 8, c: 2 })
    expect(r.x).toBeCloseTo(-4, 6)
  })

  it('throws when a is zero', () => {
    expect(() => calculateRuleOfThree({ a: 0, b: 3, c: 4 })).toThrow()
  })
})

describe('calculateTrapezoidArea', () => {
  it('(10+6)*4/2 = 32', () => {
    const r = calculateTrapezoidArea({ majorBase: 10, minorBase: 6, height: 4 })
    expect(r.area).toBeCloseTo(32, 6)
  })

  it('symmetric with formula (B+b)*h/2', () => {
    const { majorBase, minorBase, height } = { majorBase: 8.5, minorBase: 3.5, height: 7 }
    const r = calculateTrapezoidArea({ majorBase, minorBase, height })
    expect(r.area).toBeCloseTo(((majorBase + minorBase) * height) / 2, 4)
  })

  it('throws on non-positive inputs', () => {
    expect(() => calculateTrapezoidArea({ majorBase: 0, minorBase: 5, height: 3 })).toThrow()
    expect(() => calculateTrapezoidArea({ majorBase: 5, minorBase: -1, height: 3 })).toThrow()
    expect(() => calculateTrapezoidArea({ majorBase: 5, minorBase: 5, height: 0 })).toThrow()
  })
})

describe('calculateConeVolume', () => {
  it('r=3, h=4: volume = pi*9*4/3 = 12*pi = 37.6991', () => {
    const r = calculateConeVolume({ radius: 3, height: 4 })
    expect(r.volume).toBeCloseTo(Math.round(12 * Math.PI * 100) / 100, 6) // policy: 2 decimali
  })

  it('cylinder/3 check: cone is 1/3 of cylinder with same base', () => {
    const cone = calculateConeVolume({ radius: 2, height: 6 })
    const cylinder = Math.PI * 4 * 6
    expect(cone.volume).toBeCloseTo(Math.round((cylinder / 3) * 100) / 100, 6) // policy: 2 decimali
  })

  it('throws on non-positive inputs', () => {
    expect(() => calculateConeVolume({ radius: 0, height: 3 })).toThrow()
    expect(() => calculateConeVolume({ radius: 2, height: -1 })).toThrow()
  })
})

describe('calculateBmr', () => {
  it('male 70kg 175cm 30y: 10*70 + 6.25*175 - 5*30 + 5 = 1648.75', () => {
    const r = calculateBmr({ weightKg: 70, heightCm: 175, ageYears: 30, sex: 'male' })
    expect(r.bmr).toBeCloseTo(1648.75, 4)
  })

  it('female 60kg 165cm 25y: 10*60 + 6.25*165 - 5*25 - 161 = 1345.25', () => {
    const r = calculateBmr({ weightKg: 60, heightCm: 165, ageYears: 25, sex: 'female' })
    expect(r.bmr).toBeCloseTo(1345.25, 4)
  })

  it('women are 166 kcal lower than men with same body (161+5)', () => {
    const m = calculateBmr({ weightKg: 70, heightCm: 175, ageYears: 30, sex: 'male' })
    const f = calculateBmr({ weightKg: 70, heightCm: 175, ageYears: 30, sex: 'female' })
    expect(m.bmr - f.bmr).toBeCloseTo(166, 4)
  })

  it('throws for age < 18 (validation domain) and non-positive weight', () => {
    expect(() => calculateBmr({ weightKg: 70, heightCm: 175, ageYears: 17, sex: 'male' })).toThrow()
    expect(() => calculateBmr({ weightKg: 0, heightCm: 175, ageYears: 30, sex: 'male' })).toThrow()
  })
})
