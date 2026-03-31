import { NextRequest, NextResponse } from 'next/server'
import { ALLOWED_METHODS, evaluateRequestThreat } from '@/lib/security/request-guard'
import { createRateLimiter } from '@/lib/security/rate-limiter'

const DEFAULT_BASE_URL = 'https://calcolasubito.vercel.app'
const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL
const normalizedBaseUrl = /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`
const canonicalUrl = new URL(normalizedBaseUrl)
const canonicalHost = canonicalUrl.host.toLowerCase()
const canonicalHostname = canonicalUrl.hostname.toLowerCase()
const canonicalProtocol = canonicalUrl.protocol

function parseIntegerEnv(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name])
  if (!Number.isFinite(value)) {
    return fallback
  }
  return Math.min(max, Math.max(min, Math.floor(value)))
}

const RATE_LIMIT_WINDOW_MS = parseIntegerEnv('REQUEST_RATE_LIMIT_WINDOW_MS', 60_000, 1_000, 600_000)
const RATE_LIMIT_MAX_PER_WINDOW = parseIntegerEnv('REQUEST_RATE_LIMIT_MAX_PER_WINDOW', 240, 30, 10_000)
const RATE_LIMIT_BLOCK_MS = parseIntegerEnv('REQUEST_RATE_LIMIT_BLOCK_MS', 600_000, 10_000, 86_400_000)
const RATE_LIMIT_BURST_WINDOW_MS = parseIntegerEnv('REQUEST_RATE_LIMIT_BURST_WINDOW_MS', 10_000, 1_000, 120_000)
const RATE_LIMIT_BURST_MAX = parseIntegerEnv('REQUEST_RATE_LIMIT_BURST_MAX', 80, 10, 2_000)
const RATE_LIMIT_BURST_BLOCK_MS = parseIntegerEnv('REQUEST_RATE_LIMIT_BURST_BLOCK_MS', 120_000, 5_000, 3_600_000)
const RATE_LIMIT_MAX_KEYS = parseIntegerEnv('REQUEST_RATE_LIMIT_MAX_KEYS', 20_000, 1_000, 200_000)

function isDevelopmentRuntime(): boolean {
  return (process.env.NODE_ENV || '').toLowerCase() === 'development'
}

const RATE_LIMIT_DISABLED = isDevelopmentRuntime() && process.env.REQUEST_RATE_LIMIT_DISABLED === 'true'

const sustainedRateLimiter = createRateLimiter({
  maxRequests: RATE_LIMIT_MAX_PER_WINDOW,
  windowMs: RATE_LIMIT_WINDOW_MS,
  blockDurationMs: RATE_LIMIT_BLOCK_MS,
  maxKeys: RATE_LIMIT_MAX_KEYS,
})

const burstRateLimiter = createRateLimiter({
  maxRequests: RATE_LIMIT_BURST_MAX,
  windowMs: RATE_LIMIT_BURST_WINDOW_MS,
  blockDurationMs: RATE_LIMIT_BURST_BLOCK_MS,
  maxKeys: RATE_LIMIT_MAX_KEYS,
})

function getRequestHost(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = request.headers.get('host')
  return (forwardedHost || host || '').toLowerCase()
}

function isLocalHost(host: string): boolean {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')
}

function removePort(host: string): string {
  return host.split(':')[0] ?? host
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]
    if (firstIp) {
      return firstIp.trim()
    }
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return (request.ip || '').trim()
}

function buildClientRateLimitKey(clientIp: string, userAgent: string): string {
  if (clientIp) {
    return `ip:${clientIp}`
  }
  const compactUa = userAgent.toLowerCase().replace(/\s+/g, ' ').slice(0, 80)
  return `ua:${compactUa || 'unknown'}`
}

function buildBlockedResponse(status: 403 | 405, reason: string): NextResponse {
  const response = new NextResponse('Request blocked by security policy.', { status })
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('x-request-guard', reason)
  if (status === 405) {
    response.headers.set('Allow', [...ALLOWED_METHODS].join(', '))
  }
  return response
}

function buildRateLimitedResponse(retryAfterSeconds: number, reason: string): NextResponse {
  const response = new NextResponse('Too many requests. Retry later.', { status: 429 })
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Retry-After', String(retryAfterSeconds))
  response.headers.set('x-request-guard', reason)
  return response
}

export function middleware(request: NextRequest) {
  // Secure-by-default: enable request guard in every runtime except local development.
  // This avoids accidental bypass when NODE_ENV is not explicitly set by the hosting runtime.
  if (isDevelopmentRuntime()) {
    return NextResponse.next()
  }

  const userAgent = request.headers.get('user-agent') || ''
  const threatResult = evaluateRequestThreat({
    method: request.method,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    userAgent,
  })

  if (!threatResult.allowed) {
    return buildBlockedResponse(threatResult.statusCode ?? 403, threatResult.reason)
  }

  if (!RATE_LIMIT_DISABLED) {
    const clientIp = getClientIp(request)
    const clientKey = buildClientRateLimitKey(clientIp, userAgent)

    const burstCheck = burstRateLimiter.check(clientKey)
    if (!burstCheck.allowed) {
      return buildRateLimitedResponse(burstCheck.retryAfterSeconds, `rate-limit-burst-${burstCheck.reason}`)
    }

    const sustainedCheck = sustainedRateLimiter.check(clientKey)
    if (!sustainedCheck.allowed) {
      return buildRateLimitedResponse(
        sustainedCheck.retryAfterSeconds,
        `rate-limit-window-${sustainedCheck.reason}`
      )
    }
  }

  const requestHost = getRequestHost(request)
  const requestHostname = removePort(requestHost)
  if (!requestHost || isLocalHost(requestHost) || requestHostname === canonicalHostname) {
    const response = NextResponse.next()
    response.headers.set('x-request-guard', 'active')
    return response
  }

  const redirectUrl = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    `${canonicalProtocol}//${canonicalHost}`
  )
  const response = NextResponse.redirect(redirectUrl, 308)
  response.headers.set('x-request-guard', 'active')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
