'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { generateRandomIntegers } from '@/lib/calculations'

export default function NumeriCasualiPage() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('90')
  const [count, setCount] = useState('5')
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof generateRandomIntegers> | null>(null)

  const runExtraction = () => {
    const output = generateRandomIntegers(
      Number(min),
      Number(max),
      Number(count),
      allowDuplicates
    )
    setResult(output)
  }

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      runExtraction()
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nella generazione numeri')
    }
  }

  const onRegenerate = () => {
    setError(null)

    try {
      runExtraction()
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nella generazione numeri')
    }
  }

  return (
    <Calculator
      title="Generatore Numeri Casuali"
      description="Estrai numeri casuali in un intervallo personalizzato, con o senza ripetizioni."
      keyword="numeri casuali"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimo</label>
            <input
              type="number"
              step="1"
              value={min}
              onChange={(event) => setMin(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Massimo</label>
            <input
              type="number"
              step="1"
              value={max}
              onChange={(event) => setMax(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantita numeri</label>
            <input
              type="number"
              step="1"
              min="1"
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(event) => setAllowDuplicates(event.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          Permetti numeri duplicati
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Genera numeri
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg border border-slate-300 transition-colors"
          >
            Rigenera
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Intervallo:</span> {result.min} - {result.max}
            </p>
            <p>
              <span className="font-semibold">Quantita:</span> {result.count}
            </p>
            <p>
              <span className="font-semibold">Duplicati:</span> {result.allowDuplicates ? 'Si' : 'No'}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {result.numbers.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="inline-flex items-center justify-center min-w-10 px-3 py-2 rounded-xl bg-white border border-cyan-200 text-cyan-700 font-semibold shadow-sm"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567916" />
    </Calculator>
  )
}
