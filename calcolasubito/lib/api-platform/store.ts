import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CALCULATOR_CATALOG } from '@/lib/calculator-catalog'
import type {
  ApiKeyAuthResult,
  ApiKeyRecord,
  BillingState,
  UsageMonthRecord,
  UsageSnapshot,
} from '@/lib/api-platform/types'

const DEFAULT_MONTHLY_QUOTA = 1000
const DEFAULT_OVERAGE_PACK_CREDITS = 1000
const DEFAULT_OVERAGE_PACK_PRICE_CENTS = 790
const DEFAULT_CURRENCY = 'eur'

const initialState: BillingState = {
  keys: {},
  usageByMonth: {},
  processedStripeSessions: {},
}

const ALLOWED_CALCULATOR_IDS = new Set(CALCULATOR_CATALOG.map((entry) => entry.id))
const BILLING_DATA_FILE = resolve(
  process.cwd(),
  process.env.API_BILLING_FILE || '.data/api-billing-state.json'
)
const PERSIST_TO_FILE = process.env.API_BILLING_STORAGE !== 'memory'
const API_KEY_HASH_SECRET = process.env.API_KEY_HASH_SECRET || 'calcolasubito-api-key-secret'

let stateCache: BillingState | null = null

function cloneState(value: BillingState): BillingState {
  return JSON.parse(JSON.stringify(value)) as BillingState
}

function ensureDataDir(): void {
  const dataDir = resolve(BILLING_DATA_FILE, '..')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }
}

