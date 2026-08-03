'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateBolloAuto } from '@/lib/calculations'

const EMISSION_CLASSES = ['Euro 0', 'Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6']

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

export default function BolloAutoPage() {
  const [power, setPower] = useState('100')
  const [emissionClass, setEmissionClass] = useState('Euro 6')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateBolloAuto> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateBolloAuto({
        power: Number(power),
        emissionClass,
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Bollo Auto" description="Calcola il bollo auto con la tariffa base nazionale e il superbollo oltre 185 kW.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Potenza (kW)</label>
            <input type="number" step="1" min="1" value={power} onChange={(e) => setPower(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Classe ambientale</label>
            <select value={emissionClass} onChange={(e) => setEmissionClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {EMISSION_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Calcola
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Bollo annuale stimato</p>
          <p className="text-2xl font-bold text-blue-700">{formatEuro(result.totalCost)}</p>
          {result.superbollo > 0 ? (
            <p className="text-sm text-gray-600 mt-2">
              Di cui superbollo (oltre 185 kW): {formatEuro(result.superbollo)}
            </p>
          ) : (
            <p className="text-sm text-gray-600 mt-2">
              Tariffa base {formatEuro(result.annualCost)} · nessun superbollo (potenza ≤ 185 kW)
            </p>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <p><strong>Come si calcola:</strong> tariffa base nazionale per kW (L. 449/1997): 2,58 €/kW fino a 100 kW, 3,87 €/kW da 100 a 130 kW, 4,65 €/kW da 130 a 160 kW, 5,82 €/kW oltre 160 kW. Superbollo (L. 147/2013): 20 €/kW per la potenza oltre 185 kW, raddoppiato per le auto Euro 0-3.</p>
        <p><strong>Attenzione:</strong> le regioni possono applicare maggiorazioni, riduzioni o esenzioni (es. veicoli elettrici, veicoli storici). Questo calcolo usa solo la tariffa nazionale e non sostituisce il calcolo ufficiale della regione di residenza.</p>
      </div>

      <AdUnit adSlot="bollo-auto" />
    </Calculator>
  )
}
