'use client'

import { useState } from 'react'
import Calculator from '@/components/Calculator'
import { Toast, useToast } from '@/components/Toast'
import {
  calculateGrossFromNet,
  calculateNetFromGross,
} from '@/lib/calculations'

interface IVAResult {
  gross: number
  net: number
  iva: number
  percentage: number
}

export default function ScorporoIVA() {
  const [mode, setMode] = useState<'gross' | 'net'>('gross')
  const [amount, setAmount] = useState<number>(100)
  const [ivaRate, setIvaRate] = useState<number>(22)
  const [result, setResult] = useState<IVAResult | null>(null)
  const { toast, showToast } = useToast()

  const handleCalculate = () => {
    if (amount <= 0) {
      showToast('Inserisci un importo valido', 'error')
      return
    }

    try {
      let ivaResult: IVAResult

      if (mode === 'gross') {
        const ivaAmount = (amount * ivaRate) / (100 + ivaRate)
        const netAmount = amount - ivaAmount
        ivaResult = {
          gross: amount,
          net: netAmount,
          iva: ivaAmount,
          percentage: ivaRate,
        }
      } else {
        const ivaAmount = (amount * ivaRate) / 100
        const grossAmount = amount + ivaAmount
        ivaResult = {
          gross: grossAmount,
          net: amount,
          iva: ivaAmount,
          percentage: ivaRate,
        }
      }

      setResult(ivaResult)
      showToast('Calcolo IVA completato!', 'success')
    } catch (error) {
      showToast('Errore nel calcolo', 'error')
    }
  }

  const reset = () => {
    setAmount(100)
    setIvaRate(22)
    setResult(null)
    showToast('Valori resettati', 'info')
  }

  const commonRates = [
    { label: 'Ridotta (4%)', value: 4 },
    { label: 'Agevolata (5%)', value: 5 },
    { label: 'Ordinaria (22%)', value: 22 },
  ]

  return (
    <>
      {toast && <Toast {...toast} />}
      <Calculator
        title="Calcolo Scorporo IVA"
        description="Calcola l&apos;IVA da un importo lordo o l&apos;importo netto"
      >
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="gross"
                checked={mode === 'gross'}
                onChange={(e) => setMode(e.target.value as 'gross')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Ho l&apos;importo lordo (IVA inclusa)
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="net"
                checked={mode === 'net'}
                onChange={(e) => setMode(e.target.value as 'net')}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Ho l&apos;importo netto (IVA esclusa)
              </span>
            </label>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Importo {mode === 'gross' ? 'Lordo' : 'Netto'} (€)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Inserisci importo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aliquota IVA (%)
              </label>
              <input
                type="number"
                value={ivaRate}
                onChange={(e) => setIvaRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Inserisci aliquota"
              />
            </div>
          </div>

          {/* Quick IVA rates */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Aliquote comuni:
            </label>
            <div className="flex gap-2 flex-wrap">
              {commonRates.map((rate) => (
                <button
                  key={rate.value}
                  onClick={() => setIvaRate(rate.value)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-blue-500 hover:text-white rounded transition-colors"
                >
                  {rate.label}
                </button>
              ))}
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Importo Lordo (IVA inclusa):</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{result.gross.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Importo Netto (IVA esclusa):</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{result.net.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IVA ({result.percentage}%):</p>
                <p className="text-2xl font-bold text-green-600">
                  €{result.iva.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cos&apos;è il Scorporo IVA?</h2>
              <p className="text-gray-600 mb-4">
                Lo scorporo dell&apos;IVA è l&apos;operazione di separazione dell&apos;imposta sul valore aggiunto da un importo lordo.
                È fondamentale per contabilità, fatturazioni e analisi di costi in Italia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Le Aliquote IVA in Italia</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>4% (Super ridotta):</strong> Libri, giornali, farmaci essenziali</li>
                <li><strong>5% (Ridotta):</strong> Alimenti, acqua, energia</li>
                <li><strong>10% (Intermedia):</strong> Alcuni alimenti, ristorazione</li>
                <li><strong>22% (Ordinaria):</strong> Maggior parte dei beni e servizi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Domande Frequenti</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Come si calcola il scorporo dall&apos;importo lordo?</h3>
                  <p className="text-gray-600">
                    Formula: IVA = (Importo Lordo × Aliquota) ÷ (100 + Aliquota). Importo Netto = Importo Lordo - IVA
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📌 Qual è la differenza tra lordo e netto?</h3>
                  <p className="text-gray-600">
                    Lordo significa con IVA inclusa, netto significa senza IVA. Il nostro calcolatore converte tra i due.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Scopri gli Altri Calcolatori</h2>
              <ul className="list-disc list-inside text-blue-600 space-y-2">
                <li><a href="/percentuali" className="hover:underline">Calcolo Percentuali</a></li>
                <li><a href="/giorni-tra-date" className="hover:underline">Calcolo Giorni tra Date</a></li>
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
