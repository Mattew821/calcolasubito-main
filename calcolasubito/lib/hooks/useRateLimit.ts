import { useCallback, useRef, useState } from 'react'

interface RateLimitConfig {
  maxRequests: number // max requests per window
  windowMs: number // time window in milliseconds
}

interface RateLimitState {
  isLimited: boolean
  remainingRequests: number
  resetTime: number | null
}

/**
 * Custom hook for client-side rate limiting
 * Prevents rapid consecutive function calls
 * Based on token bucket algorithm pattern
 *
 * Sources:
 * - https://github.com/jaredLunde/react-hook (throttle patterns)
 * - https://github.com/upstash/ratelimit-js (token bucket algorithm)
 */
export function useRateLimit(config: RateLimitConfig) {
  const { maxRequests, windowMs } = config

  // Track request timestamps in current window
  const requestTimestampsRef = useRef<number[]>([])
  const windowStartRef = useRef<number>(Date.now())

  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remainingRequests: maxRequests,
    resetTime: null,
  })

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now()
    const windowAge = now - windowStartRef.current

    // Reset window if expired
    if (windowAge > windowMs) {
      requestTimestampsRef.current = []
      windowStartRef.current = now
      setState({
        isLimited: false,
        remainingRequests: maxRequests,
        resetTime: null,
      })
      return true
    }

    // Check if limit exceeded
    const currentRequests = requestTimestampsRef.current.length
    if (currentRequests >= maxRequests) {
      // Calculate when next request will be allowed
      const oldestRequestTime = requestTimestampsRef.current[0] || windowStartRef.current
      const resetTime = oldestRequestTime + windowMs

      setState({
        isLimited: true,
        remainingRequests: 0,
        resetTime,
      })
      return false
    }

    // Request allowed
    requestTimestampsRef.current.push(now)
    const remaining = maxRequests - requestTimestampsRef.current.length

    setState({
      isLimited: false,
      remainingRequests: remaining,
      resetTime: null,
    })
    return true
  }, [maxRequests, windowMs])

  const reset = useCallback(() => {
    requestTimestampsRef.current = []
    windowStartRef.current = Date.now()
    setState({
      isLimited: false,
      remainingRequests: maxRequests,
      resetTime: null,
    })
  }, [maxRequests])

  return {
    checkRateLimit,
    reset,
    ...state,
  }
}

/**
 * Throttle a callback function to prevent rapid execution
 * Simple implementation based on react-use pattern
 *
 * Sources:
 * - https://github.com/streamich/react-use/blob/master/docs/useThrottle.md
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  waitMs: number,
  options: { leading?: boolean; trailing?: boolean } = {}
) {
  const { leading = true, trailing = true } = options
  const lastRunRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastArgsRef = useRef<any[] | null>(null)

  const throttled = useCallback(
    (...args: any[]) => {
      const now = Date.now()
      const timeSinceLastRun = now - lastRunRef.current

      // Clear pending trailing call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (timeSinceLastRun >= waitMs) {
        // Execute immediately if enough time has passed
        if (leading) {
          lastRunRef.current = now
          callback(...args)
        }
      } else {
        // Schedule trailing call if enabled
        if (trailing) {
          lastArgsRef.current = args
          timeoutRef.current = setTimeout(() => {
            callback(...(lastArgsRef.current || []))
            lastRunRef.current = Date.now()
            timeoutRef.current = null
          }, waitMs - timeSinceLastRun)
        }
      }
    },
    [callback, waitMs, leading, trailing]
  )

  return throttled as T
}
