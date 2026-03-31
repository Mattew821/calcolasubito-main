'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import AdUnit from '@/components/AdUnit'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { calculateDaysBetween, calculateBusinessDaysBetween } from '@/lib/calculations'

type DaysMode = 'calendar' | 'business'

export default function CalcoloGiorni() {
  const today = new Date().toISOString().split('T')[0] || ''

  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [mode, setMode] = useState<DaysMode>('calendar')
  const [includeEndDate, setIncludeEndDate] = useState(false)
  const [holidaysInput, setHolidaysInput] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const { toasts, showToast, removeToast } = useToast()

  const { checkRateLimit, isLimited, remainingRequests, resetTime } = useRateLimit({
    maxRequests: 10,
    windowMs: 60000,
  })

  const parseHolidays = (): Date[] => {
    const trimmed = holidaysInput.trim()
    if (!trimmed) {
      return []
    }

    const parts = trimmed
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const holidays = parts.map((item) => new Date(item))
    if (holidays.some((item) => Number.isNaN(item.getTime()))) {
      throw new Error('Formato festivita non valido. Usa YYYY-MM-DD separati da virgola')
    }

    return holidays
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!checkRateLimit()) {
      const secondsLeft = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 0
      showToast(`Troppi calcoli. Riprova tra ${secondsLeft}s`, 'error')
      return
    }

    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('Date non valide')
      }
      if (start > end) {
        throw new Error('La data iniziale deve essere precedente o uguale alla data finale')
      }

      const days =
        mode === 'calendar'
          ? calculateDaysBetween(start, end) + (includeEndDate ? 1 : 0)
          : calculateBusinessDaysBetween(start, end, {
              includeEndDate,
              holidays: parseHolidays(),
            })

      setResult(days)
      showToast('Calcolo completato!', 'success')
    } catch (error) {
      setResult(null)
      showToast(error instanceof Error ? error.message : 'Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    setStartDate(today)
    setEndDate(today)
    setMode('calendar')
    setIncludeEndDate(false)
    setHolidaysInput('')
    setResult(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Calculator
        title="Calcolo Giorni tra Due Date"
        description="Calcola giorni di calendario o lavorativi, con opzione inclusiva e festivita personalizzate."
      >
        <div className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data inizio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data fine</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="mode"
                  value="calendar"
                  checked={mode === 'calendar'}
                  onChange={() => setMode('calendar')}
                />
                Giorni di calendario
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="mode"
                  value="business"
                  checked={mode === 'business'}
                  onChange={() => setMode('business')}
                />
                Giorni lavorativi (lun-ven)
              </label>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
              />
              Includi anche la data finale nel conteggio
            </label>

            {mode === 'business' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Festivita aggiuntive (opzionale, formato YYYY-MM-DD separato da virgola)
                </label>
                <input
                  type="text"
                  value={holidaysInput}
                  onChange={(e) => setHolidaysInput(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="es. 2026-01-01, 2026-12-25"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={isLimited}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLimited ? 'Limite raggiunto' : 'Calcola'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Resetta
              </button>
            </div>

            {remainingRequests <= 2 && remainingRequests > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Attenzione: {remainingRequests} calcoli rimasti in questo minuto
                </p>
              </div>
            )}
            {isLimited && resetTime && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Limite raggiunto. Riprova tra {Math.ceil((resetTime - Date.now()) / 1000)} secondi
                </p>
              </div>
            )}
          </form>

          <AdUnit adSlot="1234567895" />

          {result !== null && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm mb-2">Differenza:</p>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 break-words">
                {result.toLocaleString('it-IT')} giorni
              </p>
              <p className="text-sm text-gray-600">
                Dal {new Date(startDate).toLocaleDateString('it-IT')} al {new Date(endDate).toLocaleDateString('it-IT')}
              </p>
            </div>
          )}

          <AdUnit adSlot="1234567896" />
        </div>
      </Calculator>
    </>
  )
}
