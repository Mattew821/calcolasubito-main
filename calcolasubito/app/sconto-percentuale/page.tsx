'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateDiscount } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ScontoPercentualePage() {
  const [price, setPrice] = useState('100')
  const [discount, setDiscount] = useState('20')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ discountAmount: number; finalPrice: number } | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const parsedPrice = Number(price)
      const parsedDiscount = Number(discount)
      const output = calculateDiscount(parsedPrice, parsedDiscount)
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Sconto Percentuale"
      description="Calcola subito prezzo scontato e risparmio totale."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo iniziale (EUR)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sconto (%)</label>
          <input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
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
          <p className="text-sm text-gray-600">Risparmio:</p>
          <p className="text-xl font-bold text-blue-700">{formatEuro(result.discountAmount)}</p>
          <p className="text-sm text-gray-600 mt-3">Prezzo finale:</p>
          <p className="text-2xl font-bold text-gray-900">{formatEuro(result.finalPrice)}</p>
        </div>
      )}

      <AdUnit adSlot="1234567901" />
    </Calculator>
  )
}

