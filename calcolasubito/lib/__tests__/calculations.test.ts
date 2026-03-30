import {
  calculatePercentage,
  calculatePercentageOf,
  calculateDaysBetween,
  calculateWeeksBetween,
  calculateMonthsBetween,
  calculateGrossFromNet,
  calculateNetFromGross,
  calculateMortgage,
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
