'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateBMI } from '@/lib/calculations'

function classifyBmi(value: number): string {
  if (value < 18.5) return 'Sottopeso'
  if (value < 25) return 'Normopeso'
  if (value < 30) return 'Sovrappeso'
  return 'Obesita'
}

export default function IndiceMassaCorporeaPage() {
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)

  const category = useMemo(() => (result === null ? null : classifyBmi(result)), [result])

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const value = calculateBMI(Number(weight), Number(height))
      setResult(value)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Indice Massa Corporea (BMI)"
      description="Calcola il BMI da peso e altezza e ottieni una classificazione indicativa."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altezza (cm)</label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola BMI
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">BMI:</p>
          <p className="text-2xl font-bold text-gray-900">{result.toFixed(2)}</p>
          <p className="text-sm text-gray-700 mt-2">Classificazione: <strong>{category}</strong></p>
        </div>
      )}

      <AdUnit adSlot="1234567905" />
    </Calculator>
  )
}

