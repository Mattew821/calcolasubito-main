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
})
