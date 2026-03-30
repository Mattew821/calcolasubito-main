import {
  giorniTraDateSchema,
  codiceFiscaleItalianSchema,
  codiceFiscaleForeignerItalySchema,
  imuSchema,
  bustaPagaNettaSchema,
  enigmaSchema,
} from '../validations'

const CodiceFiscale = require('codice-fiscale-js')

function randomAlpha(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let out = ''
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

function generateValidCodiceFiscale(): string {
  const generator = new CodiceFiscale({
    name: randomAlpha(6),
    surname: randomAlpha(7),
    gender: Math.random() > 0.5 ? 'M' : 'F',
    day: 1 + Math.floor(Math.random() * 28),
    month: 1 + Math.floor(Math.random() * 12),
    year: 1950 + Math.floor(Math.random() * 70),
    birthplace: 'H501', // Roma
  })
  return generator.toString()
}

describe('giorniTraDateSchema', () => {
  it('accepts strict valid ISO dates', () => {
    const result = giorniTraDateSchema.safeParse({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    })
    expect(result.success).toBe(true)
  })

  it('rejects impossible calendar dates', () => {
    const result = giorniTraDateSchema.safeParse({
      startDate: '2024-02-30',
      endDate: '2024-03-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-padded ISO format', () => {
    const result = giorniTraDateSchema.safeParse({
      startDate: '2024-2-3',
      endDate: '2024-02-04',
    })
    expect(result.success).toBe(false)
  })

  it('rejects inverted date ranges', () => {
    const result = giorniTraDateSchema.safeParse({
      startDate: '2024-05-10',
      endDate: '2024-05-01',
    })
    expect(result.success).toBe(false)
  })
})

describe('codiceFiscale schemas', () => {
  it('rejects impossible birthDate for italian mode', () => {
    const result = codiceFiscaleItalianSchema.safeParse({
      mode: 'italian',
      surname: 'Rossi',
      name: 'Mario',
      birthDate: '2024-02-30',
      birthPlace: 'Roma',
      gender: 'M',
    })
    expect(result.success).toBe(false)
  })

  it('accepts catastale code as birthPlace for italian mode', () => {
    const result = codiceFiscaleItalianSchema.safeParse({
      mode: 'italian',
      surname: 'Rossi',
      name: 'Mario',
      birthDate: '1980-01-01',
      birthPlace: 'h501',
      gender: 'M',
    })
    expect(result.success).toBe(true)
  })

  it('accepts accented and international letters for italian mode', () => {
    const result = codiceFiscaleItalianSchema.safeParse({
      mode: 'italian',
      surname: 'Dàvila Łukasz',
      name: 'José İpek',
      birthDate: '1988-11-03',
      birthPlace: 'Forlì',
      gender: 'M',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid birthPlace characters for italian mode', () => {
    const result = codiceFiscaleItalianSchema.safeParse({
      mode: 'italian',
      surname: 'Rossi',
      name: 'Mario',
      birthDate: '1980-01-01',
      birthPlace: '@@@',
      gender: 'M',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid foreigner codice fiscale and rejects altered check digit', () => {
    for (let i = 0; i < 100; i++) {
      const valid = generateValidCodiceFiscale()
      const validResult = codiceFiscaleForeignerItalySchema.safeParse({
        mode: 'foreigner_italy',
        codiceFiscale: valid,
      })
      expect(validResult.success).toBe(true)

      const wrongControl = valid.charAt(15) === 'A' ? 'B' : 'A'
      const invalid = `${valid.slice(0, 15)}${wrongControl}`
      const invalidResult = codiceFiscaleForeignerItalySchema.safeParse({
        mode: 'foreigner_italy',
        codiceFiscale: invalid,
      })
      expect(invalidResult.success).toBe(false)
    }
  })

  it('accepts lowercase foreigner codice fiscale format and normalizes it', () => {
    const valid = generateValidCodiceFiscale()
    const lowercase = valid.toLowerCase()
    const result = codiceFiscaleForeignerItalySchema.safeParse({
      mode: 'foreigner_italy',
      codiceFiscale: lowercase,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.codiceFiscale).toBe(valid)
    }
  })
})

describe('imuSchema', () => {
  it('accepts valid IMU input', () => {
    const result = imuSchema.safeParse({
      cadastralIncome: 1000,
      multiplier: 160,
      ratePerMille: 10.6,
      ownershipPercent: 100,
      ownedMonths: 12,
      annualDeduction: 0,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid IMU input ranges', () => {
    const result = imuSchema.safeParse({
      cadastralIncome: 0,
      multiplier: 160,
      ratePerMille: 10.6,
      ownershipPercent: 100,
      ownedMonths: 12,
      annualDeduction: 0,
    })
    expect(result.success).toBe(false)
  })
})

describe('bustaPagaNettaSchema', () => {
  it('accepts valid salary simulation input', () => {
    const result = bustaPagaNettaSchema.safeParse({
      grossAnnualSalary: 32000,
      monthlyPayments: 13,
      employeeContributionRate: 9.19,
      regionalAdditionalRate: 1.4,
      municipalAdditionalRate: 0.8,
      employerContributionRate: 30,
      applyIntegrativeTreatment: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects monthly payments outside valid interval', () => {
    const result = bustaPagaNettaSchema.safeParse({
      grossAnnualSalary: 32000,
      monthlyPayments: 15,
      employeeContributionRate: 9.19,
      regionalAdditionalRate: 1.4,
      municipalAdditionalRate: 0.8,
      employerContributionRate: 30,
      applyIntegrativeTreatment: true,
    })
    expect(result.success).toBe(false)
  })
})

describe('enigmaSchema', () => {
  it('accepts valid Enigma settings with plugboard', () => {
    const result = enigmaSchema.safeParse({
      text: 'HELLO WORLD',
      rotorLeft: 'I',
      rotorMiddle: 'II',
      rotorRight: 'III',
      ringLeft: 1,
      ringMiddle: 1,
      ringRight: 1,
      positionLeft: 'A',
      positionMiddle: 'B',
      positionRight: 'C',
      reflector: 'B',
      plugboardPairs: 'AB CD EF',
      preserveNonLetters: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects duplicated rotors', () => {
    const result = enigmaSchema.safeParse({
      text: 'HELLO WORLD',
      rotorLeft: 'I',
      rotorMiddle: 'I',
      rotorRight: 'III',
      ringLeft: 1,
      ringMiddle: 1,
      ringRight: 1,
      positionLeft: 'A',
      positionMiddle: 'B',
      positionRight: 'C',
      reflector: 'B',
      plugboardPairs: '',
      preserveNonLetters: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid plugboard pairs', () => {
    const result = enigmaSchema.safeParse({
      text: 'HELLO WORLD',
      rotorLeft: 'I',
      rotorMiddle: 'II',
      rotorRight: 'III',
      ringLeft: 1,
      ringMiddle: 1,
      ringRight: 1,
      positionLeft: 'A',
      positionMiddle: 'B',
      positionRight: 'C',
      reflector: 'B',
      plugboardPairs: 'AB AC',
      preserveNonLetters: true,
    })
    expect(result.success).toBe(false)
  })
})
