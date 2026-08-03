'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateTanTaeg } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function formatPercent(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
}

export default function TanTaegPage() {
  const [principal, setPrincipal] = useState('10000')
  const [monthlyPayment, setMonthlyPayment] = useState('310')
  const [months, setMonths] = useState('36')
  const [upfrontCosts, setUpfrontCosts] = useState('100')
  const [monthlyCosts, setMonthlyCosts] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateTanTaeg> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateTanTaeg({
        principal: Number(principal),
        monthlyPayment: Number(monthlyPayment),
        months: Number(months),
        upfrontCosts: Number(upfrontCosts),
        monthlyCosts: Number(monthlyCosts)
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Calcolo TAN e TAEG" description="Calcola il Tasso Annuo Nominale e il Tasso Annuo Effettivo Globale di un finanziamento.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capitale (EUR)</label>
            <input type="number" step="100" value={principal} onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rata mensile (EUR)</label>
            <input type="number" step="1" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mesi</label>
            <input type="number" step="1" value={months} onChange={(e) => setMonths(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Costi iniziali (EUR)</label>
            <input type="number" step="1" value={upfrontCosts} onChange={(e) => setUpfrontCosts(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Costi mensili (EUR)</label>
            <input type="number" step="1" value={monthlyCosts} onChange={(e) => setMonthlyCosts(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola TAN e TAEG
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4" role="status" aria-live="polite">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">TAN (Tasso Annuo Nominale)</p>
              <p className="text-2xl font-bold text-blue-700">{formatPercent(result.tan)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">TAEG (Tasso Effettivo Globale)</p>
              <p className="text-2xl font-bold text-emerald-700">{formatPercent(result.taeg)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Interessi totali</p>
              <p className="font-semibold">{formatEuro(result.totalInterest)}</p>
            </div>
            <div>
              <p className="text-gray-600">Costo totale</p>
              <p className="font-semibold">{formatEuro(result.totalCost)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Nota: calcolo indicativo. Il TAEG reale dipende dalle condizioni contrattuali e dalla normativa di trasparenza bancaria.
          </p>
        </div>
      )}

      <AdUnit adSlot="tan-taeg" />
    </Calculator>
  )
}