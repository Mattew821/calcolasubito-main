'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import AdUnit from '@/components/AdUnit'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { giorniTraDateSchema, type GiorniTraDateInput } from '@/lib/validations'

export default function CalcoloGiorni() {
  const today = new Date().toISOString().split('T')[0]
  const [result, setResult] = useState<number | null>(null)
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
  } = useForm<GiorniTraDateInput>({
    resolver: zodResolver(giorniTraDateSchema),
    defaultValues: {
      startDate: today,
      endDate: today,
    },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const onSubmit = async (data: GiorniTraDateInput) => {
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
      const days = await calculate('daysBetween', {
        startDate: data.startDate,
        endDate: data.endDate,
      })
      setResult(days)
      showToast('Calcolo completato!', 'success')
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
        title="Calcolo Giorni tra Due Date"
        description="Scopri quanti giorni, mesi e anni passano tra due date qualsiasi"
      >
        <div className="space-y-6">
          {/* Inputs */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Inizio
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fine
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
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

          {/* Ad 1 */}
          <AdUnit adSlot="1234567895" />

          {/* Result */}
          {result !== null && (
            <div aria-live="polite" role="status" className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm mb-2">Differenza:</p>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                {result.toLocaleString('it-IT')} giorni
              </p>
              <p className="text-sm text-gray-600">
                Dal {new Date(startDate).toLocaleDateString('it-IT')} al {new Date(endDate).toLocaleDateString('it-IT')}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Come funziona:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Seleziona la data iniziale e quella finale</li>
              <li>• Clicca &quot;Calcola&quot; per ottenere il numero di giorni</li>
              <li>• Utile per vacanze, progetti, scadenze e anniversari</li>
            </ul>
          </div>

          {/* Ad 2 */}
          <AdUnit adSlot="1234567896" />

          {/* SEO Content */}
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Calcolare i Giorni tra Due Date</h2>
              <p className="text-gray-600 mb-4">
                Calcolare il numero di giorni tra due date è un&apos;operazione comune nella vita quotidiana, dai progetti di lavoro alla pianificazione delle vacanze.
                Il nostro calcolatore semplifica questo compito, fornendo risultati accurati in pochi secondi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Casi di Utilizzo</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Pianificazione vacanze:</strong> Calcola i giorni di ferie disponibili</li>
                <li><strong>Scadenze progetti:</strong> Determina il tempo rimanente per completare un progetto</li>
                <li><strong>Anniversari:</strong> Calcola quanti giorni sono passati da un evento importante</li>
                <li><strong>Gestione magazzino:</strong> Traccia il tempo di conservazione dei prodotti</li>
                <li><strong>Contratti e affitti:</strong> Calcola la durata di un periodo contrattuale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Come funziona il conteggio dei giorni?</h3>
                  <p className="text-gray-600">
                    Il calcolatore restituisce la differenza in giorni tra le due date.
                    Esempio: dal 1 gennaio al 3 gennaio il risultato è 2 giorni.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Come si calcola il numero di mesi?</h3>
                  <p className="text-gray-600">
                    Dividi il numero di giorni per 30 (media dei giorni in un mese). Per un calcolo preciso, consulta il nostro calcolatore.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Cosa sono gli anni bisestili?</h3>
                  <p className="text-gray-600">
                    Un anno bisestile ha 366 giorni invece di 365, accade ogni 4 anni. Il nostro calcolatore tiene automaticamente conto di questo.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Scopri gli Altri Calcolatori</h2>
              <ul className="list-disc list-inside text-blue-600 space-y-2">
                <li><a href="/percentuali" className="hover:underline">Calcolo Percentuali</a></li>
                <li><a href="/scorporo-iva" className="hover:underline">Calcolo Scorporo IVA</a></li>
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
