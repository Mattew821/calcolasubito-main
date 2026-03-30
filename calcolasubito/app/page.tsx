import Link from 'next/link'
import { Calculator } from 'lucide-react'

const calculators = [
  { id: 'percentuali', title: 'Calcolo Percentuali', volume: 'Alto' },
  { id: 'giorni-tra-date', title: 'Giorni tra Date', volume: 'Alto' },
  { id: 'scorporo-iva', title: 'Calcolo Scorporo IVA', volume: 'Molto Alto' },
  { id: 'codice-fiscale', title: 'Calcolo Codice Fiscale', volume: 'Molto Alto' },
  { id: 'rata-mutuo', title: 'Calcolo Rata Mutuo', volume: 'Alto' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calcolatori Online Gratuiti
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Suite completa di strumenti per calcolare IVA, busta paga, mutui, codice fiscale e molto altro.
          </p>
          <p className="text-base text-gray-500">
            Tutti i calcoli sono eseguiti direttamente nel tuo browser. Nessun dato viene memorizzato.
          </p>
        </div>

        {/* Calcolatori Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {calculators.map((calc) => (
            <Link
              key={calc.id}
              href={`/${calc.id}`}
              className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {calc.volume}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Clicca per accedere al calcolatore
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stai cercando un calcolatore specifico?
          </h2>
          <p className="text-gray-600 mb-6">
            Stiamo aggiungendo continuamente nuovi calcolatori. Visita regolarmente il sito per trovare nuovi strumenti.
          </p>
        </div>
      </div>
    </div>
  )
}
