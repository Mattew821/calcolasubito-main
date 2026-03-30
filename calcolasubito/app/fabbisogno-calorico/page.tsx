'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateCalorieNeeds, type BiologicalSex } from '@/lib/calculations'

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentario (poco o nessun allenamento)' },
  { value: 1.375, label: 'Leggermente attivo (1-3 allenamenti/settimana)' },
  { value: 1.55, label: 'Moderatamente attivo (3-5 allenamenti/settimana)' },
  { value: 1.725, label: 'Molto attivo (6-7 allenamenti/settimana)' },
  { value: 1.9, label: 'Estremamente attivo (lavoro fisico + allenamento)' },
]

export default function FabbisognoCaloricoPage() {
  const [sex, setSex] = useState<BiologicalSex>('male')
  const [age, setAge] = useState('30')
  const [weightKg, setWeightKg] = useState('75')
  const [heightCm, setHeightCm] = useState('175')
  const [activityFactor, setActivityFactor] = useState('1.55')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateCalorieNeeds> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateCalorieNeeds({
        sex,
        age: Number(age),
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        activityFactor: Number(activityFactor),
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nel calcolo calorico')
    }
  }

  return (
    <Calculator
      title="Fabbisogno Calorico"
      description="Stima metabolismo basale (BMR) e fabbisogno giornaliero (TDEE) con formula Mifflin-St Jeor."
      keyword="calorie"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sesso biologico</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as BiologicalSex)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="male">Uomo</option>
            <option value="female">Donna</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Eta</label>
            <input
              type="number"
              step="1"
              min="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altezza (cm)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Livello di attivita</label>
          <select
            value={activityFactor}
            onChange={(e) => setActivityFactor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {ACTIVITY_LEVELS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola fabbisogno
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Metabolismo basale (BMR)</p>
              <p className="text-3xl font-bold text-cyan-700">{Math.round(result.bmr)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fabbisogno giornaliero (TDEE)</p>
              <p className="text-3xl font-bold text-emerald-700">{Math.round(result.tdee)} kcal</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Stima teorica utile come base informativa. Per piani nutrizionali personalizzati consulta un professionista.
          </p>
        </div>
      )}

      <AdUnit adSlot="1234567914" />
    </Calculator>
  )
}
