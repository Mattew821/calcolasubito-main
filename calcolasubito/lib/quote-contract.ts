import { z } from 'zod'

export const quoteRiskFactors = ['low', 'medium', 'high'] as const
export const quoteScenarioNames = ['standard', 'aggressive', 'safe'] as const

export const quoteRiskFactorSchema = z.enum(quoteRiskFactors)
export const quoteScenarioSchema = z.enum(quoteScenarioNames)

export type QuoteRiskFactor = z.infer<typeof quoteRiskFactorSchema>
export type QuoteScenarioName = z.infer<typeof quoteScenarioSchema>

export const quoteRequestSchema = z
  .object({
    base_value: z.coerce.number().finite().positive(),
    multiplier: z.coerce.number().finite().positive(),
    risk_factor: quoteRiskFactorSchema,
  })
  .strict()

export type QuoteRequest = z.infer<typeof quoteRequestSchema>

export const quoteTelemetrySchema = z
  .object({
    calculation_id: z.string().min(1),
    complexity: z.literal('O(1)'),
    request_signature: z.string().min(1),
    sanity_floor: z.number().finite().positive(),
    sanity_check_passed: z.boolean(),
    created_at: z.string().min(1),
  })
  .strict()

export const quoteResponseSchema = z
  .object({
    contract_version: z.literal('quote-contract-v1'),
    input_echo: quoteRequestSchema,
    risk_adjustment: z.number().finite().positive(),
    final_quote: z.number().finite().positive(),
    sanity_floor: z.number().finite().positive(),
    sanity_check_passed: z.boolean(),
    telemetry: quoteTelemetrySchema,
  })
  .strict()

export type QuoteResponse = z.infer<typeof quoteResponseSchema>

export const quoteScenarioPresets: Record<QuoteScenarioName, QuoteRequest> = {
  standard: {
    base_value: 120,
    multiplier: 1.15,
    risk_factor: 'medium',
  },
  aggressive: {
    base_value: 180,
    multiplier: 1.4,
    risk_factor: 'high',
  },
  safe: {
    base_value: 95,
    multiplier: 1.05,
    risk_factor: 'low',
  },
}

const riskAdjustments: Record<QuoteRiskFactor, number> = {
  low: 0.95,
  medium: 1,
  high: 1.15,
}

export const quoteSanityFloor = 90

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100
}

function buildRequestSignature(request: QuoteRequest): string {
  return `${request.base_value}:${request.multiplier}:${request.risk_factor}`
}

export function calculateQuotePreview(request: QuoteRequest, createdAt = new Date().toISOString()): QuoteResponse {
  const riskAdjustment = riskAdjustments[request.risk_factor]
  const finalQuote = roundToTwo(request.base_value * request.multiplier * riskAdjustment)
  const sanityCheckPassed = finalQuote >= quoteSanityFloor

  if (!sanityCheckPassed) {
    throw new Error(`Quote sanity check failed: ${finalQuote.toFixed(2)} < ${quoteSanityFloor.toFixed(2)}`)
  }

  return {
    contract_version: 'quote-contract-v1',
    input_echo: request,
    risk_adjustment: riskAdjustment,
    final_quote: finalQuote,
    sanity_floor: quoteSanityFloor,
    sanity_check_passed: sanityCheckPassed,
    telemetry: {
      calculation_id: `quote-${buildRequestSignature(request)}`,
      complexity: 'O(1)',
      request_signature: buildRequestSignature(request),
      sanity_floor: quoteSanityFloor,
      sanity_check_passed: sanityCheckPassed,
      created_at: createdAt,
    },
  }
}

export function compareQuotePayload(request: QuoteRequest, response: QuoteResponse) {
  const expected = calculateQuotePreview(request)
  const mismatches: string[] = []

  if (response.contract_version !== expected.contract_version) {
    mismatches.push('contract_version')
  }

  if (response.input_echo.base_value !== request.base_value) {
    mismatches.push('input_echo.base_value')
  }
  if (response.input_echo.multiplier !== request.multiplier) {
    mismatches.push('input_echo.multiplier')
  }
  if (response.input_echo.risk_factor !== request.risk_factor) {
    mismatches.push('input_echo.risk_factor')
  }

  if (response.final_quote !== expected.final_quote) {
    mismatches.push('final_quote')
  }

  if (response.risk_adjustment !== expected.risk_adjustment) {
    mismatches.push('risk_adjustment')
  }

  if (response.sanity_check_passed !== expected.sanity_check_passed) {
    mismatches.push('sanity_check_passed')
  }

  if (response.telemetry.request_signature !== expected.telemetry.request_signature) {
    mismatches.push('telemetry.request_signature')
  }

  return {
    matches: mismatches.length === 0,
    mismatches,
    expected,
  }
}
