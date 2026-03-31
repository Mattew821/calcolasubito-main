describe('api platform', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.API_BILLING_STORAGE = 'memory'
    process.env.API_KEY_HASH_SECRET = 'test-secret'
  })

  it('creates and authenticates api key', async () => {
    const store = await import('@/lib/api-platform/store')

    const { record, rawApiKey } = store.generateApiKey({
      name: 'Test Key',
      calculatorId: 'percentuali',
      monthlyQuota: 2,
    })

    expect(record.id).toMatch(/^ak_/)
    expect(rawApiKey.startsWith('cs_live.')).toBe(true)

    const auth = store.authenticateApiKey(rawApiKey)
    expect(auth).not.toBeNull()
    expect(auth?.key.id).toBe(record.id)
  })

  it('tracks quota and usage', async () => {
    const store = await import('@/lib/api-platform/store')

    const { record } = store.generateApiKey({
      name: 'Quota Key',
      calculatorId: 'percentuali',
      monthlyQuota: 1,
    })

    const usageBefore = store.getUsageSnapshot(record, 'percentuali')
    expect(usageBefore.remaining).toBe(1)

    const usageAfter = store.incrementUsage(record, 'percentuali', usageBefore.monthKey)
    expect(usageAfter.totalUsed).toBe(1)
    expect(usageAfter.remaining).toBe(0)
  })

  it('executes calculator request through api engine', async () => {
    const engine = await import('@/lib/api-platform/calculator-engine')
    const result = engine.executeCalculatorRequest({
      calculatorId: 'percentuali',
      operation: 'calculate',
      input: {
        number: 200,
        percentage: 10,
      },
    })

    expect(result).toBe(20)
  })

  it('covers all supported calculators through API engine requests', async () => {
    const engine = await import('@/lib/api-platform/calculator-engine')

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'percentuali',
        operation: 'sequential',
        input: { number: 100, changes: [10, -10] },
      })
    ).toMatchObject({
      baseValue: 100,
      steps: [{ changePercent: 10 }, { changePercent: -10 }],
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'giorni-tra-date',
        operation: 'business-days',
        input: {
          startDate: '2026-03-02',
          endDate: '2026-03-09',
          includeEndDate: false,
          holidays: ['2026-03-04'],
        },
      })
    ).toBe(4)

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'scorporo-iva',
        operation: 'gross-from-net',
        input: { amount: 100, rate: 22 },
      })
    ).toMatchObject({ gross: 122, vat: 22, net: 100 })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'rata-mutuo',
        operation: 'advanced',
        input: {
          principal: 100000,
          annualRate: 3,
          months: 240,
          extraMonthlyPayment: 100,
          monthlyFees: 5,
          upfrontCosts: 300,
        },
      })
    ).toMatchObject({
      extraMonthlyPayment: 100,
      monthlyFees: 5,
      upfrontCosts: 300,
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'rata-prestito',
        input: { principal: 10000, annualRate: 5, months: 60 },
      })
    ).toMatchObject({
      totalAmountPaid: expect.any(Number),
      monthlyPayment: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'interesse-composto',
        input: { principal: 1000, annualRate: 10, years: 2, compoundsPerYear: 12 },
      })
    ).toMatchObject({
      finalAmount: expect.any(Number),
      interest: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'interesse-semplice',
        input: { principal: 1000, annualRate: 10, years: 2 },
      })
    ).toMatchObject({
      totalAmount: 1200,
      interest: 200,
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'sconto-percentuale',
        input: { price: 200, discountPercent: 15 },
      })
    ).toMatchObject({ discountAmount: 30, finalPrice: 170 })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'aumento-percentuale',
        input: { baseValue: 200, increasePercent: 15 },
      })
    ).toMatchObject({ increaseAmount: 30, finalValue: 230 })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'indice-massa-corporea',
        input: { weight: 70, height: 175, weightUnit: 'kg', heightUnit: 'cm' },
      })
    ).toMatchObject({
      bmi: expect.any(Number),
      bmiPrime: expect.any(Number),
      category: expect.any(String),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'fabbisogno-calorico',
        operation: 'basic',
        input: {
          sex: 'male',
          age: 30,
          weightKg: 80,
          heightCm: 180,
          activityFactor: 1.55,
        },
      })
    ).toMatchObject({
      bmr: expect.any(Number),
      tdee: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'fabbisogno-calorico',
        operation: 'plan',
        input: {
          sex: 'female',
          age: 29,
          weight: 60,
          height: 165,
          activityFactor: 1.4,
          goalPercent: -10,
          macroSplit: { proteinPercent: 30, carbsPercent: 40, fatPercent: 30 },
        },
      })
    ).toMatchObject({
      targetCalories: expect.any(Number),
      macros: {
        proteinGrams: expect.any(Number),
        carbsGrams: expect.any(Number),
        fatGrams: expect.any(Number),
      },
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'media-voti',
        input: { values: [24, 30, 28], weights: [6, 9, 3] },
      })
    ).toBeCloseTo(27.6666666667, 6)

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'area-rettangolo',
        input: { base: 10, height: 5, inputUnit: 'ft' },
      })
    ).toMatchObject({
      areaInInputUnit: 50,
      perimeterInInputUnit: 30,
      area: { squareMeters: expect.any(Number) },
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'area-cerchio',
        input: { radius: 2, inputUnit: 'm' },
      })
    ).toMatchObject({
      diameterInInputUnit: 4,
      circumferenceInInputUnit: expect.any(Number),
      area: { squareMeters: expect.any(Number) },
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'conversione-temperatura',
        input: { value: 32, fromUnit: 'f' },
      })
    ).toMatchObject({ celsius: 0, kelvin: 273.15 })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'convertitore-unita-lunghezza',
        input: { value: 1, fromUnit: 'mi' },
      })
    ).toMatchObject({
      kilometers: expect.any(Number),
      feet: expect.any(Number),
      meters: expect.any(Number),
    })

    const randomResult = engine.executeCalculatorRequest({
      calculatorId: 'numeri-casuali',
      input: {
        min: 1,
        max: 10,
        count: 5,
        allowDuplicates: false,
        mode: 'integer',
        seed: 'seed-1',
        sort: 'asc',
      },
    }) as { numbers: number[] }
    expect(randomResult.numbers).toHaveLength(5)
    expect(randomResult.numbers).toEqual([...randomResult.numbers].sort((a, b) => a - b))

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'calcolo-eta',
        input: { birthDate: '2000-03-10', referenceDate: '2026-03-30' },
      })
    ).toMatchObject({
      years: 26,
      months: 0,
      days: 20,
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'calcolo-mancia',
        input: { billAmount: 80, tipPercent: 10, people: 4, servicePercent: 5, rounding: 'none' },
      })
    ).toMatchObject({
      tipAmount: expect.any(Number),
      totalAmount: expect.any(Number),
      perPerson: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'consumo-carburante',
        input: { distance: 300, distanceUnit: 'mi', fuelAmount: 10, fuelUnit: 'gal_us' },
      })
    ).toMatchObject({
      distanceKm: expect.any(Number),
      kmPerFuelUnit: expect.any(Number),
      mpgUs: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'calcolo-imu',
        input: {
          cadastralIncome: 1000,
          multiplier: 160,
          ratePerMille: 10.6,
          ownershipPercent: 100,
          ownedMonths: 12,
          annualDeduction: 0,
        },
      })
    ).toMatchObject({
      netAnnualTax: expect.any(Number),
      installmentJune: expect.any(Number),
      installmentDecember: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'busta-paga-netta',
        input: {
          grossAnnualSalary: 35000,
          employeeContributionRate: 9.19,
          monthlyPayments: 13,
          regionalAdditionalRate: 1.4,
          municipalAdditionalRate: 0.8,
          applyIntegrativeTreatment: true,
          employerContributionRate: 30,
        },
      })
    ).toMatchObject({
      netAnnualSalary: expect.any(Number),
      netMonthlySalary: expect.any(Number),
      companyCostAnnual: expect.any(Number),
    })

    expect(
      engine.executeCalculatorRequest({
        calculatorId: 'cifrario-enigma',
        input: {
          text: 'HELLOWORLD',
          rotors: ['I', 'II', 'III'],
          ringSettings: [1, 1, 1],
          positions: ['A', 'A', 'A'],
          reflector: 'B',
          plugboardPairs: '',
          preserveNonLetters: true,
        },
      })
    ).toMatchObject({
      output: 'ILBDAAMTAZ',
      steppedLetters: 10,
    })
  })

  it('rejects invalid ISO dates and unsupported calculators', async () => {
    const engine = await import('@/lib/api-platform/calculator-engine')

    expect(() =>
      engine.executeCalculatorRequest({
        calculatorId: 'giorni-tra-date',
        input: { startDate: '2026-02-30', endDate: '2026-03-10' },
      })
    ).toThrow(/Data non valida/)

    expect(() =>
      engine.executeCalculatorRequest({
        calculatorId: 'calcolo-eta',
        input: { birthDate: 'not-a-date' },
      })
    ).toThrow(/Data non valida/)

    expect(() =>
      engine.executeCalculatorRequest({
        calculatorId: 'non-esiste',
        input: {},
      })
    ).toThrow('Calculator non supportato via API: non-esiste')
  })

  it('supports wildcard api keys and update operations', async () => {
    const store = await import('@/lib/api-platform/store')

    const { record, rawApiKey } = store.generateApiKey({
      name: 'Wildcard Key',
      calculatorId: '*',
      monthlyQuota: 10,
      overagePackCredits: 1000,
      overagePackPriceCents: 790,
      currency: 'EUR',
    })

    expect(store.isCalculatorAllowed(record, 'percentuali')).toBe(true)
    expect(store.isCalculatorAllowed(record, 'rata-mutuo')).toBe(true)

    const updated = store.updateApiKey(record.id, {
      name: 'Wildcard Key Updated',
      calculatorId: 'percentuali',
      monthlyQuota: 5,
      active: false,
    })

    expect(updated.name).toBe('Wildcard Key Updated')
    expect(updated.calculatorId).toBe('percentuali')
    expect(updated.monthlyQuota).toBe(5)
    expect(updated.active).toBe(false)
    expect(store.authenticateApiKey(rawApiKey)?.key.id).toBe(record.id)
  })
})
