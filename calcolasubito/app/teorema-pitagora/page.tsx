'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculatePythagoras } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function TeoremaPitagoraPage() {
  const [cathetusA, setCathetusA] = useState('3')
  const [cathetusB, setCathetusB] = useState('4')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculatePythagoras> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculatePythagoras({ cathetusA: Number(cathetusA), cathetusB: Number(cathetusB) })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Teorema di Pitagora" description="Calcola l'ipotenusa di un triangolo rettangolo dai due cateti.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="catA">Cateto A</label>
            <input id="catA" type="number" step="0.01" min="0.01" value={cathetusA} onChange={(e) => setCathetusA(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="catB">Cateto B</label>
            <input id="catB" type="number" step="0.01" min="0.01" value={cathetusB} onChange={(e) => setCathetusB(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola Ipotenusa
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Ipotenusa</p>
            <p className="text-2xl font-bold text-blue-700">{formatNumber(result.hypotenuse)}</p>
          </div>
          <p className="text-xs text-gray-500">
            Formula: c = √(a² + b²) con a = {formatNumber(result.cathetusA)} e b = {formatNumber(result.cathetusB)}.
          </p>
        </div>
      )}

      <AdUnit adSlot="teorema-pitagora" />
    </Calculator>
  )
}
