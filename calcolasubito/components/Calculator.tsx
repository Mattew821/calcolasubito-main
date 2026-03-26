'use client'

import React, { ReactNode } from 'react'

interface CalculatorProps {
  title: string
  description: string
  children: ReactNode
  keyword?: string
}

export default function Calculator({
  title,
  description,
  children,
  keyword,
}: CalculatorProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600">
            {description}
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          {children}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Come funziona?
            </h2>
            <p className="text-gray-600">
              Questo calcolatore esegue tutti i calcoli direttamente nel tuo browser.
              Nessun dato viene inviato ai nostri server o memorizzato.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Note Importanti
            </h2>
            <p className="text-gray-600">
              I risultati sono forniti a scopo informativo. Consulta un professionista
              per questioni specifiche e complesse.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
