'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateConeVolume } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function VolumeConoPage() {
  const [radius, setRadius] = useState('3')
  const [height, setHeight] = useState('4')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateConeVolume> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateConeVolume({ radius: Number(radius), height: Number(height) })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Volume Cono" description="Calcola il volume di un cono circolare retto da raggio e altezza.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="coneR">Raggio (m)</label>
            <input id="coneR" type="number" step="0.01" min="0.01" value={radius} onChange={(e) => setRadius(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="coneH">Altezza (m)</label>
            <input id="coneH" type="number" step="0.01" min="0.01" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola Volume
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Volume del cono</p>
            <p className="text-2xl font-bold text-blue-700">{formatNumber(result.volume)} m³</p>
          </div>
          <p className="text-xs text-gray-500">
            Formula: V = π × r² × h / 3 = π × {formatNumber(result.radius)}² × {formatNumber(result.height)} / 3.
          </p>
        </div>
      )}

      <AdUnit adSlot="volume-cono" />
    </Calculator>
  )
}
