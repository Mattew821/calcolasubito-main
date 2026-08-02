'use client'

import React, { memo, useCallback, useMemo, useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import {
  compareQuotePayload,
  quoteRequestSchema,
  quoteResponseSchema,
  quoteScenarioPresets,
  type QuoteRequest,
  type QuoteResponse,
  type QuoteScenarioName,
} from '@/lib/quote-contract'
import { getActiveIntlLocale } from '@/lib/locale'

type QuoteState = {
  base_value: string
  multiplier: string
  risk_factor: QuoteRequest['risk_factor']
}

type QuoteUiState = {
  response: QuoteResponse | null
  cmpWarning: string | null
  message: string | null
  validationErrors: string[]
  loading: boolean
}

const initialState: QuoteState = {
  base_value: '120',
  multiplier: '1.15',
  risk_factor: 'medium',
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(getActiveIntlLocale(), {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatScenarioLabel(name: QuoteScenarioName): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const QuoteDashboard = memo(function QuoteDashboard() {
  const [form, setForm] = useState<QuoteState>(initialState)
  const [ui, setUi] = useState<QuoteUiState>({
    response: null,
    cmpWarning: null,
    message: null,
    validationErrors: [],
    loading: false,
  })

  const scenarioNames = useMemo(() => Object.keys(quoteScenarioPresets) as QuoteScenarioName[], [])

  const setScenario = useCallback((scenario: QuoteScenarioName) => {
    setForm({
      base_value: String(quoteScenarioPresets[scenario].base_value),
      multiplier: String(quoteScenarioPresets[scenario].multiplier),
      risk_factor: quoteScenarioPresets[scenario].risk_factor,
    })
    setUi((previous) => ({
      ...previous,
      message: `${formatScenarioLabel(scenario)} selezionato`,
      validationErrors: [],
      cmpWarning: null,
    }))
  }, [])

  const onChange = useCallback((field: keyof QuoteState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUi((previous) => ({ ...previous, loading: true, message: null, cmpWarning: null, validationErrors: [] }))

    const parsed = quoteRequestSchema.safeParse(form)
    if (!parsed.success) {
      setUi({
        response: null,
        cmpWarning: null,
        message: 'Input non valido: la validazione Zod ha bloccato la chiamata API.',
        validationErrors: parsed.error.issues.map((issue) => issue.message),
        loading: false,
      })
      return
    }

    try {
      const response = await fetch('/api/v1/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      })

      const payload: unknown = await response.json()
      const parsedResponse = quoteResponseSchema.safeParse(payload)

      if (!response.ok) {
        throw new Error(
          parsedResponse.success
            ? `Server error: ${response.status}`
            : (payload as { error?: string })?.error ?? `Server error: ${response.status}`
        )
      }

      if (!parsedResponse.success) {
        setUi({
          response: null,
          cmpWarning: 'Inconsistenza Dati: la risposta non rispetta il contratto del backend.',
          message: 'Risposta non valida dal server.',
          validationErrors: parsedResponse.error.issues.map((issue) => issue.message),
          loading: false,
        })
        return
      }

      const localPreview = parsedResponse.data
      const comparison = compareQuotePayload(parsed.data, localPreview)
      const cmpWarning = comparison.matches ? null : `Inconsistenza Dati: ${comparison.mismatches.join(', ')}`

      setUi({
        response: localPreview,
        cmpWarning,
        message: cmpWarning ? 'CMP ha rilevato una divergenza tra input e risposta.' : 'Quote calcolata e validata.',
        validationErrors: [],
        loading: false,
      })
    } catch (error) {
      setUi({
        response: null,
        cmpWarning: 'Inconsistenza Dati: impossibile validare il payload ricevuto.',
        message: error instanceof Error ? error.message : 'Errore nel motore quote',
        validationErrors: [],
        loading: false,
      })
    }
  }, [form])

  const resultTelemetry = useMemo(() => {
    if (!ui.response) {
      return null
    }
    return JSON.stringify(ui.response.telemetry, null, 2)
  }, [ui.response])

  return (
    <Calculator
      title="Quote Dashboard"
      description="Motore di calcolo e validazione speculare tra frontend e backend, con CMP zero-drift."
      keyword="pricing"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scenari di test">
          {scenarioNames.map((scenario) => (
            <button
              key={scenario}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                form.base_value === String(quoteScenarioPresets[scenario].base_value) &&
                form.multiplier === String(quoteScenarioPresets[scenario].multiplier) &&
                form.risk_factor === quoteScenarioPresets[scenario].risk_factor
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => setScenario(scenario)}
            >
              {formatScenarioLabel(scenario)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-2">Base value</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.base_value}
                onChange={(event) => onChange('base_value', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-2">Multiplier</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.multiplier}
                onChange={(event) => onChange('multiplier', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-slate-700 mb-2">Risk factor</span>
              <select
                value={form.risk_factor}
                onChange={(event) => onChange('risk_factor', event.target.value as QuoteState['risk_factor'])}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={ui.loading}
              className="flex-1 rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {ui.loading ? 'Validazione in corso...' : 'Calcola quote'}
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-slate-200 px-4 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-300"
              onClick={() => {
                setForm(initialState)
                setUi({
                  response: null,
                  cmpWarning: null,
                  message: 'Campi ripristinati.',
                  validationErrors: [],
                  loading: false,
                })
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {ui.message && (
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900" role="status" aria-live="polite">
            {ui.message}
          </div>
        )}

        {ui.validationErrors.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Input non valido</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {ui.validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {ui.cmpWarning && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            {ui.cmpWarning}
          </div>
        )}

        {ui.response && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Final quote</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(ui.response.final_quote)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Risk adjustment</p>
                <p className="mt-1 text-3xl font-bold text-cyan-700">{ui.response.risk_adjustment.toFixed(2)}x</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p><span className="font-semibold">Sanity floor:</span> {formatCurrency(ui.response.sanity_floor)}</p>
              <p><span className="font-semibold">Sanity check:</span> {ui.response.sanity_check_passed ? 'PASS' : 'FAIL'}</p>
              <p><span className="font-semibold">Base value:</span> {formatCurrency(ui.response.input_echo.base_value)}</p>
              <p><span className="font-semibold">Multiplier:</span> {ui.response.input_echo.multiplier.toFixed(2)}</p>
            </div>

            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
              {resultTelemetry}
            </pre>
          </div>
        )}
      </div>
    </Calculator>
  )
})

export default QuoteDashboard
