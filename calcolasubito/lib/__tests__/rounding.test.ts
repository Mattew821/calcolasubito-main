import { round2, round1, roundTo, roundMoney, roundPercent, roundRate, roundMoneyStrict } from '../rounding'

describe('rounding policy', () => {
  describe('round2', () => {
    it('rounds to 2 decimal places', () => {
      expect(round2(1.234)).toBe(1.23)
      expect(round2(1.235)).toBe(1.24)
      expect(round2(0)).toBe(0)
      expect(round2(-1.24)).toBe(-1.24)
      expect(round2(-1.236)).toBe(-1.24)
    })

    it('handles float artifacts with EPSILON', () => {
      // Without EPSILON, 1.005 * 100 = 100.49999... → 1.00 (wrong)
      expect(round2(1.005)).toBe(1.01)
      expect(round2(2.675)).toBe(2.68)
    })

    it('preserves non-finite values', () => {
      expect(round2(NaN)).toBeNaN()
      expect(round2(Infinity)).toBe(Infinity)
      expect(round2(-Infinity)).toBe(-Infinity)
    })

    it('handles very large and very small numbers', () => {
      expect(round2(123456789.123456)).toBe(123456789.12)
      expect(round2(0.0001)).toBe(0)
      expect(round2(0.0049)).toBe(0)
      expect(round2(0.005)).toBe(0.01)
    })
  })

  describe('round1', () => {
    it('rounds to 1 decimal place', () => {
      expect(round1(80.24)).toBe(80.2)
      expect(round1(80.25)).toBe(80.3)
    })
  })

  describe('roundTo', () => {
    it('rounds to arbitrary decimal places', () => {
      expect(roundTo(3.14159, 3)).toBe(3.142)
      expect(roundTo(3.14159, 0)).toBe(3)
      expect(roundTo(-3.14159, 2)).toBe(-3.14)
    })
  })

  describe('roundMoney / roundPercent / roundRate', () => {
    it('are aliases of round2 for policy clarity', () => {
      expect(roundMoney(12091.265)).toBe(12091.27)
      expect(roundPercent(80.245)).toBe(80.25)
      expect(roundRate(12.684)).toBe(12.68)
    })
  })

  describe('roundMoneyStrict', () => {
    it('uses string-based rounding for critical float cases', () => {
      expect(roundMoneyStrict(1.005)).toBe(1.01)
      expect(roundMoneyStrict(10.075)).toBe(10.08)
      expect(roundMoneyStrict(-1.005)).toBe(-1.01)
      expect(roundMoneyStrict(0)).toBe(0)
      expect(roundMoneyStrict(12091.26185)).toBe(12091.26)
    })
  })
})
