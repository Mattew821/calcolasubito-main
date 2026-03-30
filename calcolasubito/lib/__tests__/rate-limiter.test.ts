import { createRateLimiter } from '@/lib/security/rate-limiter'

describe('rate limiter', () => {
  it('allows requests until threshold and blocks the next one', () => {
    const limiter = createRateLimiter({
      maxRequests: 3,
      windowMs: 1_000,
      blockDurationMs: 5_000,
      maxKeys: 1_000,
    })

    expect(limiter.check('ip:1', 0).allowed).toBe(true)
    expect(limiter.check('ip:1', 100).allowed).toBe(true)
    expect(limiter.check('ip:1', 200).allowed).toBe(true)

    const blocked = limiter.check('ip:1', 300)
    expect(blocked.allowed).toBe(false)
    expect(blocked.reason).toBe('limit-exceeded')
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('resets counters after the window elapses', () => {
    const limiter = createRateLimiter({
      maxRequests: 1,
      windowMs: 1_000,
      blockDurationMs: 1_000,
      maxKeys: 1_000,
    })

    expect(limiter.check('ip:2', 0).allowed).toBe(true)
    expect(limiter.check('ip:2', 10).allowed).toBe(false)
    expect(limiter.check('ip:2', 2_100).allowed).toBe(true)
  })

  it('keeps a client blocked for the entire block duration', () => {
    const limiter = createRateLimiter({
      maxRequests: 1,
      windowMs: 1_000,
      blockDurationMs: 5_000,
      maxKeys: 1_000,
    })

    expect(limiter.check('ip:3', 0).allowed).toBe(true)
    expect(limiter.check('ip:3', 10).allowed).toBe(false)
    expect(limiter.check('ip:3', 1_000).reason).toBe('blocked')
    expect(limiter.check('ip:3', 5_011).allowed).toBe(true)
  })

  it('prunes keys when map grows over configured max', () => {
    const limiter = createRateLimiter({
      maxRequests: 2,
      windowMs: 1_000,
      blockDurationMs: 1_000,
      maxKeys: 100,
      pruneIntervalMs: 5_000,
    })

    for (let index = 0; index < 150; index += 1) {
      limiter.check(`ip:${index}`, index)
    }

    // Force prune pass
    limiter.check('ip:151', 10_000)
    expect(limiter.size()).toBeLessThanOrEqual(100)
  })
})
