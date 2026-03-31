import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { executeCalculatorRequest } from '@/lib/api-platform/calculator-engine'
import { readApiKeyFromRequest } from '@/lib/api-platform/http'
import {
  authenticateApiKey,
  getUsageSnapshot,
  incrementUsage,
  isCalculatorAllowed,
} from '@/lib/api-platform/store'
import { createOverageCheckoutSession, isStripeBillingEnabled } from '@/lib/api-platform/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const requestSchema = z.object({
  calculatorId: z.string().min(1),
  operation: z.string().optional(),
  input: z.unknown(),
})

export async function POST(request: NextRequest) {
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

  try {
    const payload = requestSchema.parse(await request.json())
    const calculatorId = payload.calculatorId
    if (!isCalculatorAllowed(auth.key, calculatorId)) {
      return NextResponse.json(
        {
          error: `Questa API key è abilitata solo per il calcolatore: ${auth.key.calculatorId}`,
        },
        { status: 403 }
      )
    }

    const usageBefore = getUsageSnapshot(auth.key, calculatorId)
    if (usageBefore.remaining <= 0) {
      let checkoutUrl: string | null = null
      if (isStripeBillingEnabled()) {
        const checkoutSession = await createOverageCheckoutSession({
          apiKeyId: auth.key.id,
          calculatorId,
          monthKey: usageBefore.monthKey,
          credits: auth.key.overagePackCredits,
          unitAmountCents: auth.key.overagePackPriceCents,
          currency: auth.key.currency,
        })
        checkoutUrl = checkoutSession?.url ?? null
      }

      return NextResponse.json(
        {
          error: 'Quota mensile terminata. Acquista crediti per continuare.',
          code: 'quota_exceeded',
          usage: usageBefore,
          checkoutUrl,
        },
        { status: 402 }
      )
    }

    const result = executeCalculatorRequest(payload)
    const usageAfter = incrementUsage(auth.key, calculatorId, usageBefore.monthKey)

    return NextResponse.json(
      {
        calculatorId,
        operation: payload.operation ?? null,
        result,
        usage: usageAfter,
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
