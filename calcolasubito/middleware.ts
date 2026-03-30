import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_BASE_URL = 'https://calcolasubito.vercel.app'
const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL
const normalizedBaseUrl = /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`
const canonicalUrl = new URL(normalizedBaseUrl)
const canonicalHost = canonicalUrl.host.toLowerCase()
const canonicalHostname = canonicalUrl.hostname.toLowerCase()
const canonicalProtocol = canonicalUrl.protocol

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

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  const requestHost = getRequestHost(request)
  const requestHostname = removePort(requestHost)
  if (!requestHost || isLocalHost(requestHost) || requestHostname === canonicalHostname) {
    return NextResponse.next()
  }

  const redirectUrl = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    `${canonicalProtocol}//${canonicalHost}`
  )
  return NextResponse.redirect(redirectUrl, 308)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
