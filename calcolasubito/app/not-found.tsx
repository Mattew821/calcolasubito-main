import Link from 'next/link'

export const metadata = {
  title: '404 - Pagina non trovata | CalcolaSubito.it',
  description: 'La pagina che stai cercando non esiste',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pagina non trovata
        </h1>
        <p className="text-gray-600 mb-6">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Torna alla Home
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/percentuali"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Percentuali
            </Link>
            <Link
              href="/scorporo-iva"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              IVA
            </Link>
            <Link
              href="/codice-fiscale"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Codice Fiscale
            </Link>
            <Link
              href="/rata-mutuo"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Mutuo
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Se pensi che sia un errore, contattaci: calcolasubito@gmail.com
        </p>
      </div>
    </div>
  )
}
