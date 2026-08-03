'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculatePensioneEstimate } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

export default function StimaPensionePage() {
  const [currentAge, setCurrentAge] = useState('35')
  const [retirementAge, setRetirementAge] = useState('67')
  const [currentSalary, setCurrentSalary] = useState('30000')
  const [contributionYears, setContributionYears] = useState('10')
  const [growthRate, setGrowthRate] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculatePensioneEstimate> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculatePensioneEstimate({
        currentAge: Number(currentAge),
        retirementAge: Number(retirementAge),
        currentSalary: Number(currentSalary),
        contributionYears: Number(contributionYears),
        growthRate: Number(growthRate)
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Stima Pensione" description="Stima la pensione pubblica in base a stipendio, età e contributi.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Età attuale</label>
            <input type="number" step="1" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Età pensionamento</label>
            <input type="number" step="1" min="57" max="75" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stipendio annuo lordo (EUR)</label>
            <input type="number" step="100" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anni contributi già versati</label>
            <input type="number" step="0.5" value={contributionYears} onChange={(e) => setContributionYears(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crescita stipendio annua (%)</label>
          <input type="number" step="0.1" value={growthRate} onChange={(e) => setGrowthRate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Stima pensione
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">Pensione mensile stimata</p>
            <p className="text-2xl font-bold text-blue-700">{formatEuro(result.estimatedPension)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Tasso di sostituzione</p>
              <p className="font-semibold">{result.replacementRate.toLocaleString('it-IT')}%</p>
            </div>
            <div>
              <p className="text-gray-600">Contributi al pensionamento</p>
              <p className="font-semibold">{result.contributionYearsAtRetirement} anni</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Anni al pensionamento: {result.yearsToRetirement}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Nota: stima semplificata basata sul sistema contributivo INPS. Coefficienti di trasformazione aggiornati al 2024. Non sostituisce il calcolo INPS ufficiale.
          </p>
        </div>
      )}

      <AdUnit adSlot="stima-pensione" />
    </Calculator>
  )
}