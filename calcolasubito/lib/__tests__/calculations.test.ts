import {
  calculatePercentage,
  calculatePercentageOf,
  calculateDaysBetween,
  calculateWeeksBetween,
  calculateMonthsBetween,
  calculateGrossFromNet,
  calculateNetFromGross,
  calculateMortgage,
  calculateDiscount,
  calculateIncrease,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateBMI,
  calculateFuelConsumption,
  calculateRectangleArea,
  calculateCircleArea,
  calculateWeightedAverage,
  convertCelsius,
  calculateAge,
  calculateLoanPayment,
  calculateTip,
  calculateCalorieNeeds,
  convertLengthFromMeters,
  generateRandomIntegers,
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
    expect(result.amortizationSchedule[0].month).toBe(1)
    expect(result.amortizationSchedule[result.amortizationSchedule.length - 1].month).toBe(12)
    // Last payment should reduce balance to ~0
    expect(result.amortizationSchedule[11].balance).toBeLessThan(1)
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
      expect(result.amortizationSchedule[months - 1].balance).toBeGreaterThanOrEqual(0)
      expect(result.amortizationSchedule[months - 1].balance).toBeLessThan(1)
    }
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
  })

  it('should reject non-finite Celsius values', () => {
    expect(() => convertCelsius(Number.POSITIVE_INFINITY)).toThrow('Celsius value must be finite')
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

describe('convertLengthFromMeters', () => {
  it('should convert meters to other length units', () => {
    const result = convertLengthFromMeters(1000)
    expect(result.kilometers).toBe(1)
    expect(result.centimeters).toBe(100000)
    expect(result.millimeters).toBe(1000000)
    expect(result.miles).toBeCloseTo(0.621371, 6)
    expect(result.feet).toBeCloseTo(3280.839895, 6)
    expect(result.inches).toBeCloseTo(39370.07874, 5)
  })

  it('should reject invalid meter values', () => {
    expect(() => convertLengthFromMeters(-1)).toThrow('Meters value cannot be negative')
    expect(() => convertLengthFromMeters(Number.NaN)).toThrow('Meters value must be finite')
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
})
