'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Calculator from '@/components/Calculator'
import { ToastContainer, useToast } from '@/components/Toast'
import { useCalculatorWorker } from '@/hooks/useCalculatorWorker'
import { codiceFiscaleSchema, type CodiceFiscaleInput } from '@/lib/validations'

export default function CalcoloCodiceFiscale() {
  const today = new Date().toISOString().split('T')[0]
  const [codiceFiscale, setCodiceFiscale] = useState<string | null>(null)
  const { toasts, showToast, removeToast } = useToast()
  const { calculate, isLoading } = useCalculatorWorker()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<CodiceFiscaleInput>({
    resolver: zodResolver(codiceFiscaleSchema),
    defaultValues: {
      surname: '',
      name: '',
      birthDate: today,
      gender: 'M',
      birthPlace: '',
    },
  })

  const onSubmit = async (data: CodiceFiscaleInput) => {
    try {
      const result = await calculate('codiceFiscale', {
        surname: data.surname,
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender,
      })
      setCodiceFiscale(result)
      showToast('Codice fiscale generato!', 'success')
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
          {/* Note di Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Nota Importante:</strong> Questo calcolatore fornisce una
              stima basata sulle regole standard. Per il codice fiscale ufficiale,
              consulta l&apos;Agenzia delle Entrate.
            </p>
          </div>

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

          {/* Inputs */}
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
                    errors.surname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Es. Rossi, Geraci Montanari, De Luca"
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
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
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Es. Marco, Valeria Sonia, Francisa"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
                    errors.birthDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sesso
                </label>
                <select
                  {...register('gender')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="M">Maschio</option>
                  <option value="F">Femmina</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
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
                  errors.birthPlace ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Es. H501 (Roma)"
              />
              {errors.birthPlace && (
                <p className="mt-1 text-sm text-red-600">{errors.birthPlace.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
              aria-busy={isLoading}
              aria-label={isLoading ? "Calcolo in corso" : "Calcola"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                    Genero...
                  </>
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
          </form>

          {/* Result */}
          {codiceFiscale && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm mb-2">Codice Fiscale:</p>
              <p className="text-3xl font-bold text-blue-600 font-mono tracking-widest">
                {codiceFiscale}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Copia il codice e usalo per documenti e registrazioni.
              </p>
            </div>
          )}

          {/* Info */}
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

          {/* SEO Content */}
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Il Codice Fiscale Italiano</h2>
              <p className="text-gray-600 mb-4">
                Il codice fiscale è un identificativo univoco assegnato dall&apos;Agenzia delle Entrate a ogni cittadino italiano.
                Composto da 16 caratteri alfanumerici, è essenziale per operazioni fiscali, bancarie e amministrative.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Come Funziona</h2>
              <p className="text-gray-600 mb-4">
                Il nostro calcolatore genera il codice fiscale basato sui dati personali forniti (nome, cognome, data e luogo di nascita, sesso).
                Utilizza le regole ufficiali dell&apos;Agenzia delle Entrate per creare il codice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestione Nomi e Cognomi Composti</h2>
              <p className="text-gray-600 mb-4">
                Il calcolatore è stato progettato per gestire correttamente i vari formati di nomi e cognomi italiani:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Formati Supportati:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <strong>Cognomi composti:</strong> Geraci Montanari, De Luca, Di Marino, Von Neurath
                    <br />
                    <span className="text-sm text-gray-500">Il sistema estrae consonanti da tutti i cognomi in ordine</span>
                  </li>
                  <li>
                    <strong>Nomi composti:</strong> Valeria Sonia, Maria Rosa, Jean Paul, Anna Francesca
                    <br />
                    <span className="text-sm text-gray-500">Applica la regola ufficiale di skip della 4ª consonante se presenti &gt;3</span>
                  </li>
                  <li>
                    <strong>Nomi con vocali finali:</strong> Francisa, Laurisa, Rosalia, Alessia, Giulia
                    <br />
                    <span className="text-sm text-gray-500">Include correttamente le vocali per nomi terminanti in -isa, -ia, -ella</span>
                  </li>
                  <li>
                    <strong>Varianti maiuscole/minuscole:</strong> ROSSI, rossi, Rossi
                    <br />
                    <span className="text-sm text-gray-500">Normalizza automaticamente a maiuscole</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-600">
                Quando inserisci nomi o cognomi multipli, separa sempre con uno <strong>spazio</strong>. Il sistema elaborerà
                automaticamente tutte le consonanti e vocali secondo le regole ufficiali dell&apos;Agenzia delle Entrate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Usi del Codice Fiscale</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Dichiarazioni dei redditi (730, modello Redditi)</li>
                <li>Apertura conti bancari e operazioni finanziarie</li>
                <li>Contratti di lavoro e registrazioni INPS</li>
                <li>Acquisto immobili e registrazione catastale</li>
                <li>Iscrizione all&apos;università e servizi pubblici</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Il codice fiscale ha una scadenza?</h3>
                  <p className="text-gray-600">
                    No, il codice fiscale non scade mai. È valido per tutta la vita e rimane lo stesso dal momento dell&apos;assegnazione.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Cos&apos;è il control digit (ultimo carattere)?</h3>
                  <p className="text-gray-600">
                    È una cifra di controllo calcolata in base ai 15 caratteri precedenti, utile per verificare la correttezza del codice.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Come ottengo il codice fiscale ufficiale?</h3>
                  <p className="text-gray-600">
                    Contatta l&apos;Agenzia delle Entrate più vicina oppure richiedilo online sul sito dell&apos;Agenzia.
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
                <li><a href="/rata-mutuo" className="hover:underline">Calcolo Rata Mutuo</a></li>
              </ul>
            </section>
          </div>
        </div>
      </Calculator>
    </>
  )
}
