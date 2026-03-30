'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateSimpleInterest } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function InteresseSemplicePage() {
  const [principal, setPrincipal] = useState('10000')
  const [annualRate, setAnnualRate] = useState('4')
  const [years, setYears] = useState('3')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ interest: number; totalAmount: number } | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateSimpleInterest(Number(principal), Number(annualRate), Number(years))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Interesse Semplice"
      description="Calcola interessi e montante finale con formula lineare."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capitale iniziale (EUR)</label>
          <input
            type="number"
            step="0.01"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasso annuo (%)</label>
            <input
              type="number"
              step="0.01"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durata (anni)</label>
            <input
              type="number"
              step="0.1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
          <p className="text-sm text-gray-600">Interessi maturati:</p>
          <p className="text-xl font-bold text-blue-700">{formatEuro(result.interest)}</p>
          <p className="text-sm text-gray-600 mt-3">Montante finale:</p>
          <p className="text-2xl font-bold text-gray-900">{formatEuro(result.totalAmount)}</p>
        </div>
      )}

      <AdUnit adSlot="1234567903" />
    </Calculator>
  )
}

