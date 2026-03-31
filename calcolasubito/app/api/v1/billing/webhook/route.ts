import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { addPurchasedCredits, isProcessedStripeSession, markStripeSessionProcessed } from '@/lib/api-platform/store'
import { parseStripeWebhookEvent } from '@/lib/api-platform/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  try {
    const rawPayload = await request.text()
    const event = parseStripeWebhookEvent(rawPayload, signature)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const sessionId = session.id

      if (isProcessedStripeSession(sessionId)) {
        return NextResponse.json({ received: true, duplicated: true }, { status: 200 })
      }

      const apiKeyId = session.metadata?.apiKeyId
      const monthKey = session.metadata?.monthKey
      const creditsRaw = session.metadata?.credits
      const credits = Number(creditsRaw)

      if (!apiKeyId || !monthKey || !Number.isFinite(credits) || !Number.isInteger(credits) || credits <= 0) {
        throw new Error('Metadata checkout incompleta')
      }

      addPurchasedCredits(apiKeyId, monthKey, credits)
      markStripeSessionProcessed(sessionId)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
