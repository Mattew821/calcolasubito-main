'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import { ShareButtons } from '@/components/ShareButtons'
import AdUnit from '@/components/AdUnit'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { percentualiSchema, type PercentualiInput } from '@/lib/validations'

export default function CalcoloPercentuali() {
  const [mode, setMode] = useState<'calculate' | 'percentage-of'>('calculate')
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
  } = useForm<PercentualiInput>({
    resolver: zodResolver(percentualiSchema),
    defaultValues: {
      number: 100,
      percentage: 20,
    },
  })

  const number = watch('number')
  const percentage = watch('percentage')

  const onSubmit = async (data: PercentualiInput) => {
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
      if (mode === 'calculate') {
        const res = await calculate('percentage', {
          number: data.number,
          percentage: data.percentage,
        })
        setResult(res)
        showToast('Calcolo completato!', 'success')
      } else {
        const res = await calculate('percentageOf', {
          part: data.number,
          total: data.percentage,
        })
        setResult(res)
        showToast('Calcolo completato!', 'success')
      }
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
        title="Calcolo Percentuali"
        description="Calcola facilmente percentuali, sconti e proporzioni"
      >
        <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="calculate"
              checked={mode === 'calculate'}
              onChange={(e) => setMode(e.target.value as 'calculate')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Qual è il {percentage}% di {number}?
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="percentage-of"
              checked={mode === 'percentage-of'}
              onChange={(e) => setMode(e.target.value as 'percentage-of')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              {number} è quale percentuale di {percentage}?
            </span>
          </label>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'calculate' ? 'Numero' : 'Parte'}
              </label>
              <input
                type="number"
                step="0.01"
                {...register('number', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Inserisci numero"
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'calculate' ? 'Percentuale (%)' : 'Numero base'}
              </label>
              <input
                type="number"
                step="0.01"
                {...register('percentage', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.percentage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Inserisci percentuale"
              />
              {errors.percentage && (
                <p className="mt-1 text-sm text-red-600">{errors.percentage.message}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading || isLimited}
              aria-busy={isLoading}
              aria-label={isLoading ? 'Calcolo in corso' : isLimited ? 'Limite di calcoli raggiunto' : 'Calcola percentuale'}
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
        <AdUnit adSlot="1234567893" />

        {/* Result */}
        {result !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Risultato:</p>
            <p className="text-4xl font-bold text-blue-600">
              {result.toLocaleString('it-IT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {mode === 'calculate' && (
              <p className="text-sm text-gray-600 mt-2">
                Il {percentage}% di {number} è{' '}
                <span className="font-semibold">{result.toFixed(2)}</span>
              </p>
            )}
            {mode === 'percentage-of' && (
              <p className="text-sm text-gray-600 mt-2">
                {number} è il{' '}
                <span className="font-semibold">{result.toFixed(2)}%</span> di{' '}
                {percentage}
              </p>
            )}
            {/* Share Buttons */}
            {result !== null && (
              <ShareButtons
                title="Calcolo Percentuali - CalcolaSubito.it"
                description="Ho appena calcolato una percentuale con questo tool gratuito. Prova anche tu!"
              />
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Esempi:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Qual è il 20% di 100? Risposta: 20</li>
            <li>• Qual è il 15% di 200? Risposta: 30</li>
            <li>• 50 è quale percentuale di 200? Risposta: 25%</li>
          </ul>
        </div>

        {/* Ad 2 */}
        <AdUnit adSlot="1234567894" />

        {/* SEO Content Section */}
        <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Funziona il Calcolo Percentuale</h2>
            <p className="text-gray-600 mb-4">
              Una percentuale rappresenta una proporzione espressa su una scala di 100. Viene utilizzata quotidianamente
              per calcolare sconti nei negozi, tasse, interessi bancari, aumenti stipendiali e molti altri valori.
            </p>
            <p className="text-gray-600">
              Il nostro calcolatore percentuale permette di ottenere risultati in millisecondi, eliminando il rischio
              di errori di calcolo e risparmiando tempo prezioso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">La Formula Matematica</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <p className="font-mono text-lg text-blue-900 text-center mb-2">
                Percentuale = (Numero × Percentuale) ÷ 100
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              <strong>Esempio pratico:</strong> Vuoi calcolare il 20% di 150. Applichi la formula:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>150 × 20 = 3.000</li>
              <li>3.000 ÷ 100 = 30</li>
              <li><strong>Risultato: Il 20% di 150 è 30</strong></li>
            </ul>
            <p className="text-gray-600">
              <strong>Per il calcolo inverso</strong> (quale percentuale è un numero rispetto a un altro):
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
              <p className="font-mono text-lg text-blue-900 text-center">
                Percentuale = (Numero ÷ Totale) × 100
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Casi di Utilizzo Comuni</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Sconti nei negozi:</strong> Un prodotto costa 100€ con sconto 30%. Risparmio: 30€, prezzo finale: 70€</li>
              <li><strong>Margine di profitto:</strong> Calcola il markup su costi di produzione</li>
              <li><strong>Aumenti stipendiali:</strong> Un aumento del 5% su 2.000€ = 100€ in più</li>
              <li><strong>Voti scolastici:</strong> Se hai risposto 45 domande su 50, la percentuale è 90%</li>
              <li><strong>Tasse:</strong> Calcola l&apos;IVA o altre aliquote percentuali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📌 Come calcolare uno sconto percentuale?</h3>
                <p className="text-gray-600">
                  Calcola la percentuale del prezzo originale, poi sottrai dal totale. Esempio: prezzo 100€, sconto 20%.
                  Sconto = 100 × 20 ÷ 100 = 20€. Prezzo finale = 100 - 20 = 80€.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📌 Quale percentuale è 15 su 60?</h3>
                <p className="text-gray-600">
                  Dividi 15 per 60 e moltiplica per 100: (15 ÷ 60) × 100 = 25%. Quindi 15 è il 25% di 60.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📌 Come calcolo un aumento percentuale?</h3>
                <p className="text-gray-600">
                  Se un valore è 100 e aumenta del 10%, il nuovo valore è 100 + (100 × 10 ÷ 100) = 110.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scopri gli Altri Calcolatori</h2>
            <ul className="list-disc list-inside text-blue-600 space-y-2">
              <li><a href="/giorni-tra-date" className="hover:underline">Calcolo Giorni tra Date</a></li>
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
