'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateRivalutazioneMonetaria } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export default function RivalutazioneMonetariaPage() {
  const [initialAmount, setInitialAmount] = useState('1000')
  const [startDate, setStartDate] = useState('2020-01-01')
  const [endDate, setEndDate] = useState('2024-01-01')
  const [inflationRate, setInflationRate] = useState('2')
  const [isMonthlyInflation, setIsMonthlyInflation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateRivalutazioneMonetaria> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateRivalutazioneMonetaria({
        initialAmount: Number(initialAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        inflationRate: Number(inflationRate),
        isMonthlyInflation
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Rivalutazione Monetaria" description="Rivaluta un importo in base all'inflazione nel tempo.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Importo iniziale (EUR)</label>
            <input type="number" step="10" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data inizio</label>
            <input type="date" value={startDate} max={toISODate(new Date())} onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data fine</label>
            <input type="date" value={endDate} max={toISODate(new Date())} onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasso inflazione (%)</label>
            <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="monthly" checked={isMonthlyInflation} onChange={(e) => setIsMonthlyInflation(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="monthly" className="text-sm text-gray-700">Tasso mensile (composto)</label>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola rivalutazione
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Importo rivalutato</p>
            <p className="text-2xl font-bold text-blue-700">{formatEuro(result.finalAmount)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Rivalutazione</p>
              <p className="font-semibold">{formatEuro(result.adjustment)}</p>
            </div>
            <div>
              <p className="text-gray-600">Variazione percentuale</p>
              <p className="font-semibold">{result.percentAdjustment.toLocaleString('it-IT')}%</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Periodo: {result.months} mesi (~{result.years} anni)</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="rivalutazione-monetaria" />
    </Calculator>
  )
}