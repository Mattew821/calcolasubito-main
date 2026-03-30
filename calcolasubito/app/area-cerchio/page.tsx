'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateCircleArea } from '@/lib/calculations'

export default function AreaCerchioPage() {
  const [radius, setRadius] = useState('5')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const area = calculateCircleArea(Number(radius))
      setResult(area)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Area Cerchio"
      description="Calcola l'area del cerchio partendo dal raggio."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Raggio</label>
          <input
            type="number"
            step="0.01"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola area
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">Area:</p>
          <p className="text-2xl font-bold text-gray-900">
            {result.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
          </p>
        </div>
      )}

      <AdUnit adSlot="1234567908" />
    </Calculator>
  )
}

