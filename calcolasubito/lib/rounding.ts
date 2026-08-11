/**
 * Centralized rounding policy for CalcolaSubito.
 *
 * POLICY (documented in STATUS.md):
 * - Monetary amounts (EUR): 2 decimal places (cents) — `roundMoney`
 * - Percentages: 2 decimal places — `roundPercent`
 * - Rates (TAN/TAEG/IRR): 2 decimal places (percentage points) — `roundRate`
 * - Generic display values: 2 decimal places — `round2`
 * - Derived ratios/indices (replacement rate, BMI): 1 decimal place — `round1`
 *
 * IMPORTANT: Rounding ≠ truncation. Never use Math.trunc() for display or
 * financial results. Use these utilities so the policy is auditable in one place.
 */

/** Round to 2 decimal places (standard display / generic). */
export function round2(value: number): number {
  if (!Number.isFinite(value)) return value
  return Math.round((value + Number.EPSILON) * 100) / 100
}

/** Round to 1 decimal place (ratios, indices). */
export function round1(value: number): number {
  if (!Number.isFinite(value)) return value
  return Math.round((value + Number.EPSILON) * 10) / 10
}

/** Round to N decimal places. */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value
  const factor = Math.pow(10, decimals)
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * Round monetary amounts to cents.
 * Uses EPSILON to avoid float representation artifacts
 * (e.g. 1.005 → 1.01, not 1.00).
 */
export function roundMoney(value: number): number {
  return round2(value)
}

/** Round percentages to 2 decimal places. */
export function roundPercent(value: number): number {
  return round2(value)
}

/** Round interest rates (TAN/TAEG/APR) to 2 decimal places. */
export function roundRate(value: number): number {
  return round2(value)
}

/**
 * Float-safe money rounding using string-based approach for edge cases
 * where binary float artifacts matter (e.g. 1.005 * 100 = 100.49999...).
 * Use this in critical financial paths.
 */
export function roundMoneyStrict(value: number): number {
  if (!Number.isFinite(value)) return value
  // Handle negatives correctly
  const sign = value < 0 ? -1 : 1
  const abs = Math.abs(value)
  // Shift to cents with rounding via toFixed (string-based, float-safe)
  const cents = Number((abs * 100).toFixed(2))
  const rounded = Math.round(cents) / 100
  return sign * rounded
}
