'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
        <div className="text-5xl sm:text-6xl mb-4" aria-hidden="true">!</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Qualcosa e andato storto</h1>
        <p className="text-gray-600 mb-2">Si e verificato un errore inaspettato</p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded break-all">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Riprova
          </button>
          <Link
            href="/"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-center"
          >
            Home
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-4">ID errore: {error.digest}</p>
      </div>
    </div>
  )
}
