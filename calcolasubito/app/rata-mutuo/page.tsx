'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import AdUnit from '@/components/AdUnit'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { calculateMortgageAdvanced, type MortgageAdvancedResult } from '@/lib/calculations'

export default function CalcoloRataMutuo() {
  const [principal, setPrincipal] = useState('200000')
  const [annualRate, setAnnualRate] = useState('4.5')
  const [years, setYears] = useState('25')
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState('0')
  const [monthlyFees, setMonthlyFees] = useState('0')
  const [upfrontCosts, setUpfrontCosts] = useState('0')

  const [result, setResult] = useState<MortgageAdvancedResult | null>(null)
  const { toasts, showToast, removeToast } = useToast()

  const { checkRateLimit, isLimited, remainingRequests, resetTime } = useRateLimit({
    maxRequests: 10,
    windowMs: 60000,
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!checkRateLimit()) {
      const secondsLeft = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 0
      showToast(`Troppi calcoli. Riprova tra ${secondsLeft}s`, 'error')
      return
    }

    try {
      const parsedPrincipal = Number(principal)
      const parsedAnnualRate = Number(annualRate)
      const parsedYears = Number(years)
      const parsedExtraMonthlyPayment = Number(extraMonthlyPayment)
      const parsedMonthlyFees = Number(monthlyFees)
      const parsedUpfrontCosts = Number(upfrontCosts)

      if (!Number.isFinite(parsedPrincipal) || parsedPrincipal <= 0) {
        throw new Error('Importo mutuo non valido')
      }
      if (!Number.isFinite(parsedAnnualRate) || parsedAnnualRate < 0) {
        throw new Error('Tasso non valido')
      }
      if (!Number.isFinite(parsedYears) || parsedYears <= 0) {
        throw new Error('Durata non valida')
      }

      const output = calculateMortgageAdvanced({
        principal: parsedPrincipal,
        annualRate: parsedAnnualRate,
        months: Math.round(parsedYears * 12),
        extraMonthlyPayment: parsedExtraMonthlyPayment,
        monthlyFees: parsedMonthlyFees,
        upfrontCosts: parsedUpfrontCosts,
      })
      setResult(output)
      showToast('Calcolo rata mutuo completato!', 'success')
    } catch (error) {
      setResult(null)
      showToast(error instanceof Error ? error.message : 'Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    setPrincipal('200000')
    setAnnualRate('4.5')
    setYears('25')
    setExtraMonthlyPayment('0')
    setMonthlyFees('0')
    setUpfrontCosts('0')
    setResult(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Calculator
        title="Calcolo Rata Mutuo"
        description="Rata mutuo con opzioni avanzate: extra rata, spese mensili, costi iniziali e risparmio interessi."
      >
        <div className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Importo (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tasso annuale (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anni</label>
                <input
                  type="number"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra rata mensile (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={extraMonthlyPayment}
                  onChange={(e) => setExtraMonthlyPayment(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spese mensili (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={monthlyFees}
                  onChange={(e) => setMonthlyFees(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Costi iniziali (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={upfrontCosts}
                  onChange={(e) => setUpfrontCosts(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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

          <AdUnit adSlot="1234567901" />

          {result && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Rata mensile base (senza fee)</p>
                <p className="text-3xl font-bold text-blue-600">EUR {result.monthlyPayment.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Durata effettiva</p>
                  <p className="font-semibold text-gray-900">{result.actualMonths} mesi</p>
                </div>
                <div>
                  <p className="text-gray-600">Mesi risparmiati</p>
                  <p className="font-semibold text-emerald-700">{result.monthsSaved}</p>
                </div>
                <div>
                  <p className="text-gray-600">Interessi totali</p>
                  <p className="font-semibold text-red-600">EUR {result.totalInterest.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Interessi risparmiati</p>
                  <p className="font-semibold text-emerald-700">EUR {result.totalInterestSaved.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Totale rate (senza fee)</p>
                  <p className="font-semibold text-gray-900">EUR {result.totalAmountPaid.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Totale complessivo con fee+costi</p>
                  <p className="font-semibold text-gray-900">EUR {result.totalPaidWithFeesAndCosts.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          <AdUnit adSlot="1234567902" />
        </div>
      </Calculator>
    </>
  )
}
