'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import {
  calculateDaysBetween,
  calculateWeeksBetween,
  calculateMonthsBetween,
} from '@/lib/calculations'

interface DateDifference {
  days: number
  weeks: number
  months: number
}

export default function CalcoloGiorniTraDate() {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)
  const [result, setResult] = useState<DateDifference | null>(null)

  const handleCalculate = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      alert('La data inizio deve essere anteriore alla data fine')
      return
    }

    const days = calculateDaysBetween(start, end)
    const weeks = calculateWeeksBetween(start, end)
    const months = calculateMonthsBetween(start, end)

    setResult({ days, weeks, months })
  }

  const reset = () => {
    setStartDate(today)
    setEndDate(today)
    setResult(null)
  }

  return (
    <Calculator
      title="Giorni tra Due Date"
      description="Calcola i giorni, le settimane e i mesi tra due date"
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inizio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fine
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Calcola
          </button>
          <button
            onClick={reset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
          >
            Resetta
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">
                    {result.days}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Giorni</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-indigo-600">
                    {result.weeks}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Settimane</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">
                    {result.months}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Mesi</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                Tra il{' '}
                <span className="font-semibold">
                  {new Date(startDate).toLocaleDateString('it-IT')}
                </span>{' '}
                e il{' '}
                <span className="font-semibold">
                  {new Date(endDate).toLocaleDateString('it-IT')}
                </span>{' '}
                passano <span className="font-semibold">{result.days}</span>{' '}
                giorni.
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Utilizzi comuni:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Calcolare giorni di vacanza o assenza</li>
            <li>• Determinare l'età in giorni, settimane o mesi</li>
            <li>• Contare i giorni tra due eventi</li>
            <li>• Verificare i termini di scadenza</li>
          </ul>
        </div>
      </div>
    </Calculator>
  )
}
