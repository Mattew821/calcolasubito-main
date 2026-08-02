import { NextResponse } from 'next/server'
import { calculateQuotePreview, quoteRequestSchema } from '@/lib/quote-contract'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const payload = quoteRequestSchema.parse(await request.json())
    const result = calculateQuotePreview(payload, new Date().toISOString())

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid quote request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
