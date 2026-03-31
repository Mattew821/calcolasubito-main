import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminToken } from '@/lib/api-platform/http'
import { sanitizeApiKeyForList, updateApiKey } from '@/lib/api-platform/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const updateKeySchema = z.object({
  name: z.string().min(2).max(80).optional(),
  calculatorId: z.string().min(1).optional(),
  monthlyQuota: z.number().int().positive().max(10_000_000).optional(),
  overagePackCredits: z.number().int().positive().max(10_000_000).optional(),
  overagePackPriceCents: z.number().int().positive().max(500_000).optional(),
  currency: z.string().optional(),
  active: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  context: { params: { keyId: string } }
) {
  const auth = requireAdminToken(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: 401 })
  }

  try {
    const payload = updateKeySchema.parse(await request.json())
    const updated = updateApiKey(context.params.keyId, payload)
    return NextResponse.json({ key: sanitizeApiKeyForList(updated) }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
