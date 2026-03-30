'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateImu } from '@/lib/calculations'
import { imuSchema } from '@/lib/validations'

const CATASTAL_MULTIPLIERS = [
  { value: '160', label: 'Abitazioni (A escl. A/10) e C/2, C/6, C/7 - 160' },
  { value: '140', label: 'B, C/3, C/4, C/5 - 140' },
  { value: '80', label: 'A/10 e D/5 - 80' },
  { value: '65', label: 'D (escluso D/5) - 65' },
  { value: '55', label: 'C/1 - 55' },
  { value: 'custom', label: 'Valore personalizzato' },
] as const

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function CalcoloImuPage() {
  const [cadastralIncome, setCadastralIncome] = useState('1000')
  const [multiplierType, setMultiplierType] = useState<(typeof CATASTAL_MULTIPLIERS)[number]['value']>('160')
  const [customMultiplier, setCustomMultiplier] = useState('160')
  const [ratePerMille, setRatePerMille] = useState('10.6')
  const [ownershipPercent, setOwnershipPercent] = useState('100')
  const [ownedMonths, setOwnedMonths] = useState('12')
  const [annualDeduction, setAnnualDeduction] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateImu> | null>(null)

  const resolvedMultiplier = useMemo(() => {
    if (multiplierType === 'custom') {
      return Number(customMultiplier)
    }
    return Number(multiplierType)
  }, [customMultiplier, multiplierType])

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const parsedInput = imuSchema.safeParse({
      cadastralIncome: Number(cadastralIncome),
      multiplier: resolvedMultiplier,
      ratePerMille: Number(ratePerMille),
      ownershipPercent: Number(ownershipPercent),
      ownedMonths: Number(ownedMonths),
      annualDeduction: Number(annualDeduction),
    })

    if (!parsedInput.success) {
      const firstIssue = parsedInput.error.issues[0]
      setResult(null)
      setError(firstIssue?.message ?? 'Errore di validazione nei dati IMU')
      return
    }

    try {
      const output = calculateImu(parsedInput.data)
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nel calcolo IMU')
    }
  }

  return (
    <Calculator
      title="Calcolo IMU"
      description="Stima IMU annua, acconto e saldo con rendita catastale, aliquota e quote di possesso."
      keyword="imu"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cadastralIncome" className="block text-sm font-medium text-gray-700 mb-2">
              Rendita catastale (EUR)
            </label>
            <input
              id="cadastralIncome"
              name="cadastralIncome"
              type="number"
              step="0.01"
              min="0"
              value={cadastralIncome}
              onChange={(event) => setCadastralIncome(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="ratePerMille" className="block text-sm font-medium text-gray-700 mb-2">
              Aliquota IMU (per mille)
            </label>
            <input
              id="ratePerMille"
              name="ratePerMille"
              type="number"
              step="0.01"
              min="0"
              value={ratePerMille}
              onChange={(event) => setRatePerMille(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="multiplierType" className="block text-sm font-medium text-gray-700 mb-2">
              Coefficiente catastale
            </label>
            <select
              id="multiplierType"
              name="multiplierType"
              value={multiplierType}
              onChange={(event) => setMultiplierType(event.target.value as (typeof CATASTAL_MULTIPLIERS)[number]['value'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {CATASTAL_MULTIPLIERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {multiplierType === 'custom' && (
            <div>
              <label htmlFor="customMultiplier" className="block text-sm font-medium text-gray-700 mb-2">
                Coefficiente personalizzato
              </label>
              <input
                id="customMultiplier"
                name="customMultiplier"
                type="number"
                step="1"
                min="1"
                value={customMultiplier}
                onChange={(event) => setCustomMultiplier(event.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ownershipPercent" className="block text-sm font-medium text-gray-700 mb-2">
              Quota possesso (%)
            </label>
            <input
              id="ownershipPercent"
              name="ownershipPercent"
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              value={ownershipPercent}
              onChange={(event) => setOwnershipPercent(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="ownedMonths" className="block text-sm font-medium text-gray-700 mb-2">
              Mesi di possesso
            </label>
            <input
              id="ownedMonths"
              name="ownedMonths"
              type="number"
              step="1"
              min="1"
              max="12"
              value={ownedMonths}
              onChange={(event) => setOwnedMonths(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="annualDeduction" className="block text-sm font-medium text-gray-700 mb-2">
              Detrazione annua (EUR)
            </label>
            <input
              id="annualDeduction"
              name="annualDeduction"
              type="number"
              step="0.01"
              min="0"
              value={annualDeduction}
              onChange={(event) => setAnnualDeduction(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola IMU
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5 space-y-4" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Base imponibile</p>
              <p className="text-2xl font-bold text-cyan-700">{formatEuro(result.taxableBase)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IMU annua netta</p>
              <p className="text-2xl font-bold text-cyan-700">{formatEuro(result.netAnnualTax)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">IMU lorda annua:</span> {formatEuro(result.grossAnnualTax)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">IMU sulla tua quota:</span> {formatEuro(result.ownershipTax)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Detrazione proporzionata:</span> {formatEuro(result.proportionalDeduction)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Aliquota effettiva:</span> {result.effectiveRatePerMille.toLocaleString('it-IT')}‰
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-white border border-cyan-200 p-4">
              <p className="text-sm text-gray-600">Acconto (giugno)</p>
              <p className="text-xl font-semibold text-cyan-700">{formatEuro(result.installmentJune)}</p>
            </div>
            <div className="rounded-lg bg-white border border-cyan-200 p-4">
              <p className="text-sm text-gray-600">Saldo (dicembre)</p>
              <p className="text-xl font-semibold text-cyan-700">{formatEuro(result.installmentDecember)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Calcolo indicativo: verifica sempre aliquote, esenzioni e detrazioni deliberate dal tuo Comune.
      </div>

      <AdUnit adSlot="1234567917" />
    </Calculator>
  )
}
