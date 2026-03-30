'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import AdUnit from '@/components/AdUnit'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { type MortgageCalculation } from '@/lib/calculations'
import { rataMutuoSchema, type RataMutuoInput } from '@/lib/validations'

export default function CalcoloRataMutuo() {
  const [result, setResult] = useState<MortgageCalculation | null>(null)
  const { toasts, showToast, removeToast } = useToast()
  const { calculate, isLoading } = useCalculatorWorker()

  // Rate limiting: 10 calculations per minute
  const { checkRateLimit, isLimited, remainingRequests, resetTime } = useRateLimit({
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<RataMutuoInput>({
    resolver: zodResolver(rataMutuoSchema),
    defaultValues: {
      principal: 200000,
      annualRate: 4.5,
      years: 25,
    },
  })

  const onSubmit = async (data: RataMutuoInput) => {
    // Check rate limit
    if (!checkRateLimit()) {
      const secondsLeft = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 0
      showToast(
        `Troppi calcoli. Riprova tra ${secondsLeft}s`,
        'error'
      )
      return
    }

    try {
      const months = data.years * 12
      const res = await calculate('mortgage', {
        principal: data.principal,
        annualRate: data.annualRate,
        months,
      })
      setResult(res as MortgageCalculation)
      showToast('Calcolo rata mutuo completato!', 'success')
    } catch (error) {
      showToast('Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    resetForm()
    setResult(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Calculator
        title="Calcolo Rata Mutuo"
        description="Calcola la rata mensile del tuo mutuo immobiliare"
      >
        <div className="space-y-6">
          {/* Inputs */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importo (€)
                </label>
                <input
                  type="number"
                  {...register('principal', { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.principal ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="200000"
                />
                {errors.principal && (
                  <p className="mt-1 text-sm text-red-600">{errors.principal.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasso Annuale (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('annualRate', { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.annualRate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="4.5"
                />
                {errors.annualRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.annualRate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anni
                </label>
                <input
                  type="number"
                  {...register('years', { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.years ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="25"
                />
                {errors.years && (
                  <p className="mt-1 text-sm text-red-600">{errors.years.message}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={isLoading || isLimited}
                aria-label={isLoading ? "Calcolo in corso" : isLimited ? "Limite di calcoli raggiunto" : "Calcola"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                    Calcolo...
                  </>
                ) : isLimited ? (
                  'Limite raggiunto'
                ) : (
                  'Calcola'
                )}
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

            {/* Rate limit warning */}
            {remainingRequests <= 2 && remainingRequests > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>{remainingRequests}</strong> calcolo{remainingRequests === 1 ? '' : 'i'} rimasto{remainingRequests === 1 ? '' : 'i'} in questo minuto
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

          {/* Ad 1 */}
          <AdUnit adSlot="1234567901" />

          {/* Result */}
          {result && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Rata Mensile:</p>
                <p className="text-3xl font-bold text-blue-600">
                  €{result.monthlyPayment.toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Importo Totale Pagato:</p>
                  <p className="font-semibold text-gray-900">
                    €{result.totalAmountPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Interessi Totali:</p>
                  <p className="font-semibold text-red-600">
                    €{result.totalInterest.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ad 2 */}
          <AdUnit adSlot="1234567902" />

          {/* SEO Content */}
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Calcolare la Rata del Mutuo</h2>
              <p className="text-gray-600 mb-4">
                La rata mensile di un mutuo dipende da tre fattori: l&apos;importo finanziato, il tasso di interesse annuale e la durata in anni.
                Il nostro calcolatore utilizza la formula di ammortamento francese, il metodo più diffuso in Italia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">La Formula</h2>
              <div className="bg-blue-50 border border-blue-200 p-6 mb-4 equation-box">
                <p className="font-mono text-sm text-blue-900 mb-2 equation-text">
                  Rata = P × [i(1+i)^n] / [(1+i)^n - 1]
                </p>
                <p className="text-sm text-blue-900">
                  Dove: P = importo, i = tasso mensile, n = numero rate
                </p>
              </div>
              <p className="text-gray-600">
                <strong>Esempio:</strong> Mutuo di 200.000€ a tasso 4.5% per 25 anni = rata circa €1.013/mese
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ammortamento Francese</h2>
              <p className="text-gray-600 mb-4">
                L&apos;ammortamento francese (o a rata costante) è il più usato in Italia. La rata rimane uguale per tutta la durata,
                ma la composizione cambia: all&apos;inizio paghi più interessi, verso la fine più capitale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Fattori che Influenzano la Rata</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Importo:</strong> Più alto è l&apos;importo, più alta la rata</li>
                <li><strong>Tasso di interesse:</strong> Tasso fisso vs variabile, tasso EUR vs EURIBOR</li>
                <li><strong>Durata:</strong> Più anni = rata più bassa ma interessi totali più alti</li>
                <li><strong>Commissioni bancarie:</strong> Aggiunte all&apos;importo totale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Cosa significa tasso fisso?</h3>
                  <p className="text-gray-600">
                    Il tasso rimane uguale per tutta la durata del mutuo, quindi la rata non cambia mai.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Cosa significa tasso variabile?</h3>
                  <p className="text-gray-600">
                    Il tasso cambia in base all&apos;EURIBOR, quindi la rata varia nel tempo. Più rischioso ma potenzialmente meno costoso.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Posso estinguere il mutuo anticipatamente?</h3>
                  <p className="text-gray-600">
                    Sì, ma potrebbe essere richiesto il pagamento di una penale. Confronta il costo della penale con gli interessi risparmiati.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Qual è la durata tipica di un mutuo?</h3>
                  <p className="text-gray-600">
                    I mutui in Italia vanno dai 5 ai 40 anni, ma i più comuni sono tra 20 e 30 anni.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Scopri gli Altri Calcolatori</h2>
              <ul className="list-disc list-inside text-blue-600 space-y-2">
                <li><a href="/percentuali" className="hover:underline">Calcolo Percentuali</a></li>
                <li><a href="/giorni-tra-date" className="hover:underline">Calcolo Giorni tra Date</a></li>
                <li><a href="/scorporo-iva" className="hover:underline">Calcolo Scorporo IVA</a></li>
                <li><a href="/codice-fiscale" className="hover:underline">Calcolo Codice Fiscale</a></li>
              </ul>
            </section>
          </div>
        </div>
      </Calculator>
    </>
  )
}
