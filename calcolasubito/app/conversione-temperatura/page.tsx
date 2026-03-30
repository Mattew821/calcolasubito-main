'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { convertCelsius } from '@/lib/calculations'

export default function ConversioneTemperaturaPage() {
  const [celsius, setCelsius] = useState('20')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ celsius: number; fahrenheit: number; kelvin: number } | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = convertCelsius(Number(celsius))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di conversione')
    }
  }

  return (
    <Calculator
      title="Conversione Temperatura"
      description="Converti rapidamente da gradi Celsius a Fahrenheit e Kelvin."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura in Celsius (C)</label>
          <input
            type="number"
            step="0.01"
            value={celsius}
            onChange={(e) => setCelsius(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Converti
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">Fahrenheit:</p>
          <p className="text-xl font-bold text-blue-700">{result.fahrenheit.toFixed(2)} F</p>
          <p className="text-sm text-gray-600 mt-3">Kelvin:</p>
          <p className="text-2xl font-bold text-gray-900">{result.kelvin.toFixed(2)} K</p>
        </div>
      )}

      <AdUnit adSlot="1234567910" />
    </Calculator>
  )
}

