'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { convertTemperature, type TemperatureUnit } from '@/lib/calculations'

const TEMPERATURE_UNITS: Array<{ value: TemperatureUnit; label: string; shortLabel: string }> = [
  { value: 'c', label: 'Celsius', shortLabel: 'C' },
  { value: 'f', label: 'Fahrenheit', shortLabel: 'F' },
  { value: 'k', label: 'Kelvin', shortLabel: 'K' },
  { value: 'r', label: 'Rankine', shortLabel: 'R' },
]

export default function ConversioneTemperaturaPage() {
  const [inputValue, setInputValue] = useState('20')
  const [inputUnit, setInputUnit] = useState<TemperatureUnit>('c')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof convertTemperature> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = convertTemperature(Number(inputValue), inputUnit)
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di conversione')
    }
  }

  return (
    <Calculator
      title="Conversione Temperatura"
      description="Converti temperatura da qualsiasi scala (Celsius, Fahrenheit, Kelvin, Rankine)."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valore temperatura</label>
            <input
              type="number"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scala di partenza</label>
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value as TemperatureUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TEMPERATURE_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label} ({unit.shortLabel})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Converti
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Celsius</p>
              <p className="text-xl font-bold text-blue-700">{result.celsius.toFixed(2)} C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fahrenheit</p>
              <p className="text-xl font-bold text-blue-700">{result.fahrenheit.toFixed(2)} F</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kelvin</p>
              <p className="text-xl font-bold text-gray-900">{result.kelvin.toFixed(2)} K</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rankine</p>
              <p className="text-xl font-bold text-gray-900">{result.rankine.toFixed(2)} R</p>
            </div>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567910" />
    </Calculator>
  )
}

