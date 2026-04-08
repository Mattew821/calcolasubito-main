import { NextRequest, NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/site-config'

const canonicalUrl = new URL(BASE_URL)
const canonicalHost = canonicalUrl.host.toLowerCase()
const canonicalProtocol = canonicalUrl.protocol

function getRequestHost(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = request.headers.get('host')
  return (forwardedHost || host || '').toLowerCase()
}

function removePort(host: string): string {
  return host.split(':')[0] ?? host
}

function isLocalHost(host: string): boolean {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')
}

export function middleware(request: NextRequest) {
  const host = getRequestHost(request)
  const hostWithoutPort = removePort(host)
  if (!hostWithoutPort || isLocalHost(hostWithoutPort) || hostWithoutPort === canonicalHost) {
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

