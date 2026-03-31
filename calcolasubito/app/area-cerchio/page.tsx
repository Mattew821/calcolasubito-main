'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { getActiveIntlLocale } from '@/lib/locale'
import {
  calculateCircleAreaDetailed,
  type AreaInputUnit,
} from '@/lib/calculations'

const AREA_UNITS: Array<{ value: AreaInputUnit; label: string }> = [
  { value: 'm', label: 'Metri (m)' },
  { value: 'km', label: 'Chilometri (km)' },
  { value: 'cm', label: 'Centimetri (cm)' },
  { value: 'mm', label: 'Millimetri (mm)' },
  { value: 'mi', label: 'Miglia (mi)' },
  { value: 'yd', label: 'Yarde (yd)' },
  { value: 'ft', label: 'Piedi (ft)' },
  { value: 'in', label: 'Pollici (in)' },
]

function formatNumber(value: number, maximumFractionDigits = 6): string {
  return value.toLocaleString(getActiveIntlLocale(), {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

export default function AreaCerchioPage() {
  const [radius, setRadius] = useState('5')
  const [unit, setUnit] = useState<AreaInputUnit>('m')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateCircleAreaDetailed> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const detailed = calculateCircleAreaDetailed(Number(radius), unit)
      setResult(detailed)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator
      title="Calcolo Area Cerchio"
      description="Calcola l'area del cerchio partendo dal raggio."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Raggio</label>
          <input
            type="number"
            step="0.01"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unita di misura</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as AreaInputUnit)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AREA_UNITS.map((areaUnit) => (
              <option key={areaUnit.value} value={areaUnit.value}>
                {areaUnit.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola area
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Area ({unit}^2)</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(result.areaInInputUnit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Diametro ({unit})</p>
              <p className="text-2xl font-bold text-blue-700">{formatNumber(result.diameterInInputUnit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Circonferenza ({unit})</p>
              <p className="text-2xl font-bold text-blue-700">{formatNumber(result.circumferenceInInputUnit)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p><span className="font-semibold">m^2:</span> {formatNumber(result.area.squareMeters)}</p>
            <p><span className="font-semibold">km^2:</span> {formatNumber(result.area.squareKilometers, 9)}</p>
            <p><span className="font-semibold">ha:</span> {formatNumber(result.area.hectares, 6)}</p>
            <p><span className="font-semibold">acri:</span> {formatNumber(result.area.acres, 6)}</p>
            <p><span className="font-semibold">ft^2:</span> {formatNumber(result.area.squareFeet)}</p>
            <p><span className="font-semibold">in^2:</span> {formatNumber(result.area.squareInches)}</p>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567908" />
    </Calculator>
  )
}

