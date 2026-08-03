'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateBmr } from '@/lib/calculations'

function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function MetabolismoBasalePage() {
  const [weightKg, setWeightKg] = useState('70')
  const [heightCm, setHeightCm] = useState('175')
  const [ageYears, setAgeYears] = useState('30')
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateBmr> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateBmr({ weightKg: Number(weightKg), heightCm: Number(heightCm), ageYears: Number(ageYears), sex })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Metabolismo Basale (BMR)" description="Stima il metabolismo basale con l'equazione di Mifflin-St Jeor (1990).">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bmrW">Peso (kg)</label>
            <input id="bmrW" type="number" step="0.1" min="1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bmrH">Altezza (cm)</label>
            <input id="bmrH" type="number" step="0.5" min="50" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bmrA">Età (anni, ≥ 18)</label>
            <input id="bmrA" type="number" step="1" min="18" max="120" value={ageYears} onChange={(e) => setAgeYears(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">Sesso</legend>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input type="radio" name="sex" value="male" checked={sex === 'male'} onChange={() => setSex('male')} className="mr-2" />
              Uomo
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="sex" value="female" checked={sex === 'female'} onChange={() => setSex('female')} className="mr-2" />
              Donna
            </label>
          </div>
        </fieldset>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola BMR
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Metabolismo basale (kcal/giorno)</p>
            <p className="text-2xl font-bold text-blue-700">{formatNumber(result.bmr)} kcal</p>
          </div>
          <p className="text-xs text-gray-500">
            Equazione Mifflin-St Jeor (1990): BMR = 10 × peso + 6,25 × altezza − 5 × età {result.sex === 'male' ? '+ 5' : '− 161'}.
            Stima valida per adulti sani (19–78 anni), non una misura clinica.
          </p>
        </div>
      )}

      <AdUnit adSlot="metabolismo-basale" />
    </Calculator>
  )
}
