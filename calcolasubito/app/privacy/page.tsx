import React from 'react'
import { LEGAL_LAST_UPDATED_LABEL } from '@/lib/legal'

export const metadata = {
  title: 'Privacy Policy | CalcolaSubito',
  description: 'Informativa sulla privacy di CalcolaSubito',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-lg p-5 md:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Informazioni su CalcolaSubito
            </h2>
            <p className="text-gray-600 mb-4">
              CalcolaSubito &egrave; un sito web che fornisce strumenti di calcolo online
              gratuiti. Questa privacy policy descrive come trattiamo i dati personali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Dati Raccolti
            </h2>
            <p className="text-gray-600 mb-4">
              <strong>Dati di calcolo:</strong> I calcoli eseguiti tramite i nostri
              strumenti vengono elaborati esclusivamente nel tuo browser. Non memorizziamo
              i dati che inserisci.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Dati di navigazione:</strong> Raccogliamo dati statistici anonimizzati
              tramite Google Analytics:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Indirizzo IP (anonimizzato)</li>
              <li>Tipo di browser</li>
              <li>Pagine visitate</li>
              <li>Durata della sessione</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Cookie
            </h2>
            <p className="text-gray-600 mb-4">
              Utilizziamo cookie esclusivamente per analitiche (Google Analytics).
              Consulta la nostra Cookie Policy per dettagli.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Diritti dell'Utente
            </h2>
            <p className="text-gray-600 mb-4">Hai il diritto di:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Accedere ai tuoi dati personali</li>
              <li>Rettificare dati inesatti</li>
              <li>Richiedere la cancellazione dei dati</li>
              <li>Opporti al trattamento dei dati</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Contatti
            </h2>
            <p className="text-gray-600">
              Per domande sulla privacy, contattaci via email.
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Ultima modifica:</strong> {LEGAL_LAST_UPDATED_LABEL}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

