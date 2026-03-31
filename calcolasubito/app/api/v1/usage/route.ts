import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey, getUsageSnapshot, isCalculatorAllowed } from '@/lib/api-platform/store'
import { readApiKeyFromRequest } from '@/lib/api-platform/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const rawApiKey = readApiKeyFromRequest(request)
  if (!rawApiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
  }

  const auth = authenticateApiKey(rawApiKey)
  if (!auth) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  if (!auth.key.active) {
    return NextResponse.json({ error: 'API key disattivata' }, { status: 403 })
  }

  const calculatorId = request.nextUrl.searchParams.get('calculatorId') || auth.key.calculatorId
  if (!isCalculatorAllowed(auth.key, calculatorId)) {
    return NextResponse.json(
      {
        error: `Questa API key è abilitata solo per il calcolatore: ${auth.key.calculatorId}`,
      },
      { status: 403 }
    )
  }

  const usage = getUsageSnapshot(auth.key, calculatorId)
  return NextResponse.json(
    {
      keyId: auth.key.id,
      calculatorId,
      usage,
    },
    { status: 200 }
  )
}
