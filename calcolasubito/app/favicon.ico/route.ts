import { NextRequest, NextResponse } from 'next/server'

function buildRedirect(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/icon.svg', request.url), 308)
}

export function GET(request: NextRequest): NextResponse {
  return buildRedirect(request)
}

export function HEAD(request: NextRequest): NextResponse {
  return buildRedirect(request)
}
