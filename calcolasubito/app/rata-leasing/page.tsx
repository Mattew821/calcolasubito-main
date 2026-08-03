'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateLeasingPayment } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

export default function RataLeasingPage() {
  const [assetValue, setAssetValue] = useState('25000')
  const [downPayment, setDownPayment] = useState('2500')
  const [residualValue, setResidualValue] = useState('5000')
  const [annualRate, setAnnualRate] = useState('6.5')
  const [months, setMonths] = useState('48')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateLeasingPayment> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateLeasingPayment({
        assetValue: Number(assetValue),
        downPayment: Number(downPayment),
        residualValue: Number(residualValue),
        annualRate: Number(annualRate),
        months: Number(months)
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Rata Leasing" description="Calcola rata leasing con anticipo e valore residuo.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valore bene (EUR)</label>
            <input type="number" step="100" value={assetValue} onChange={(e) => setAssetValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anticipo (EUR)</label>
            <input type="number" step="100" value={downPayment} onChange={(e) => setDownPayment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valore residuo (EUR)</label>
            <input type="number" step="100" value={residualValue} onChange={(e) => setResidualValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasso annuo (%)</label>
            <input type="number" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mesi</label>
            <input type="number" step="1" value={months} onChange={(e) => setMonths(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola rata leasing
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Rata Mensile</p>
            <p className="text-2xl font-bold text-blue-700">{formatEuro(result.monthlyPayment)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Importo finanziato</p>
              <p className="font-semibold">{formatEuro(result.financedAmount)}</p>
            </div>
            <div>
              <p className="text-gray-600">Interessi totali</p>
              <p className="font-semibold">{formatEuro(result.totalInterest)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Totale pagato</p>
              <p className="font-semibold">{formatEuro(result.totalAmountPaid)}</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="rata-leasing" />
    </Calculator>
  )
}