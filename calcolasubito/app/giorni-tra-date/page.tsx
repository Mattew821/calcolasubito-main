'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import { Toast, useToast } from '@/components/Toast'
import { calculateDaysBetween } from '@/lib/calculations'

export default function CalcoloGiorni() {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)
  const [result, setResult] = useState<number | null>(null)
  const { toast, showToast } = useToast()

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      showToast('Seleziona entrambe le date', 'error')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      showToast('La data iniziale deve essere prima della data finale', 'warning')
      return
    }

    try {
      const days = calculateDaysBetween(new Date(startDate), new Date(endDate))
      setResult(days)
      showToast('Calcolo completato!', 'success')
    } catch (error) {
      showToast('Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    setStartDate(today)
    setEndDate(today)
    setResult(null)
    showToast('Valori resettati', 'info')
  }

  return (
    <>
      {toast && <Toast {...toast} />}
      <Calculator
        title="Calcolo Giorni tra Due Date"
        description="Scopri quanti giorni, mesi e anni passano tra due date qualsiasi"
      >
        <div className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Inizio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fine
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          {result !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
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
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Il calcolatore include entrambe le date?</h3>
                  <p className="text-gray-600">
                    Sì, il calcolo include sia la data iniziale che quella finale nel conteggio dei giorni.
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
