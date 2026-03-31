export interface ApiKeyRecord {
  id: string
  name: string
  calculatorId: string
  monthlyQuota: number
  overagePackCredits: number
  overagePackPriceCents: number
  currency: string
  active: boolean
  keyPrefix: string
  keyHash: string
  createdAt: string
  updatedAt: string
}

export interface UsageMonthRecord {
  totalUsed: number
  perCalculator: Record<string, number>
  purchasedCredits: number
}

export interface BillingState {
  keys: Record<string, ApiKeyRecord>
  usageByMonth: Record<string, UsageMonthRecord>
  processedStripeSessions: Record<string, string>
}

export interface UsageSnapshot {
  monthKey: string
  totalUsed: number
  calculatorUsed: number
  monthlyQuota: number
  purchasedCredits: number
  totalAllowed: number
  remaining: number
}

export interface ApiKeyAuthResult {
  key: ApiKeyRecord
  rawKey: string
}
