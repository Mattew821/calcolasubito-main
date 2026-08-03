'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateParallelepipedVolume } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function VolumeParallelepipedoPage() {
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('5')
  const [height, setHeight] = useState('3')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateParallelepipedVolume> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateParallelepipedVolume({
        length: Number(length),
        width: Number(width),
        height: Number(height)
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Volume Parallelepipedo" description="Calcola volume e area superficiale di un parallelepipedo rettangolo.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lunghezza (m)</label>
            <input type="number" step="0.01" value={length} onChange={(e) => setLength(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Larghezza (m)</label>
            <input type="number" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altezza (m)</label>
            <input type="number" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
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
          <div>
            <p className="text-sm text-gray-600">Area Superficiale</p>
            <p className="text-xl font-semibold text-gray-800">{formatNumber(result.surfaceArea)} m²</p>
          </div>
        </div>
      )}

      <AdUnit adSlot="volume-parallelepipedo" />
    </Calculator>
  )
}