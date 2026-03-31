'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import {
  calculateFuelConsumptionDetailed,
  type DistanceUnit,
  type FuelUnit,
} from '@/lib/calculations'

const DISTANCE_UNITS: Array<{ value: DistanceUnit; label: string }> = [
  { value: 'km', label: 'Chilometri (km)' },
  { value: 'mi', label: 'Miglia (mi)' },
]

const FUEL_UNITS: Array<{ value: FuelUnit; label: string }> = [
  { value: 'l', label: 'Litri (L)' },
  { value: 'gal_us', label: 'Galloni USA (gal US)' },
  { value: 'gal_uk', label: 'Galloni UK (gal UK)' },
  { value: 'kg', label: 'Chilogrammi (kg - es. metano)' },
  { value: 'kwh', label: 'kWh (elettrico)' },
]

const FUEL_PROFILES: Array<{
  value: string
  label: string
  defaultUnit: FuelUnit
  defaultUnitPrice: number
}> = [
  { value: 'benzina', label: 'Benzina', defaultUnit: 'l', defaultUnitPrice: 1.9 },
  { value: 'diesel', label: 'Diesel', defaultUnit: 'l', defaultUnitPrice: 1.8 },
  { value: 'gpl', label: 'GPL', defaultUnit: 'l', defaultUnitPrice: 0.78 },
  { value: 'metano', label: 'Metano', defaultUnit: 'kg', defaultUnitPrice: 1.45 },
  { value: 'elettrico', label: 'Elettrico', defaultUnit: 'kwh', defaultUnitPrice: 0.35 },
  { value: 'custom', label: 'Personalizzato', defaultUnit: 'l', defaultUnitPrice: 0 },
]

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
}

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ConsumoCarburantePage() {
  const [distance, setDistance] = useState('500')
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km')
  const [fuelAmount, setFuelAmount] = useState('30')
  const [fuelUnit, setFuelUnit] = useState<FuelUnit>('l')
  const [fuelProfile, setFuelProfile] = useState<string>('custom')
  const [unitPrice, setUnitPrice] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateFuelConsumptionDetailed> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const parsedUnitPrice =
        unitPrice.trim() === '' ? null : Number(unitPrice)
      const output = calculateFuelConsumptionDetailed({
        distance: Number(distance),
        distanceUnit,
        fuelAmount: Number(fuelAmount),
        fuelUnit,
        unitPrice: parsedUnitPrice,
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  const onFuelProfileChange = (value: string) => {
    setFuelProfile(value)
    const profile = FUEL_PROFILES.find((item) => item.value === value)
    if (!profile) {
      return
    }
    setFuelUnit(profile.defaultUnit)
    if (profile.value === 'custom') {
      setUnitPrice('')
      return
    }
    setUnitPrice(String(profile.defaultUnitPrice))
  }

  return (
    <Calculator
      title="Calcolo Consumo Carburante"
      description="Confronta consumi con unita metriche/imperiali, MPG e costo percorso per diversi tipi di alimentazione."
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distanza percorsa</label>
            <input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unita distanza</label>
            <select
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value as DistanceUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DISTANCE_UNITS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carburante/Energia consumata</label>
            <input
              type="number"
              step="0.01"
              value={fuelAmount}
              onChange={(e) => setFuelAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unita carburante</label>
            <select
              value={fuelUnit}
              onChange={(e) => setFuelUnit(e.target.value as FuelUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FUEL_UNITS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo alimentazione (preset costo)</label>
            <select
              value={fuelProfile}
              onChange={(e) => onFuelProfileChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FUEL_PROFILES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo unitario (EUR per {fuelUnit})
            </label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opzionale"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Efficienza per unita selezionata</p>
              <p className="text-xl font-bold text-blue-700">
                {formatNumber(result.kmPerFuelUnit)} km/{result.fuelUnit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Consumo per 100 km (unita selezionata)</p>
              <p className="text-xl font-bold text-gray-900">
                {formatNumber(result.fuelUnitsPer100Km)} {result.fuelUnit}/100km
              </p>
            </div>
          </div>

          {result.kmPerLiter !== null && result.litersPer100Km !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Efficienza standard</p>
                <p className="text-xl font-bold text-blue-700">
                  {formatNumber(result.kmPerLiter)} km/l
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatNumber(result.litersPer100Km)} l/100km
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Standard anglosassone</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(result.mpgUs ?? 0)} MPG (US)
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatNumber(result.mpgUk ?? 0)} MPG (UK)
                </p>
              </div>
            </div>
          )}

          {result.totalCost !== null && result.costPer100Km !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Costo totale viaggio</p>
                <p className="text-xl font-bold text-emerald-700">{formatEuro(result.totalCost)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Costo ogni 100 km</p>
                <p className="text-xl font-bold text-emerald-700">{formatEuro(result.costPer100Km)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <AdUnit adSlot="1234567906" />
    </Calculator>
  )
}

