import React from 'react'
import { LEGAL_LAST_UPDATED_LABEL } from '@/lib/legal'

export const metadata = {
  title: 'Cookie Policy | CalcolaSubito',
  description: 'Informativa sui cookie di CalcolaSubito',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

        <div className="bg-white rounded-lg shadow-lg p-5 md:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Cosa sono i Cookie?
            </h2>
            <p className="text-gray-600">
              I cookie sono piccoli file di testo memorizzati nel tuo browser. Vengono
              utilizzati per ricordare le tue preferenze e analizzare come utilizzi il sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Cookie Utilizzati
            </h2>
            <p className="text-gray-600 mb-4">
              <strong>Google Analytics:</strong> Utilizziamo Google Analytics per
              comprendere come i nostri utenti interagiscono con il sito.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>_ga - Identifica il visitatore unico</li>
              <li>_ga_* - Contiene ID sessione e numero di pagina</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Gestione dei Cookie
            </h2>
            <p className="text-gray-600 mb-4">
              Puoi controllare i cookie tramite le impostazioni del tuo browser:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Chrome: Impostazioni, Privacy e sicurezza, Cookie e dati sito</li>
              <li>Firefox: Opzioni, Privacy, Cookie e cronologia del sito</li>
              <li>Safari: Preferenze, Privacy, Gestisci dati dei siti web</li>
              <li>Edge: Impostazioni, Privacy, Cookie e autorizzazioni</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Cookie di Terze Parti
            </h2>
            <p className="text-gray-600 mb-4">
              Google Analytics &egrave; gestito da Google secondo la loro Privacy Policy.
              Consulta la{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy di Google
              </a>{' '}
              per dettagli.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Cookie Disabilitati
            </h2>
            <p className="text-gray-600">
              Se disabiliti i cookie, il sito continuer&agrave; a funzionare normalmente.
              Solo le funzioni analitiche non saranno disponibili.
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

