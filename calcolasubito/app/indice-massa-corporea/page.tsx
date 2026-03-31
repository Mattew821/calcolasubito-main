'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { getActiveIntlLocale } from '@/lib/locale'
import {
  calculateBmiDetailed,
  type HeightUnit,
  type WeightUnit,
} from '@/lib/calculations'

const WEIGHT_UNITS: Array<{ value: WeightUnit; label: string }> = [
  { value: 'kg', label: 'Chilogrammi (kg)' },
  { value: 'lb', label: 'Libbre (lb)' },
  { value: 'st', label: 'Stone (st)' },
]

const HEIGHT_UNITS: Array<{ value: HeightUnit; label: string }> = [
  { value: 'cm', label: 'Centimetri (cm)' },
  { value: 'm', label: 'Metri (m)' },
  { value: 'ft', label: 'Piedi (ft)' },
  { value: 'in', label: 'Pollici (in)' },
]

function formatNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString(getActiveIntlLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

export default function IndiceMassaCorporeaPage() {
  const [weight, setWeight] = useState('70')
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg')
  const [height, setHeight] = useState('175')
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateBmiDetailed> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const value = calculateBmiDetailed({
        weight: Number(weight),
        weightUnit,
        height: Number(height),
        heightUnit,
      })
      setResult(value)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Indice Massa Corporea (BMI)"
      description="Calcola il BMI da peso e altezza e ottieni una classificazione indicativa."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unita peso</label>
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {WEIGHT_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altezza</label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unita altezza</label>
            <select
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {HEIGHT_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola BMI
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(result.bmi)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">BMI Prime</p>
              <p className="text-2xl font-bold text-blue-700">{formatNumber(result.bmiPrime, 3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Classificazione</p>
              <p className="text-2xl font-bold text-blue-700">{result.category}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Range peso indicativo normopeso:
            {' '}
            <strong>
              {formatNumber(result.healthyWeightRangeKg.min)} - {formatNumber(result.healthyWeightRangeKg.max)} kg
            </strong>
          </p>
          <p className="text-xs text-gray-600">
              Dati convertiti internamente in unita metriche: {formatNumber(result.weightKg, 3)} kg, {formatNumber(result.heightCm, 2)} cm.
          </p>
        </div>
      )}

      <AdUnit adSlot="1234567905" />
    </Calculator>
  )
}

