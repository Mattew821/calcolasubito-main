'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateTrapezoidArea } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function AreaTrapezioPage() {
  const [majorBase, setMajorBase] = useState('10')
  const [minorBase, setMinorBase] = useState('6')
  const [height, setHeight] = useState('4')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateTrapezoidArea> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateTrapezoidArea({ majorBase: Number(majorBase), minorBase: Number(minorBase), height: Number(height) })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Area Trapezio" description="Calcola l'area di un trapezio da basi e altezza.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="trMajor">Base maggiore (m)</label>
            <input id="trMajor" type="number" step="0.01" min="0.01" value={majorBase} onChange={(e) => setMajorBase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="trMinor">Base minore (m)</label>
            <input id="trMinor" type="number" step="0.01" min="0.01" value={minorBase} onChange={(e) => setMinorBase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="trHeight">Altezza (m)</label>
            <input id="trHeight" type="number" step="0.01" min="0.01" value={height} onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola Area
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Area del trapezio</p>
            <p className="text-2xl font-bold text-blue-700">{formatNumber(result.area)} m²</p>
          </div>
          <p className="text-xs text-gray-500">
            Formula: A = (B + b) × h / 2 = ({formatNumber(result.majorBase)} + {formatNumber(result.minorBase)}) × {formatNumber(result.height)} / 2.
          </p>
        </div>
      )}

      <AdUnit adSlot="area-trapezio" />
    </Calculator>
  )
}
