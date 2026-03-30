'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import AdUnit from '@/components/AdUnit'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { useRateLimit } from '@/lib/hooks/useRateLimit'
import { codiceFiscaleSchema, type CodiceFiscaleInput, type CodiceFiscaleItalianInput, type CodiceFiscaleForeignerItalyInput } from '@/lib/validations'

type FormMode = 'italian' | 'foreigner_italy' | 'foreigner_abroad'

export default function CalcoloCodiceFiscale() {
  const today = new Date().toISOString().split('T')[0]
  const [mode, setMode] = useState<FormMode>('italian')
  const [codiceFiscale, setCodiceFiscale] = useState<string | null>(null)
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
  } = useForm<CodiceFiscaleInput>({
    resolver: zodResolver(codiceFiscaleSchema),
    defaultValues: {
      mode: 'italian',
      surname: '',
      name: '',
      birthDate: today,
      gender: 'M',
      birthPlace: '',
    },
  })

  const currentMode = watch('mode') as FormMode

  // Reset result when mode changes
  useEffect(() => {
    setCodiceFiscale(null)
  }, [currentMode])

  const onSubmit = async (data: CodiceFiscaleInput) => {
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
      if (data.mode === 'italian') {
        const italianData = data as CodiceFiscaleItalianInput
        const result = await calculate('codiceFiscale', {
          surname: italianData.surname,
          name: italianData.name,
          birthDate: italianData.birthDate,
          gender: italianData.gender,
          birthPlace: italianData.birthPlace,
        })
        setCodiceFiscale(result)
        showToast('Codice fiscale generato!', 'success')
      } else if (data.mode === 'foreigner_italy') {
        const foreignerData = data as CodiceFiscaleForeignerItalyInput
        setCodiceFiscale(foreignerData.codiceFiscale)
        showToast('Codice fiscale confermato!', 'success')
      }
    } catch (error) {
      showToast('Errore nella generazione del codice fiscale', 'error')
    }
  }

  const reset = () => {
    resetForm()
    setCodiceFiscale(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Calculator
        title="Calcolo Codice Fiscale"
        description="Calcola il codice fiscale italiano dai tuoi dati anagrafici"
      >
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-semibold mb-3">Seleziona il tuo status:</p>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="italian"
                  checked={currentMode === 'italian'}
                  {...register('mode')}
                  className="mr-3"
                />
                <span className="text-sm text-blue-800">
                  ✅ <strong>Cittadino italiano</strong> - Genera il tuo codice fiscale
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="foreigner_italy"
                  checked={currentMode === 'foreigner_italy'}
                  {...register('mode')}
                  className="mr-3"
                />
                <span className="text-sm text-blue-800">
                  🏠 <strong>Straniero residente in Italia</strong> - Ho già un codice fiscale
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="foreigner_abroad"
                  checked={currentMode === 'foreigner_abroad'}
                  {...register('mode')}
                  className="mr-3"
                />
                <span className="text-sm text-blue-800">
                  🌍 <strong>Straniero (estero)</strong> - Non ho un codice fiscale italiano
                </span>
              </label>
            </div>
          </div>

          {/* Note di Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Nota Importante:</strong> Questo calcolatore fornisce una
              stima basata sulle regole standard. Per il codice fiscale ufficiale,
              consulta l&apos;Agenzia delle Entrate.
            </p>
          </div>

          {/* Contenuto specifico per mode */}
          {currentMode === 'italian' && (
            <>
              {/* Guide Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-3">
                  <strong>💡 Come inserire i dati:</strong>
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>✓ <strong>Cognomi composti:</strong> Geraci Montanari, De Luca, Di Marino</li>
                  <li>✓ <strong>Nomi composti:</strong> Valeria Sonia, Maria Rosa, Jean Paul</li>
                  <li>✓ <strong>Nomi con vocali finali:</strong> Francisa, Laurisa, Rosalia, Alessia</li>
                  <li>✓ <strong>Usa gli spazi</strong> per separare nomi/cognomi multipli</li>
                  <li>✓ <strong>Maiuscole/minuscole:</strong> non importa, il sistema normalizza</li>
                </ul>
              </div>

              {/* Form per cittadino italiano */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cognome
                    </label>
                    <input
                      type="text"
                      {...register('surname')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        (errors as any).surname?.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Es. Rossi, Geraci Montanari, De Luca"
                    />
                    {(errors as any).surname?.message && (
                      <p className="mt-1 text-sm text-red-600">{(errors as any).surname.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        (errors as any).name?.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Es. Marco, Valeria Sonia, Francisa"
                    />
                    {(errors as any).name?.message && (
                      <p className="mt-1 text-sm text-red-600">{(errors as any).name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data di Nascita
                    </label>
                    <input
                      type="date"
                      {...register('birthDate')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        (errors as any).birthDate?.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {(errors as any).birthDate?.message && (
                      <p className="mt-1 text-sm text-red-600">{(errors as any).birthDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sesso
                    </label>
                    <select
                      {...register('gender')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        (errors as any).gender?.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    >
                      <option value="M">Maschio</option>
                      <option value="F">Femmina</option>
                    </select>
                    {(errors as any).gender?.message && (
                      <p className="mt-1 text-sm text-red-600">{(errors as any).gender.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comune di Nascita (Codice ISTAT)
                  </label>
                  <input
                    type="text"
                    {...register('birthPlace')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      (errors as any).birthPlace?.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Es. H501 (Roma)"
                  />
                  {(errors as any).birthPlace?.message && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).birthPlace.message}</p>
                  )}
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
                        Genero...
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
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
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
            </>
          )}

          {currentMode === 'foreigner_italy' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900 mb-3">
                  <strong>✅ Codice Fiscale per Stranieri Residenti</strong>
                </p>
                <p className="text-sm text-green-800 mb-3">
                  Se sei uno straniero residente in Italia, l&apos;Agenzia delle Entrate ti ha assegnato un codice fiscale.
                  Inseriscilo qui di seguito per confermarlo.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Codice Fiscale (16 caratteri)
                  </label>
                  <input
                    type="text"
                    {...register('codiceFiscale')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 uppercase ${
                      (errors as any).codiceFiscale?.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Es. RSSMRC92A01H501T"
                    maxLength={16}
                  />
                  {(errors as any).codiceFiscale?.message && (
                    <p className="mt-1 text-sm text-red-600">{(errors as any).codiceFiscale.message}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Formato: 6 lettere (cognome+nome) + 2 cifre (anno) + 1 lettera (mese) + 2 cifre (giorno) + 4 lettere (comune) + 1 lettera (controllo)
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading || isLimited}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                        Verifica...
                      </>
                    ) : isLimited ? (
                      'Limite raggiunto'
                    ) : (
                      'Conferma'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Resetta
                  </button>
                </div>
              </form>
            </>
          )}

          {currentMode === 'foreigner_abroad' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-red-900">🌍 Stranieri Residenti all&apos;Estero</h3>
              <p className="text-red-800">
                Se sei uno straniero non residente in Italia, <strong>non hai un codice fiscale italiano</strong>.
                Il codice fiscale viene assegnato solo a chi risiede in Italia (cittadini italiani e stranieri residenti).
              </p>
              <div className="space-y-3 mt-4">
                <h4 className="font-semibold text-red-900">Come ottenere un codice fiscale:</h4>
                <ol className="list-decimal list-inside text-red-800 space-y-2">
                  <li>Se ti trasferisci in Italia, registrati presso l&apos;Ufficio dell&apos;Agenzia delle Entrate</li>
                  <li>Se apri una partita IVA in Italia, verrai assegnato automaticamente</li>
                  <li>Se lavori in Italia, il tuo datore di lavoro farà la richiesta per te</li>
                </ol>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  📞 Per informazioni ufficiali: <strong>Agenzia delle Entrate</strong>
                  <br />
                  🌐 Sito: www.agenziaentrate.gov.it
                </p>
              </div>
            </div>
          )}

          {/* Ad 1 */}
          <AdUnit adSlot="1234567899" />

          {/* Result */}
          {codiceFiscale && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm mb-2">
                {currentMode === 'italian' ? 'Codice Fiscale:' : 'Codice Confermato:'}
              </p>
              <p className="text-3xl font-bold text-blue-600 font-mono tracking-widest">
                {codiceFiscale}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Copia il codice e usalo per documenti e registrazioni.
              </p>
            </div>
          )}

          {/* Info */}
          {currentMode === 'italian' && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Struttura Codice Fiscale:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  • <strong>3 caratteri (cognome)</strong>: consonanti, poi vocali
                </li>
                <li>
                  • <strong>3 caratteri (nome)</strong>: consonanti, poi vocali
                </li>
                <li>
                  • <strong>2 cifre (anno nascita)</strong>: ultimi 2 digit
                </li>
                <li>
                  • <strong>1 lettera (mese)</strong>: A-L corrispondono ai mesi
                </li>
                <li>
                  • <strong>2 cifre (giorno)</strong>: +40 per le donne
                </li>
                <li>
                  • <strong>4 caratteri (comune)</strong>: codice ISTAT
                </li>
                <li>
                  • <strong>1 carattere (control digit)</strong>: cifra di controllo
                </li>
              </ul>
            </div>
          )}

          {/* Ad 2 */}
          <AdUnit adSlot="1234567900" />

          {/* SEO Content */}
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Il Codice Fiscale Italiano</h2>
              <p className="text-gray-600 mb-4">
                Il codice fiscale è un identificativo univoco assegnato dall&apos;Agenzia delle Entrate a ogni cittadino italiano e straniero residente.
                Composto da 16 caratteri alfanumerici, è essenziale per operazioni fiscali, bancarie e amministrative.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chi ha diritto al Codice Fiscale?</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Cittadini italiani:</strong> Assegnato automaticamente</li>
                <li><strong>Stranieri residenti:</strong> Assegnato al momento della registrazione</li>
                <li><strong>Chi apre partita IVA in Italia:</strong> Assegnato automaticamente</li>
                <li><strong>Chi lavora in Italia:</strong> Assegnato dal datore di lavoro</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Funziona</h2>
              <p className="text-gray-600 mb-4">
                Il nostro calcolatore genera il codice fiscale basato sui dati personali forniti (nome, cognome, data e luogo di nascita, sesso).
                Utilizza le regole ufficiali dell&apos;Agenzia delle Entrate per creare il codice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Scopri gli Altri Calcolatori</h2>
              <ul className="list-disc list-inside text-blue-600 space-y-2">
                <li><a href="/percentuali" className="hover:underline">Calcolo Percentuali</a></li>
                <li><a href="/giorni-tra-date" className="hover:underline">Calcolo Giorni tra Date</a></li>
                <li><a href="/scorporo-iva" className="hover:underline">Calcolo Scorporo IVA</a></li>
                <li><a href="/rata-mutuo" className="hover:underline">Calcolo Rata Mutuo</a></li>
              </ul>
            </section>
          </div>
        </div>
      </Calculator>
    </>
  )
}
