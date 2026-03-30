'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { convertLengthFromMeters } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  })
}

export default function ConvertitoreUnitaLunghezzaPage() {
  const [meters, setMeters] = useState('1000')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof convertLengthFromMeters> | null>(null)

  const onConvert = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = convertLengthFromMeters(Number(meters))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di conversione')
    }
  }

  return (
    <Calculator
      title="Convertitore Unita Lunghezza"
      description="Converti metri in km, cm, mm, miglia, piedi e pollici con precisione."
      keyword="conversione"
    >
      <form onSubmit={onConvert} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valore in metri (m)</label>
          <input
            type="number"
            step="0.0001"
            value={meters}
            onChange={(e) => setMeters(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Converti unita
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold">Chilometri:</span> {formatNumber(result.kilometers)} km</p>
            <p><span className="font-semibold">Centimetri:</span> {formatNumber(result.centimeters)} cm</p>
            <p><span className="font-semibold">Millimetri:</span> {formatNumber(result.millimeters)} mm</p>
            <p><span className="font-semibold">Miglia:</span> {formatNumber(result.miles)} mi</p>
            <p><span className="font-semibold">Piedi:</span> {formatNumber(result.feet)} ft</p>
            <p><span className="font-semibold">Pollici:</span> {formatNumber(result.inches)} in</p>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567915" />
    </Calculator>
  )
}
