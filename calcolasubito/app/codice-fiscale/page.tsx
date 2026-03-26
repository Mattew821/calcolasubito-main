'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import { Toast, useToast } from '@/components/Toast'
import { calculateCodiceFiscale } from '@/lib/calculations'

export default function CalcoloCodiceFiscale() {
  const today = new Date().toISOString().split('T')[0]
  const [surname, setSurname] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>(today)
  const [gender, setGender] = useState<'M' | 'F'>('M')
  const [birthPlace, setBirthPlace] = useState<string>('')
  const [codiceFiscale, setCodiceFiscale] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const handleCalculate = () => {
    if (!surname.trim() || !name.trim()) {
      showToast('Inserisci nome e cognome', 'error')
      return
    }

    const result = calculateCodiceFiscale(
      surname,
      name,
      new Date(birthDate),
      gender,
      birthPlace
    )
    setCodiceFiscale(result)
    showToast('Codice fiscale generato!', 'success')
  }

  const reset = () => {
    setSurname('')
    setName('')
    setBirthDate(today)
    setGender('M')
    setBirthPlace('')
    setCodiceFiscale(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      {toast && <Toast {...toast} />}
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

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cognome
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. Rossi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Es. Marco"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data di Nascita
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sesso
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comune di Nascita (Codice ISTAT)
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Es. H501 (Roma)"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calcola
            </button>
            <button
              onClick={reset}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            >
              Resetta
            </button>
          </div>

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
