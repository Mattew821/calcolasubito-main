'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import { calculateMortgage, type MortgageCalculation } from '@/lib/calculations'

export default function CalcoloRataMutuo() {
  const [principal, setPrincipal] = useState<number>(200000)
  const [annualRate, setAnnualRate] = useState<number>(4.5)
  const [years, setYears] = useState<number>(25)
  const [result, setResult] = useState<MortgageCalculation | null>(null)

  const months = years * 12

  const handleCalculate = () => {
    if (principal <= 0 || annualRate < 0 || years <= 0) {
      alert('Inserisci valori validi positivi')
      return
    }

    const res = calculateMortgage(principal, annualRate, months)
    setResult(res)
  }

  const reset = () => {
    setPrincipal(200000)
    setAnnualRate(4.5)
    setYears(25)
    setResult(null)
  }

  return (
    <Calculator
      title="Calcolo Rata Mutuo"
      description="Calcola la rata mensile del mutuo e visualizza l'ammortamento"
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importo Mutuo (€)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Es. 200000"
              step="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasso di Interesse (% annuo)
            </label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Es. 4.5"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durata (anni)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Es. 25"
              step="1"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Durata totale:</strong> {months} rate mensili ({years} anni)
          </p>
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
        {result && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-blue-600 mb-1">Rata Mensile</p>
                <p className="text-3xl font-bold text-blue-900">
                  {result.monthlyPayment.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-6">
                <p className="text-sm text-indigo-600 mb-1">Interessi Totali</p>
                <p className="text-3xl font-bold text-indigo-900">
                  {result.totalInterest.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                <p className="text-sm text-purple-600 mb-1">Totale da Pagare</p>
                <p className="text-3xl font-bold text-purple-900">
                  {result.totalAmountPaid.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
            </div>

            {/* Amortization Table Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Primo anno di ammortamento
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">
                        Mese
                      </th>
                      <th className="px-4 py-2 text-right text-gray-700 font-medium">
                        Rata
                      </th>
                      <th className="px-4 py-2 text-right text-gray-700 font-medium">
                        Capitale
                      </th>
                      <th className="px-4 py-2 text-right text-gray-700 font-medium">
                        Interessi
                      </th>
                      <th className="px-4 py-2 text-right text-gray-700 font-medium">
                        Residuo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.amortizationSchedule.slice(0, 12).map((row) => (
                      <tr key={row.month} className="border-t border-gray-200">
                        <td className="px-4 py-2 text-gray-900">
                          {row.month}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {row.payment.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {row.principal.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {row.interest.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">
                          {row.balance.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Informazioni:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Questo calcolatore usa il metodo di ammortamento francese</li>
            <li>• I tassi variano in base alla banca e alla situazione personale</li>
            <li>• Non include imposte, assicurazioni o altre spese accessorie</li>
            <li>
              • Contatta la tua banca per un preventivo personalizzato
            </li>
          </ul>
        </div>
      </div>
    </Calculator>
  )
}
