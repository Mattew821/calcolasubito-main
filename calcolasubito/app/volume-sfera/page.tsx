'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateSphereVolume } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function VolumeSferaPage() {
  const [radius, setRadius] = useState('5')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateSphereVolume> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateSphereVolume({ radius: Number(radius) })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Volume Sfera" description="Calcola volume e area superficiale di una sfera.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Raggio (m)</label>
          <input type="number" step="0.01" value={radius} onChange={(e) => setRadius(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola volume
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Volume</p>
            <p className="text-2xl font-bold text-blue-700">{formatNumber(result.volume)} m³</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Area Superficiale</p>
              <p className="text-lg font-semibold text-gray-800">{formatNumber(result.surfaceArea)} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Diametro</p>
              <p className="text-lg font-semibold text-gray-800">{formatNumber(result.diameter)} m</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="volume-sfera" />
    </Calculator>
  )
}