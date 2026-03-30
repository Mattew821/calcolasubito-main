interface RateLimitEntry {
  count: number
  windowStart: number
  blockedUntil: number
  touchedAt: number
}

export interface RateLimiterConfig {
  maxRequests: number
  windowMs: number
  blockDurationMs: number
  maxKeys: number
  pruneIntervalMs?: number
}

export interface RateLimitCheckResult {
  allowed: boolean
  retryAfterSeconds: number
  remainingRequests: number
  reason: 'allowed' | 'blocked' | 'limit-exceeded'
}

export interface RateLimiter {
  check: (key: string, now?: number) => RateLimitCheckResult
  size: () => number
  clear: () => void
}

const MIN_PRUNE_INTERVAL_MS = 5_000
const FALLBACK_KEY = 'unknown'

function normalizeKey(value: string): string {
  const trimmed = (value || '').trim()
  if (!trimmed) {
    return FALLBACK_KEY
  }
  return trimmed.slice(0, 200)
}

export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  const maxRequests = Math.max(1, Math.floor(config.maxRequests))
  const windowMs = Math.max(1_000, Math.floor(config.windowMs))
  const blockDurationMs = Math.max(1_000, Math.floor(config.blockDurationMs))
  const maxKeys = Math.max(100, Math.floor(config.maxKeys))
  const pruneIntervalMs = Math.max(MIN_PRUNE_INTERVAL_MS, Math.floor(config.pruneIntervalMs ?? 30_000))

  const ttlMs = Math.max(windowMs * 2, blockDurationMs * 2, 120_000)
  const store = new Map<string, RateLimitEntry>()
  let lastPruneAt = 0

  function toRetryAfterSeconds(blockedUntil: number, now: number): number {
    return Math.max(1, Math.ceil((blockedUntil - now) / 1000))
  }

  function trimToMaxKeys() {
    if (store.size <= maxKeys) {
      return
    }

    const oldestEntries = [...store.entries()].sort((a, b) => a[1].touchedAt - b[1].touchedAt)
    const toDelete = store.size - maxKeys
    for (let index = 0; index < toDelete; index += 1) {
      const oldest = oldestEntries[index]
      if (!oldest) {
        break
      }
      store.delete(oldest[0])
    }
  }

  function pruneIfNeeded(now: number) {
    if (now - lastPruneAt < pruneIntervalMs) {
      return
    }
    lastPruneAt = now

    for (const [key, entry] of store.entries()) {
      if (now - entry.touchedAt > ttlMs) {
        store.delete(key)
      }
    }

    trimToMaxKeys()
  }

  function check(key: string, now = Date.now()): RateLimitCheckResult {
    const normalizedKey = normalizeKey(key)
    pruneIfNeeded(now)

    const existing = store.get(normalizedKey)
    const entry: RateLimitEntry =
      existing ??
      {
        count: 0,
        windowStart: now,
        blockedUntil: 0,
        touchedAt: now,
      }
    entry.touchedAt = now

    if (entry.blockedUntil > now) {
      store.set(normalizedKey, entry)
      return {
        allowed: false,
        retryAfterSeconds: toRetryAfterSeconds(entry.blockedUntil, now),
        remainingRequests: 0,
        reason: 'blocked',
      }
    }

    if (now - entry.windowStart >= windowMs) {
      entry.count = 0
      entry.windowStart = now
      entry.blockedUntil = 0
    }

    entry.count += 1
    const remainingRequests = Math.max(0, maxRequests - entry.count)

    if (entry.count > maxRequests) {
      entry.blockedUntil = now + blockDurationMs
      store.set(normalizedKey, entry)
      trimToMaxKeys()
      return {
        allowed: false,
        retryAfterSeconds: toRetryAfterSeconds(entry.blockedUntil, now),
        remainingRequests: 0,
        reason: 'limit-exceeded',
      }
    }

    store.set(normalizedKey, entry)
    trimToMaxKeys()
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remainingRequests,
      reason: 'allowed',
    }
  }

  return {
    check,
    size: () => store.size,
    clear: () => {
      store.clear()
      lastPruneAt = 0
    },
  }
}
