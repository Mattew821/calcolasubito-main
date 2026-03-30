'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateWeightedAverage } from '@/lib/calculations'

function parseList(input: string): number[] {
  return input
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .map((v) => Number(v))
}

export default function MediaVotiPage() {
  const [grades, setGrades] = useState('24,30,28')
  const [weights, setWeights] = useState('6,9,3')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<number | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const values = parseList(grades)
      const credits = parseList(weights)
      const average = calculateWeightedAverage(values, credits)
      setResult(average)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Media Voti Ponderata"
      description="Calcola la media pesata inserendo voti e crediti in formato CSV."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Voti (separati da virgola)</label>
          <input
            type="text"
            value={grades}
            onChange={(e) => setGrades(e.target.value)}
            placeholder="Es. 24,30,28"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crediti/Pesi (separati da virgola)</label>
          <input
            type="text"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
            placeholder="Es. 6,9,3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola media
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">Media ponderata:</p>
          <p className="text-2xl font-bold text-gray-900">{result.toFixed(2)}</p>
        </div>
      )}

      <AdUnit adSlot="1234567909" />
    </Calculator>
  )
}

