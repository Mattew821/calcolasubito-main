'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateTip } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function CalcoloManciaPage() {
  const [billAmount, setBillAmount] = useState('80')
  const [tipPercent, setTipPercent] = useState('10')
  const [people, setPeople] = useState('2')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateTip> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateTip(Number(billAmount), Number(tipPercent), Number(people))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nel calcolo mancia')
    }
  }

  return (
    <Calculator
      title="Calcolo Mancia"
      description="Calcola mancia consigliata, totale conto e quota per persona in pochi secondi."
      keyword="mancia"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Totale conto (EUR)</label>
          <input
            type="number"
            step="0.01"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mancia (%)</label>
            <input
              type="number"
              step="0.01"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numero persone</label>
            <input
              type="number"
              step="1"
              min="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola mancia
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mancia</p>
              <p className="text-2xl font-bold text-cyan-700">{formatEuro(result.tipAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Totale conto</p>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(result.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quota per persona</p>
              <p className="text-2xl font-bold text-emerald-700">{formatEuro(result.perPerson)}</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567913" />
    </Calculator>
  )
}
