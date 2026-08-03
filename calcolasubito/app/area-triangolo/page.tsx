'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateTriangleArea } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function AreaTriangoloPage() {
  const [base, setBase] = useState('10')
  const [height, setHeight] = useState('5')
  const [sideA, setSideA] = useState('')
  const [sideB, setSideB] = useState('')
  const [sideC, setSideC] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateTriangleArea> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateTriangleArea({
        base: Number(base),
        height: Number(height),
        sideA: sideA ? Number(sideA) : undefined,
        sideB: sideB ? Number(sideB) : undefined,
        sideC: sideC ? Number(sideC) : undefined
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Area Triangolo" description="Calcola area e perimetro di un triangolo.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base (m)</label>
            <input type="number" step="0.01" value={base} onChange={(e) => setBase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altezza (m)</label>
            <input type="number" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lato A (opzionale, m)</label>
            <input type="number" step="0.01" value={sideA} onChange={(e) => setSideA(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lato B (opzionale, m)</label>
            <input type="number" step="0.01" value={sideB} onChange={(e) => setSideB(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lato C (opzionale, m)</label>
            <input type="number" step="0.01" value={sideC} onChange={(e) => setSideC(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola area triangolo
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          {!result.isValid && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              Attenzione: i lati inseriti non soddisfano la disuguaglianza triangolare. Perimetro non calcolabile.
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Area</p>
              <p className="text-2xl font-bold text-blue-700">{formatNumber(result.area)} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Perimetro</p>
              <p className="text-2xl font-bold text-gray-800">{formatNumber(result.perimeter)} m</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="area-triangolo" />
    </Calculator>
  )
}