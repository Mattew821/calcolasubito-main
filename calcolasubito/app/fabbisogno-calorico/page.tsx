'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import {
  calculateCaloriePlan,
  type BiologicalSex,
  type HeightUnit,
  type WeightUnit,
} from '@/lib/calculations'

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentario (poco o nessun allenamento)' },
  { value: 1.375, label: 'Leggermente attivo (1-3 allenamenti/settimana)' },
  { value: 1.55, label: 'Moderatamente attivo (3-5 allenamenti/settimana)' },
  { value: 1.725, label: 'Molto attivo (6-7 allenamenti/settimana)' },
  { value: 1.9, label: 'Estremamente attivo (lavoro fisico + allenamento)' },
]

const GOAL_PRESETS = [
  { value: '-25', label: 'Dimagrimento aggressivo (-25%)' },
  { value: '-15', label: 'Dimagrimento moderato (-15%)' },
  { value: '0', label: 'Mantenimento (0%)' },
  { value: '10', label: 'Aumento massa moderato (+10%)' },
  { value: '20', label: 'Aumento massa aggressivo (+20%)' },
]

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

const MACRO_PRESETS = {
  balanced: { proteinPercent: 30, carbsPercent: 45, fatPercent: 25 },
  high_protein: { proteinPercent: 35, carbsPercent: 35, fatPercent: 30 },
  low_carb: { proteinPercent: 35, carbsPercent: 25, fatPercent: 40 },
  high_carb: { proteinPercent: 25, carbsPercent: 55, fatPercent: 20 },
} as const

type MacroPresetKey = keyof typeof MACRO_PRESETS

export default function FabbisognoCaloricoPage() {
  const [sex, setSex] = useState<BiologicalSex>('male')
  const [age, setAge] = useState('30')
  const [weight, setWeight] = useState('75')
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg')
  const [height, setHeight] = useState('175')
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm')
  const [activityFactor, setActivityFactor] = useState('1.55')
  const [goalPercent, setGoalPercent] = useState('0')
  const [macroPreset, setMacroPreset] = useState<MacroPresetKey>('balanced')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateCaloriePlan> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateCaloriePlan({
        sex,
        age: Number(age),
        weight: Number(weight),
        weightUnit,
        height: Number(height),
        heightUnit,
        activityFactor: Number(activityFactor),
        goalPercent: Number(goalPercent),
        macroSplit: MACRO_PRESETS[macroPreset],
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
      description="Stima metabolismo basale (BMR), TDEE, target calorico e macronutrienti con unita metriche o imperiali."
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altezza</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unita peso</label>
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {WEIGHT_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unita altezza</label>
            <select
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {HEIGHT_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Obiettivo calorico</label>
            <select
              value={goalPercent}
              onChange={(e) => setGoalPercent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {GOAL_PRESETS.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ripartizione macronutrienti</label>
            <select
              value={macroPreset}
              onChange={(e) => setMacroPreset(e.target.value as MacroPresetKey)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="balanced">Bilanciata (30/45/25)</option>
              <option value="high_protein">Alta proteina (35/35/30)</option>
              <option value="low_carb">Low-carb (35/25/40)</option>
              <option value="high_carb">High-carb (25/55/20)</option>
            </select>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Metabolismo basale (BMR)</p>
              <p className="text-3xl font-bold text-cyan-700">{Math.round(result.bmr)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fabbisogno giornaliero (TDEE)</p>
              <p className="text-3xl font-bold text-emerald-700">{Math.round(result.tdee)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Target obiettivo</p>
              <p className="text-3xl font-bold text-slate-900">{Math.round(result.targetCalories)} kcal</p>
              <p className="text-xs text-gray-600 mt-1">
                Delta: {result.calorieDelta >= 0 ? '+' : ''}
                {Math.round(result.calorieDelta)} kcal
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <p><span className="font-semibold">Proteine:</span> {Math.round(result.macros.proteinGrams)} g</p>
            <p><span className="font-semibold">Carboidrati:</span> {Math.round(result.macros.carbsGrams)} g</p>
            <p><span className="font-semibold">Grassi:</span> {Math.round(result.macros.fatGrams)} g</p>
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
