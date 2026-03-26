'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import { calculatePercentage, calculatePercentageOf } from '@/lib/calculations'

export default function CalcoloPercentuali() {
  const [mode, setMode] = useState<'calculate' | 'percentage-of'>('calculate')
  const [number, setNumber] = useState<number>(100)
  const [percentage, setPercentage] = useState<number>(20)
  const [result, setResult] = useState<number | null>(null)

  const handleCalculate = () => {
    if (mode === 'calculate') {
      const res = calculatePercentage(number, percentage)
      setResult(res)
    } else {
      const res = calculatePercentageOf(number, percentage)
      setResult(res)
    }
  }

  const reset = () => {
    setNumber(100)
    setPercentage(20)
    setResult(null)
  }

  return (
    <Calculator
      title="Calcolo Percentuali"
      description="Calcola facilmente percentuali, sconti e proporzioni"
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="calculate"
              checked={mode === 'calculate'}
              onChange={(e) => setMode(e.target.value as 'calculate')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Qual è il {percentage}% di {number}?
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="percentage-of"
              checked={mode === 'percentage-of'}
              onChange={(e) => setMode(e.target.value as 'percentage-of')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              {number} è quale percentuale di {percentage}?
            </span>
          </label>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'calculate' ? 'Numero' : 'Numero'}
            </label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci numero"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'calculate' ? 'Percentuale (%)' : 'Numero base'}
            </label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci percentuale"
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
        {result !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Risultato:</p>
            <p className="text-4xl font-bold text-blue-600">
              {result.toLocaleString('it-IT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {mode === 'calculate' && (
              <p className="text-sm text-gray-600 mt-2">
                Il {percentage}% di {number} è{' '}
                <span className="font-semibold">{result.toFixed(2)}</span>
              </p>
            )}
            {mode === 'percentage-of' && (
              <p className="text-sm text-gray-600 mt-2">
                {number} è il{' '}
                <span className="font-semibold">{result.toFixed(2)}%</span> di{' '}
                {percentage}
              </p>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Esempi:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Qual è il 20% di 100? Risposta: 20</li>
            <li>• Qual è il 15% di 200? Risposta: 30</li>
            <li>• 50 è quale percentuale di 200? Risposta: 25%</li>
          </ul>
        </div>
      </div>
    </Calculator>
  )
}
