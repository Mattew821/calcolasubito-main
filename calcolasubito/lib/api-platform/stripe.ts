import Stripe from 'stripe'

let stripeClient: Stripe | null | undefined

function getStripeClient(): Stripe | null {
  if (stripeClient !== undefined) {
    return stripeClient
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    stripeClient = null
    return stripeClient
  }

  stripeClient = new Stripe(secretKey)
  return stripeClient
}

export function isStripeBillingEnabled(): boolean {
  return getStripeClient() !== null
}

function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || 'https://calcolasubito.vercel.app'
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}

export async function createOverageCheckoutSession(params: {
  apiKeyId: string
  calculatorId: string
  monthKey: string
  credits: number
  unitAmountCents: number
  currency: string
}): Promise<{ id: string; url: string } | null> {
  const stripe = getStripeClient()
  if (!stripe) {
    return null
  }

  const baseUrl = getBaseUrl()
  const successUrl = process.env.API_BILLING_SUCCESS_URL || `${baseUrl}/about?billing=success`
  const cancelUrl = process.env.API_BILLING_CANCEL_URL || `${baseUrl}/about?billing=cancel`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: params.apiKeyId,
    metadata: {
      apiKeyId: params.apiKeyId,
      calculatorId: params.calculatorId,
      monthKey: params.monthKey,
      credits: String(params.credits),
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: params.currency,
          unit_amount: params.unitAmountCents,
          product_data: {
            name: `CalcolaSubito API credits (${params.credits})`,
            description: `Ricarica crediti API per ${params.calculatorId}`,
          },
        },
      },
    ],
    allow_promotion_codes: true,
  })

  if (!session.url) {
    return null
  }

  return { id: session.id, url: session.url }
}

export function parseStripeWebhookEvent(payload: string, signature: string): Stripe.Event {
  const stripe = getStripeClient()
  if (!stripe) {
    throw new Error('Stripe non configurato')
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET mancante')
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
