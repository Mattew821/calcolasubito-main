'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import {
  calculateGrossFromNet,
  calculateNetFromGross,
} from '@/lib/calculations'

interface IVAResult {
  net: number
  vat: number
  gross: number
}

export default function CalcoloScorporoIVA() {
  const [mode, setMode] = useState<'gross-to-net' | 'net-to-gross'>(
    'gross-to-net'
  )
  const [amount, setAmount] = useState<number>(1000)
  const [vatRate, setVatRate] = useState<number>(22)
  const [result, setResult] = useState<IVAResult | null>(null)

  const handleCalculate = () => {
    if (mode === 'gross-to-net') {
      const res = calculateNetFromGross(amount, vatRate)
      setResult(res)
    } else {
      const res = calculateGrossFromNet(amount, vatRate)
      setResult(res)
    }
  }

  const reset = () => {
    setAmount(1000)
    setVatRate(22)
    setResult(null)
  }

  const commonRates = [4, 5, 10, 22]

  return (
    <Calculator
      title="Calcolo Scorporo IVA"
      description="Scorporo e calcolo dell'IVA da importi lordi e netti"
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="gross-to-net"
              checked={mode === 'gross-to-net'}
              onChange={(e) =>
                setMode(e.target.value as 'gross-to-net')
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Da lordo a netto (scorporo)
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="net-to-gross"
              checked={mode === 'net-to-gross'}
              onChange={(e) =>
                setMode(e.target.value as 'net-to-gross')
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Da netto a lordo (applicazione)
            </span>
          </label>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'gross-to-net' ? 'Importo Lordo' : 'Importo Netto'} (€)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci importo"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aliquota IVA (%)
            </label>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {commonRates.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}%
                </option>
              ))}
              <option value="0">Personalizzata</option>
            </select>
            {!commonRates.includes(vatRate) && (
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                placeholder="Inserisci aliquota"
                step="0.01"
              />
            )}
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
        {result && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Imponibile</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.net.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">IVA</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {result.vat.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Totale</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {result.gross.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            Aliquote IVA Comuni in Italia:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>4%</strong> - Generi alimentari di base</li>
            <li>• <strong>5%</strong> - Medicinali, trasporti</li>
            <li>• <strong>10%</strong> - Ristorazione, alloggio</li>
            <li>• <strong>22%</strong> - Aliquota ordinaria (standard)</li>
          </ul>
        </div>
      </div>
    </Calculator>
  )
}
