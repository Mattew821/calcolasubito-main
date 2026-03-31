import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminToken } from '@/lib/api-platform/http'
import {
  generateApiKey,
  listApiKeys,
  sanitizeApiKeyForList,
} from '@/lib/api-platform/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const createKeySchema = z.object({
  name: z.string().min(2).max(80),
  calculatorId: z.string().min(1),
  monthlyQuota: z.number().int().positive().max(10_000_000).optional(),
  overagePackCredits: z.number().int().positive().max(10_000_000).optional(),
  overagePackPriceCents: z.number().int().positive().max(500_000).optional(),
  currency: z.string().optional(),
  active: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  const auth = requireAdminToken(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: 401 })
  }

  const keys = listApiKeys().map((record) => sanitizeApiKeyForList(record))
  return NextResponse.json({ keys }, { status: 200 })
}

export async function POST(request: NextRequest) {
  const auth = requireAdminToken(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: 401 })
  }

  try {
    const json = await request.json()
    const payload = createKeySchema.parse(json)
    const { record, rawApiKey } = generateApiKey(payload)

    return NextResponse.json(
      {
        key: sanitizeApiKeyForList(record),
        rawApiKey,
        warning: 'Salva ora questa API key: non sarà più visibile in chiaro.',
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
