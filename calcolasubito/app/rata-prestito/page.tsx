'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateLoanPayment } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function RataPrestitoPage() {
  const [principal, setPrincipal] = useState('15000')
  const [annualRate, setAnnualRate] = useState('7.2')
  const [years, setYears] = useState('5')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateLoanPayment> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateLoanPayment(Number(principal), Number(annualRate), Number(years) * 12)
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nel calcolo prestito')
    }
  }

  return (
    <Calculator
      title="Rata Prestito"
      description="Calcola rata mensile, interessi totali e importo complessivo del finanziamento."
      keyword="prestito"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Importo finanziato (EUR)</label>
          <input
            type="number"
            step="0.01"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durata (anni)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola rata prestito
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <p className="text-sm text-gray-600">Rata mensile</p>
          <p className="text-3xl font-bold text-cyan-700">{formatEuro(result.monthlyPayment)}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Interessi totali</p>
              <p className="text-xl font-semibold text-rose-700">{formatEuro(result.totalInterest)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Totale pagato</p>
              <p className="text-xl font-semibold text-gray-900">{formatEuro(result.totalAmountPaid)}</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567912" />
    </Calculator>
  )
}
