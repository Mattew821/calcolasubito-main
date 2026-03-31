'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateAge } from '@/lib/calculations'
import { getActiveIntlLocale } from '@/lib/locale'

function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function CalcoloEtaPage() {
  const today = useMemo(() => toDateInputValue(new Date()), [])
  const [birthDate, setBirthDate] = useState('1990-01-01')
  const [referenceDate, setReferenceDate] = useState(today)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateAge> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateAge(new Date(birthDate), new Date(referenceDate))
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo età')
    }
  }

  return (
    <Calculator
      title="Calcolo Età"
      description="Calcola età precisa in anni, mesi e giorni a partire dalla data di nascita."
      keyword="età"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data di nascita</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data di riferimento</label>
            <input
              type="date"
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola Età
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Anni</p>
              <p className="text-3xl font-bold text-cyan-700">{result.years}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mesi</p>
              <p className="text-3xl font-bold text-cyan-700">{result.months}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Giorni</p>
              <p className="text-3xl font-bold text-cyan-700">{result.days}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Totale giorni vissuti:</span> {result.totalDays.toLocaleString(getActiveIntlLocale())}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Prossimo compleanno tra:</span> {result.nextBirthdayInDays} giorni
            </p>
          </div>
        </div>
      )}

      <AdUnit adSlot="1234567911" />
    </Calculator>
  )
}
