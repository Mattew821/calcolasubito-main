'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateFuelConsumption } from '@/lib/calculations'

export default function ConsumoCarburantePage() {
  const [distance, setDistance] = useState('500')
  const [fuel, setFuel] = useState('30')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ kmPerLiter: number; litersPer100Km: number } | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateFuelConsumption(Number(distance), Number(fuel))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Consumo Carburante"
      description="Ottieni consumi in km/l e litri per 100 km."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distanza percorsa (km)</label>
          <input
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Carburante consumato (litri)</label>
          <input
            type="number"
            step="0.1"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
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
          <p className="text-sm text-gray-600">Efficienza:</p>
          <p className="text-xl font-bold text-blue-700">{result.kmPerLiter.toFixed(2)} km/l</p>
          <p className="text-sm text-gray-600 mt-3">Consumo standard:</p>
          <p className="text-2xl font-bold text-gray-900">{result.litersPer100Km.toFixed(2)} l/100km</p>
        </div>
      )}

      <AdUnit adSlot="1234567906" />
    </Calculator>
  )
}

