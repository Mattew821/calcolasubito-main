'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateTipDetailed, type TipRoundingMode } from '@/lib/calculations'

const ROUNDING_OPTIONS: Array<{ value: TipRoundingMode; label: string }> = [
  { value: 'none', label: 'Nessun arrotondamento' },
  { value: 'nearest_0_05', label: 'Arrotonda al 0,05 piu vicino' },
  { value: 'up_0_05', label: 'Arrotonda sempre in alto a 0,05' },
  { value: 'up_0_10', label: 'Arrotonda sempre in alto a 0,10' },
  { value: 'up_1', label: 'Arrotonda sempre in alto all euro' },
]

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
  const [servicePercent, setServicePercent] = useState('0')
  const [people, setPeople] = useState('2')
  const [rounding, setRounding] = useState<TipRoundingMode>('none')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateTipDetailed> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateTipDetailed({
        billAmount: Number(billAmount),
        tipPercent: Number(tipPercent),
        servicePercent: Number(servicePercent),
        people: Number(people),
        rounding,
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nel calcolo mancia')
    }
  }

  return (
    <Calculator
      title="Calcolo Mancia"
      description="Calcola mancia, servizio, totale conto e quota per persona con arrotondamenti avanzati."
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Servizio (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={servicePercent}
              onChange={(e) => setServicePercent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arrotondamento quota</label>
            <select
              value={rounding}
              onChange={(e) => setRounding(e.target.value as TipRoundingMode)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {ROUNDING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              <p className="text-sm text-gray-600">Servizio</p>
              <p className="text-2xl font-bold text-slate-900">{formatEuro(result.serviceAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mancia</p>
              <p className="text-2xl font-bold text-cyan-700">{formatEuro(result.tipAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Totale conto</p>
              <p className="text-2xl font-bold text-gray-900">{formatEuro(result.totalAmount)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Quota per persona (base)</p>
              <p className="text-2xl font-bold text-emerald-700">{formatEuro(result.perPersonRaw)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quota per persona (arrotondata)</p>
              <p className="text-2xl font-bold text-emerald-700">{formatEuro(result.perPersonRounded)}</p>
              {result.roundingMode !== 'none' && (
                <p className="text-xs text-gray-600 mt-1">
                  Delta totale da arrotondamento: {formatEuro(result.roundingDelta)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567913" />
    </Calculator>
  )
}
