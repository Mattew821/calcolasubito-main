'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import { ShareButtons } from '@/components/ShareButtons'
import AdUnit from '@/components/AdUnit'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { calculatePercentageChange, applySequentialPercentages } from '@/lib/calculations'

type PercentageMode = 'calculate' | 'percentage-of' | 'change' | 'sequential'

function parseSequence(raw: string): number[] {
  const items = raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  if (items.length === 0) {
    throw new Error('Inserisci almeno una variazione percentuale')
  }

  const parsed = items.map((item) => Number(item))
  if (parsed.some((item) => !Number.isFinite(item))) {
    throw new Error('Le variazioni devono essere numeri validi separati da virgola')
  }

  return parsed
}

export default function CalcoloPercentuali() {
  const [mode, setMode] = useState<PercentageMode>('calculate')
  const [firstValue, setFirstValue] = useState('100')
  const [secondValue, setSecondValue] = useState('20')
  const [sequenceInput, setSequenceInput] = useState('10,-5,3')

  const [numericResult, setNumericResult] = useState<number | null>(null)
  const [changeResult, setChangeResult] = useState<ReturnType<typeof calculatePercentageChange> | null>(null)
  const [sequentialResult, setSequentialResult] = useState<ReturnType<typeof applySequentialPercentages> | null>(null)

  const { toasts, showToast, removeToast } = useToast()
  const { calculate, isLoading } = useCalculatorWorker()

  const { checkRateLimit, isLimited, remainingRequests, resetTime } = useRateLimit({
    maxRequests: 10,
    windowMs: 60000,
  })

  useEffect(() => {
    setNumericResult(null)
    setChangeResult(null)
    setSequentialResult(null)
  }, [mode])

  const parsedFirst = useMemo(() => Number(firstValue), [firstValue])
  const parsedSecond = useMemo(() => Number(secondValue), [secondValue])

  const firstLabel =
    mode === 'calculate'
      ? 'Numero base'
      : mode === 'percentage-of'
        ? 'Parte'
        : mode === 'change'
          ? 'Valore iniziale'
          : 'Valore iniziale'

  const secondLabel =
    mode === 'calculate'
      ? 'Percentuale (%)'
      : mode === 'percentage-of'
        ? 'Totale'
        : mode === 'change'
          ? 'Valore finale'
          : 'Campo secondario (non usato)'

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!checkRateLimit()) {
      const secondsLeft = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 0
      showToast(`Troppi calcoli. Riprova tra ${secondsLeft}s`, 'error')
      return
    }

    if (!Number.isFinite(parsedFirst) || !Number.isFinite(parsedSecond)) {
      showToast('Inserisci due numeri validi', 'error')
      return
    }

    try {
      if (mode === 'calculate') {
        const res = await calculate('percentage', {
          number: parsedFirst,
          percentage: parsedSecond,
        })
        setNumericResult(res)
      } else if (mode === 'percentage-of') {
        const res = await calculate('percentageOf', {
          part: parsedFirst,
          total: parsedSecond,
        })
        setNumericResult(res)
      } else if (mode === 'change') {
        const res = calculatePercentageChange(parsedFirst, parsedSecond)
        setChangeResult(res)
      } else {
        const changes = parseSequence(sequenceInput)
        const res = applySequentialPercentages(parsedFirst, changes)
        setSequentialResult(res)
      }

      if (mode !== 'calculate' && mode !== 'percentage-of') {
        setNumericResult(null)
      }
      if (mode !== 'change') {
        setChangeResult(null)
      }
      if (mode !== 'sequential') {
        setSequentialResult(null)
      }

      showToast('Calcolo completato!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    setFirstValue('100')
    setSecondValue('20')
    setSequenceInput('10,-5,3')
    setNumericResult(null)
    setChangeResult(null)
    setSequentialResult(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Calculator
        title="Calcolo Percentuali"
        description="Percentuale diretta, inversa, variazione tra due valori e percentuali concatenate."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-start sm:items-center cursor-pointer gap-2">
              <input
                type="radio"
                name="mode"
                value="calculate"
                checked={mode === 'calculate'}
                onChange={() => setMode('calculate')}
              />
              <span className="text-sm font-medium text-gray-700">Numero e percentuale</span>
            </label>
            <label className="flex items-start sm:items-center cursor-pointer gap-2">
              <input
                type="radio"
                name="mode"
                value="percentage-of"
                checked={mode === 'percentage-of'}
                onChange={() => setMode('percentage-of')}
              />
              <span className="text-sm font-medium text-gray-700">Parte su totale</span>
            </label>
            <label className="flex items-start sm:items-center cursor-pointer gap-2">
              <input
                type="radio"
                name="mode"
                value="change"
                checked={mode === 'change'}
                onChange={() => setMode('change')}
              />
              <span className="text-sm font-medium text-gray-700">Variazione percentuale</span>
            </label>
            <label className="flex items-start sm:items-center cursor-pointer gap-2">
              <input
                type="radio"
                name="mode"
                value="sequential"
                checked={mode === 'sequential'}
                onChange={() => setMode('sequential')}
              />
              <span className="text-sm font-medium text-gray-700">Percentuali concatenate</span>
            </label>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{firstLabel}</label>
                <input
                  type="number"
                  step="0.01"
                  value={firstValue}
                  onChange={(e) => setFirstValue(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{secondLabel}</label>
                <input
                  type="number"
                  step="0.01"
                  value={secondValue}
                  onChange={(e) => setSecondValue(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={mode !== 'sequential'}
                  disabled={mode === 'sequential'}
                />
              </div>
            </div>

            {mode === 'sequential' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variazioni percentuali (separate da virgola)
                </label>
                <input
                  type="text"
                  value={sequenceInput}
                  onChange={(e) => setSequenceInput(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="es. 10,-5,3"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={isLoading || isLimited}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Calcolo...' : isLimited ? 'Limite raggiunto' : 'Calcola'}
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={isLoading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

          <AdUnit adSlot="1234567893" />

          {numericResult !== null && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm mb-2">Risultato:</p>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 break-words">
                {numericResult.toLocaleString('it-IT', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          {changeResult && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-2">
              <p className="text-sm text-gray-600">Variazione assoluta</p>
              <p className="text-2xl font-bold text-gray-900">
                {changeResult.absoluteChange.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
              </p>
              <p className="text-sm text-gray-600">Variazione percentuale</p>
              <p className="text-3xl font-bold text-blue-600">
                {changeResult.percentChange.toLocaleString('it-IT', { maximumFractionDigits: 4 })}%
              </p>
            </div>
          )}

          {sequentialResult && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
              <p className="text-sm text-gray-600">Valore finale</p>
              <p className="text-3xl font-bold text-blue-600">
                {sequentialResult.finalValue.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
              </p>
              <p className="text-sm text-gray-600">
                Variazione totale: {sequentialResult.totalPercentChange.toLocaleString('it-IT', { maximumFractionDigits: 4 })}%
              </p>
            </div>
          )}

          {(numericResult !== null || changeResult || sequentialResult) && (
            <ShareButtons
              title="Calcolo Percentuali - CalcolaSubito"
              description="Ho appena calcolato una percentuale con questo tool gratuito."
            />
          )}

          <AdUnit adSlot="1234567894" />
        </div>
      </Calculator>
    </>
  )
}
