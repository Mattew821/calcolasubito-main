import { NextRequest } from 'next/server'

export function requireAdminToken(request: NextRequest): { ok: true } | { ok: false; message: string } {
  const configuredToken = process.env.API_ADMIN_TOKEN
  if (!configuredToken) {
    return { ok: false, message: 'API_ADMIN_TOKEN non configurato' }
  }

  const providedToken =
    request.headers.get('x-admin-token') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    ''

  if (providedToken !== configuredToken) {
    return { ok: false, message: 'Unauthorized admin token' }
  }

  return { ok: true }
}

export function readApiKeyFromRequest(request: NextRequest): string | null {
  const fromHeader = request.headers.get('x-api-key')
  if (fromHeader) {
    return fromHeader.trim()
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader && /^ApiKey\s+/i.test(authHeader)) {
    return authHeader.replace(/^ApiKey\s+/i, '').trim()
  }

  return null
}
