'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateRuleOfThree } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function RegolaDelTrePage() {
  const [a, setA] = useState('2')
  const [b, setB] = useState('3')
  const [c, setC] = useState('4')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateRuleOfThree> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateRuleOfThree({ a: Number(a), b: Number(b), c: Number(c) })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Regola del Tre" description="Risolvi una proporzione del tipo a : b = c : x.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="r3a">a</label>
            <input id="r3a" type="number" step="0.01" value={a} onChange={(e) => setA(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="r3b">b</label>
            <input id="r3b" type="number" step="0.01" value={b} onChange={(e) => setB(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="r3c">c</label>
            <input id="r3c" type="number" step="0.01" value={c} onChange={(e) => setC(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <p className="text-sm text-gray-600">Proporzione: a : b = c : x</p>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola x
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Valore di x</p>
            <p className="text-2xl font-bold text-blue-700">{formatNumber(result.x)}</p>
          </div>
          <p className="text-xs text-gray-500">
            Formula: x = b × c / a = {formatNumber(result.b)} × {formatNumber(result.c)} / {formatNumber(result.a)}.
          </p>
        </div>
      )}

      <AdUnit adSlot="regola-del-tre" />
    </Calculator>
  )
}
