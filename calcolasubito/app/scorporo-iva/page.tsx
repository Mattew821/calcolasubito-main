'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { scorporoIvaSchema, type ScorporoIvaInput } from '@/lib/validations'

interface IVAResult {
  gross: number
  net: number
  iva: number
  percentage: number
}

export default function ScorporoIVA() {
  const [result, setResult] = useState<IVAResult | null>(null)
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
    watch,
    setValue,
  } = useForm<ScorporoIvaInput>({
    resolver: zodResolver(scorporoIvaSchema),
    defaultValues: {
      amount: 100,
      rate: 22,
      mode: 'gross',
    },
  })

  const mode = watch('mode')
  const amount = watch('amount')
  const rate = watch('rate')

  const onSubmit = async (data: ScorporoIvaInput) => {
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
      const ivaResult = await calculate('iva', {
        amount: data.amount,
        rate: data.rate,
        mode: data.mode,
      })
      setResult(ivaResult as IVAResult)
      showToast('Calcolo IVA completato!', 'success')
    } catch (error) {
      showToast('Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    resetForm()
    setResult(null)
    showToast('Valori resettati', 'info')
  }

  const commonRates = [
    { label: 'Ridotta (4%)', value: 4 },
    { label: 'Agevolata (5%)', value: 5 },
    { label: 'Ordinaria (22%)', value: 22 },
  ]

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Calculator
        title="Calcolo Scorporo IVA"
        description="Calcola l&apos;IVA da un importo lordo o l&apos;importo netto"
      >
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('mode')}
                value="gross"
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Ho l&apos;importo lordo (IVA inclusa)
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('mode')}
                value="net"
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Ho l&apos;importo netto (IVA esclusa)
              </span>
            </label>
          </div>

          {/* Inputs */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importo {mode === 'gross' ? 'Lordo' : 'Netto'} (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Inserisci importo"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aliquota IVA (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('rate', { valueAsNumber: true })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.rate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Inserisci aliquota"
                />
                {errors.rate && (
                  <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
                )}
              </div>
            </div>

            {/* Quick IVA rates */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Aliquote comuni:
              </label>
              <div className="flex gap-2 flex-wrap">
                {commonRates.map((commonRate) => (
                  <button
                    key={commonRate.value}
                    type="button"
                    onClick={() => setValue('rate', commonRate.value)}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-blue-500 hover:text-white rounded transition-colors"
                  >
                    {commonRate.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
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
                  🚫 Limite raggiunto. Riprova tra {Math.ceil((resetTime - Date.now()) / 1000)} secondi
                </p>
              </div>
            )}
          </form>

          {/* Result */}
          {result && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Importo Lordo (IVA inclusa):</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{result.gross.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Importo Netto (IVA esclusa):</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{result.net.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IVA ({result.percentage}%):</p>
                <p className="text-2xl font-bold text-green-600">
                  €{result.iva.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cos&apos;è il Scorporo IVA?</h2>
              <p className="text-gray-600 mb-4">
                Lo scorporo dell&apos;IVA è l&apos;operazione di separazione dell&apos;imposta sul valore aggiunto da un importo lordo.
                È fondamentale per contabilità, fatturazioni e analisi di costi in Italia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Le Aliquote IVA in Italia</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>4% (Super ridotta):</strong> Libri, giornali, farmaci essenziali</li>
                <li><strong>5% (Ridotta):</strong> Alimenti, acqua, energia</li>
                <li><strong>10% (Intermedia):</strong> Alcuni alimenti, ristorazione</li>
                <li><strong>22% (Ordinaria):</strong> Maggior parte dei beni e servizi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Come si calcola il scorporo dall&apos;importo lordo?</h3>
                  <p className="text-gray-600">
                    Formula: IVA = (Importo Lordo × Aliquota) ÷ (100 + Aliquota). Importo Netto = Importo Lordo - IVA
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Qual è la differenza tra lordo e netto?</h3>
                  <p className="text-gray-600">
                    Lordo significa con IVA inclusa, netto significa senza IVA. Il nostro calcolatore converte tra i due.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Scopri gli Altri Calcolatori</h2>
              <ul className="list-disc list-inside text-blue-600 space-y-2">
                <li><a href="/percentuali" className="hover:underline">Calcolo Percentuali</a></li>
                <li><a href="/giorni-tra-date" className="hover:underline">Calcolo Giorni tra Date</a></li>
                <li><a href="/codice-fiscale" className="hover:underline">Calcolo Codice Fiscale</a></li>
                <li><a href="/rata-mutuo" className="hover:underline">Calcolo Rata Mutuo</a></li>
              </ul>
            </section>
          </div>
        </div>
      </Calculator>
    </>
  )
}