function loadState(): BillingState {
  if (stateCache) {
    return stateCache
  }

  if (!PERSIST_TO_FILE) {
    stateCache = cloneState(initialState)
    return stateCache
  }

  try {
    if (!existsSync(BILLING_DATA_FILE)) {
      stateCache = cloneState(initialState)
      return stateCache
    }

    const raw = readFileSync(BILLING_DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<BillingState>
    stateCache = {
      keys: parsed.keys ?? {},
      usageByMonth: parsed.usageByMonth ?? {},
      processedStripeSessions: parsed.processedStripeSessions ?? {},
    }
    return stateCache
  } catch {
    stateCache = cloneState(initialState)
    return stateCache
  }
}

function saveState(nextState: BillingState): void {
  stateCache = nextState
  if (!PERSIST_TO_FILE) {
    return
  }

  ensureDataDir()
  writeFileSync(BILLING_DATA_FILE, JSON.stringify(nextState, null, 2), 'utf8')
}

function nowIso(): string {
  return new Date().toISOString()
}

function getRomeMonthKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date)

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${map.year}-${map.month}`
}

function buildUsageMapKey(apiKeyId: string, monthKey: string): string {
  return `${apiKeyId}:${monthKey}`
}

function normalizeCurrency(value: string | undefined): string {
  const raw = (value || DEFAULT_CURRENCY).trim().toLowerCase()
  return /^[a-z]{3}$/.test(raw) ? raw : DEFAULT_CURRENCY
}

function hashApiKey(rawApiKey: string): string {
  return createHash('sha256')
    .update(`${API_KEY_HASH_SECRET}:${rawApiKey}`)
    .digest('hex')
}

function constantTimeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  const bufferA = Buffer.from(a, 'hex')
  const bufferB = Buffer.from(b, 'hex')
  if (bufferA.length !== bufferB.length) {
    return false
  }
  return timingSafeEqual(bufferA, bufferB)
}

function createUsageMonthRecord(): UsageMonthRecord {
  return {
    totalUsed: 0,
    perCalculator: {},
    purchasedCredits: 0,
  }
}

function assertValidCalculatorId(calculatorId: string): void {
  if (calculatorId === '*') {
    return
  }
  if (!ALLOWED_CALCULATOR_IDS.has(calculatorId)) {
    throw new Error(`Calculator non supportato: ${calculatorId}`)
  }
}

function sanitizePositiveInteger(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return fallback
  }
  return Math.min(max, Math.max(min, Math.floor(parsed)))
}

export function generateApiKey(params: {
  name: string
  calculatorId: string
  monthlyQuota?: number
  overagePackCredits?: number
  overagePackPriceCents?: number
  currency?: string
  active?: boolean
}): { record: ApiKeyRecord; rawApiKey: string } {
  const trimmedName = params.name.trim()
  if (trimmedName.length < 2 || trimmedName.length > 80) {
    throw new Error('Name deve avere tra 2 e 80 caratteri')
  }

  assertValidCalculatorId(params.calculatorId)

  const id = `ak_${randomBytes(8).toString('hex')}`
  const token = randomBytes(24).toString('hex')
  const rawApiKey = `cs_live.${id}.${token}`
  const createdAt = nowIso()
  const record: ApiKeyRecord = {
    id,
    name: trimmedName,
    calculatorId: params.calculatorId,
    monthlyQuota: sanitizePositiveInteger(params.monthlyQuota, DEFAULT_MONTHLY_QUOTA, 1, 10_000_000),
    overagePackCredits: sanitizePositiveInteger(
      params.overagePackCredits,
      DEFAULT_OVERAGE_PACK_CREDITS,
      1,
      10_000_000
    ),
    overagePackPriceCents: sanitizePositiveInteger(
      params.overagePackPriceCents,
      DEFAULT_OVERAGE_PACK_PRICE_CENTS,
      50,
      500_000
    ),
    currency: normalizeCurrency(params.currency),
    active: params.active ?? true,
    keyPrefix: rawApiKey.slice(0, 18),
    keyHash: hashApiKey(rawApiKey),
    createdAt,
    updatedAt: createdAt,
  }

  const state = loadState()
  const nextState = cloneState(state)
  nextState.keys[record.id] = record
  saveState(nextState)

  return { record, rawApiKey }
}

function parseApiKeyId(rawApiKey: string): string | null {
  const parts = rawApiKey.split('.')
  if (parts.length !== 3) {
    return null
  }
  if (parts[0] !== 'cs_live') {
    return null
  }
  const keyId = parts[1]
  if (!keyId || !/^ak_[a-f0-9]{16}$/i.test(keyId)) {
    return null
  }
  return keyId
}

export function authenticateApiKey(rawApiKey: string): ApiKeyAuthResult | null {
  const keyId = parseApiKeyId(rawApiKey.trim())
  if (!keyId) {
    return null
  }

  const state = loadState()
  const key = state.keys[keyId]
  if (!key) {
    return null
  }

  const incomingHash = hashApiKey(rawApiKey)
  if (!constantTimeEqualHex(incomingHash, key.keyHash)) {
    return null
  }

  return { key, rawKey: rawApiKey }
}

function readUsageRecord(apiKeyId: string, monthKey: string): UsageMonthRecord {
  const state = loadState()
  return state.usageByMonth[buildUsageMapKey(apiKeyId, monthKey)] ?? createUsageMonthRecord()
}

export function getUsageSnapshot(
  key: ApiKeyRecord,
  calculatorId: string,
  date: Date = new Date()
): UsageSnapshot {
  const monthKey = getRomeMonthKey(date)
  const usageRecord = readUsageRecord(key.id, monthKey)
  const totalAllowed = key.monthlyQuota + usageRecord.purchasedCredits
  const remaining = totalAllowed - usageRecord.totalUsed

  return {
    monthKey,
    totalUsed: usageRecord.totalUsed,
    calculatorUsed: usageRecord.perCalculator[calculatorId] ?? 0,
    monthlyQuota: key.monthlyQuota,
    purchasedCredits: usageRecord.purchasedCredits,
    totalAllowed,
    remaining,
  }
}

export function isCalculatorAllowed(key: ApiKeyRecord, calculatorId: string): boolean {
  return key.calculatorId === '*' || key.calculatorId === calculatorId
}

export function incrementUsage(key: ApiKeyRecord, calculatorId: string, monthKey: string): UsageSnapshot {
  const state = loadState()
  const nextState = cloneState(state)
  const mapKey = buildUsageMapKey(key.id, monthKey)
  const usageRecord = nextState.usageByMonth[mapKey] ?? createUsageMonthRecord()
  usageRecord.totalUsed += 1
  usageRecord.perCalculator[calculatorId] = (usageRecord.perCalculator[calculatorId] ?? 0) + 1
  nextState.usageByMonth[mapKey] = usageRecord
  saveState(nextState)

  const totalAllowed = key.monthlyQuota + usageRecord.purchasedCredits
  return {
    monthKey,
    totalUsed: usageRecord.totalUsed,
    calculatorUsed: usageRecord.perCalculator[calculatorId] ?? 0,
    monthlyQuota: key.monthlyQuota,
    purchasedCredits: usageRecord.purchasedCredits,
    totalAllowed,
    remaining: totalAllowed - usageRecord.totalUsed,
  }
}

export function addPurchasedCredits(
  apiKeyId: string,
  monthKey: string,
  credits: number
): UsageMonthRecord {
  const normalizedCredits = sanitizePositiveInteger(credits, 0, 1, 10_000_000)
  if (normalizedCredits <= 0) {
    throw new Error('Credits non validi')
  }

  const state = loadState()
  const nextState = cloneState(state)
  const mapKey = buildUsageMapKey(apiKeyId, monthKey)
  const usageRecord = nextState.usageByMonth[mapKey] ?? createUsageMonthRecord()
  usageRecord.purchasedCredits += normalizedCredits
  nextState.usageByMonth[mapKey] = usageRecord
  saveState(nextState)
  return usageRecord
}

export function isProcessedStripeSession(sessionId: string): boolean {
  const state = loadState()
  return sessionId in state.processedStripeSessions
}

export function markStripeSessionProcessed(sessionId: string): void {
  const state = loadState()
  if (sessionId in state.processedStripeSessions) {
    return
  }
  const nextState = cloneState(state)
  nextState.processedStripeSessions[sessionId] = nowIso()
  saveState(nextState)
}

export function listApiKeys(): ApiKeyRecord[] {
  const state = loadState()
  return Object.values(state.keys).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function updateApiKey(
  keyId: string,
  changes: Partial<Pick<ApiKeyRecord, 'name' | 'calculatorId' | 'monthlyQuota' | 'overagePackCredits' | 'overagePackPriceCents' | 'currency' | 'active'>>
): ApiKeyRecord {
  const state = loadState()
  const key = state.keys[keyId]
  if (!key) {
    throw new Error('API key non trovata')
  }

  const next: ApiKeyRecord = {
    ...key,
    ...changes,
    updatedAt: nowIso(),
  }

  if (changes.name !== undefined) {
    const trimmedName = changes.name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      throw new Error('Name deve avere tra 2 e 80 caratteri')
    }
    next.name = trimmedName
  }

  if (changes.calculatorId !== undefined) {
    assertValidCalculatorId(changes.calculatorId)
    next.calculatorId = changes.calculatorId
  }

  if (changes.monthlyQuota !== undefined) {
    next.monthlyQuota = sanitizePositiveInteger(changes.monthlyQuota, key.monthlyQuota, 1, 10_000_000)
  }
  if (changes.overagePackCredits !== undefined) {
    next.overagePackCredits = sanitizePositiveInteger(
      changes.overagePackCredits,
      key.overagePackCredits,
      1,
      10_000_000
    )
  }
  if (changes.overagePackPriceCents !== undefined) {
    next.overagePackPriceCents = sanitizePositiveInteger(
      changes.overagePackPriceCents,
      key.overagePackPriceCents,
      50,
      500_000
    )
  }
  if (changes.currency !== undefined) {
    next.currency = normalizeCurrency(changes.currency)
  }
  if (changes.active !== undefined) {
    next.active = Boolean(changes.active)
  }

  const nextState = cloneState(state)
  nextState.keys[keyId] = next
  saveState(nextState)
  return next
}

export function sanitizeApiKeyForList(key: ApiKeyRecord): Omit<ApiKeyRecord, 'keyHash'> {
  const { keyHash, ...safe } = key
  return safe
}
