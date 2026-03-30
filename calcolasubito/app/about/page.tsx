export const metadata = {
  title: 'Chi Siamo | CalcolaSubito.it',
  description: 'Scopri la missione di CalcolaSubito.it: fornire calcolatori online gratuiti e affidabili per semplificare i calcoli quotidiani.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Chi Siamo</h1>

        <div className="bg-white rounded-lg shadow-lg p-5 md:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              La Nostra Missione
            </h2>
            <p className="text-gray-600 mb-4">
              CalcolaSubito.it nasce con un obiettivo semplice ma importante: fornire
              strumenti di calcolo online gratuiti, affidabili e facili da usare. Vogliamo
              aiutare chiunque a risolvere rapidamente i problemi di calcolo quotidiani,
              senza complicazioni.
            </p>
            <p className="text-gray-600">
              Ogni giorno migliaia di persone utilizzano i nostri calcolatori per gestire
              finanze personali, calcoli professionali e tanto altro. La nostra promessa
              è di mantenerli sempre gratuiti e accessibili a tutti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              I Nostri Calcolatori
            </h2>
            <p className="text-gray-600 mb-4">
              Attualmente offriamo 5 calcolatori specializzati:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-3 ml-2">
              <li>
                <strong>Calcolo Percentuali:</strong> Calcola percentuali, sconti e proporzioni
                in modo rapido e preciso
              </li>
              <li>
                <strong>Giorni tra Date:</strong> Conta facilmente i giorni tra due date,
                perfetto per pianificazione e scadenze
              </li>
              <li>
                <strong>Scorporo IVA:</strong> Calcola l&apos;IVA da importi lordi o netti
                con tutte le aliquote italiane
              </li>
              <li>
                <strong>Codice Fiscale:</strong> Genera il codice fiscale italiano dai dati
                anagrafici (versione semplificata)
              </li>
              <li>
                <strong>Rata Mutuo:</strong> Simula il mutuo immobiliare con ammortamento
                francese
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Perché Fidarsi di Noi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ 100% Gratuito</h3>
                <p className="text-gray-600 text-sm">
                  Tutti i nostri calcolatori sono completamente gratuiti. Nessun iscrizione,
                  nessun pagamento nascosto.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Veloce e Preciso</h3>
                <p className="text-gray-600 text-sm">
                  I calcoli vengono eseguiti istantaneamente nel tuo browser senza ritardi.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Privato e Sicuro</h3>
                <p className="text-gray-600 text-sm">
                  Non memorizziamo i tuoi dati. Tutti i calcoli rimangono sul tuo computer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Sempre Disponibile</h3>
                <p className="text-gray-600 text-sm">
                  Accedi dai tuoi dispositivi (computer, tablet, smartphone) in qualsiasi momento.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disclaimer Importante
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ Nota Legale:</strong> I calcolatori di CalcolaSubito.it forniscono
                risultati per scopi informativi e educativi. Non sono strumenti ufficiali e
                i risultati potrebbero non essere completamente accurati per scopi legali o
                fiscali.
              </p>
              <p className="text-sm text-yellow-800">
                Per decisioni importanti (fiscali, legali, finanziarie), consulta sempre un
                professionista qualificato. Noi non siamo responsabili per l&apos;uso dei
                risultati ottenuti dai nostri calcolatori.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contattaci
            </h2>
            <p className="text-gray-600 mb-4">
              Hai suggerimenti, domande o vuoi segnalare un problema? Siamo sempre aperti
              al feedback!
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:calcolasubito@gmail.com"
                className="text-blue-600 hover:underline"
              >
                calcolasubito@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Link Importanti
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookie" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/" className="text-blue-600 hover:underline">
                  Torna alla Homepage
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
