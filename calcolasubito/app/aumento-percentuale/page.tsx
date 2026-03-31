'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateIncrease } from '@/lib/calculations'
import { getActiveIntlLocale } from '@/lib/locale'

export default function AumentoPercentualePage() {
  const [baseValue, setBaseValue] = useState('100')
  const [increase, setIncrease] = useState('10')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ increaseAmount: number; finalValue: number } | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateIncrease(Number(baseValue), Number(increase))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Aumento Percentuale"
      description="Trova rapidamente aumento assoluto e nuovo valore finale."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valore iniziale</label>
          <input
            type="number"
            step="0.01"
            value={baseValue}
            onChange={(e) => setBaseValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aumento (%)</label>
          <input
            type="number"
            step="0.01"
            value={increase}
            onChange={(e) => setIncrease(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">Aumento assoluto:</p>
          <p className="text-xl font-bold text-blue-700">
            {result.increaseAmount.toLocaleString(getActiveIntlLocale(), { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-3">Nuovo valore:</p>
          <p className="text-2xl font-bold text-gray-900">
            {result.finalValue.toLocaleString(getActiveIntlLocale(), { maximumFractionDigits: 2 })}
          </p>
        </div>
      )}

      <AdUnit adSlot="1234567902" />
    </Calculator>
  )
}

