'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateWeightedAverageAdvanced } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function MediaPonderataPage() {
  const [valuesInput, setValuesInput] = useState('7,8,6,9')
  const [weightsInput, setWeightsInput] = useState('2,3,1,4')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateWeightedAverageAdvanced> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const values = valuesInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
      const weights = weightsInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
      
      if (values.length === 0) throw new Error('Inserisci almeno un valore')
      if (weights.length === 0) throw new Error('Inserisci almeno un peso')
      if (values.length !== weights.length) throw new Error('Valori e pesi devono avere la stessa lunghezza')
      
      const output = calculateWeightedAverageAdvanced({ values, weights })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Media Ponderata" description="Calcola la media ponderata con pesi personalizzati.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valori (separati da virgola)</label>
          <input
            type="text"
            value={valuesInput}
            onChange={(e) => setValuesInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="7,8,6,9"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pesi (separati da virgola)</label>
          <input
            type="text"
            value={weightsInput}
            onChange={(e) => setWeightsInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2,3,1,4"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola media ponderata
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">Media Ponderata</p>
          <p className="text-3xl font-bold text-blue-700">{formatNumber(result.weightedAverage)}</p>
          <div className="mt-3 text-sm text-gray-600">
            <p>Peso totale: {formatNumber(result.totalWeight)}</p>
          </div>
        </div>
      )}

      <AdUnit adSlot="media-ponderata" />
    </Calculator>
  )
}