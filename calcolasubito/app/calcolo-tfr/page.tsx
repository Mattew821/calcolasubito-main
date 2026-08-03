'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateTfr } from '@/lib/calculations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
}

export default function CalcoloTfrPage() {
  const [grossAnnualSalary, setGrossAnnualSalary] = useState('30000')
  const [yearsOfService, setYearsOfService] = useState('5')
  const [monthsOfService, setMonthsOfService] = useState('0')
  const [inflationRate, setInflationRate] = useState('2')
  const [socialSecurityContribution, setSocialSecurityContribution] = useState('0.5')
  const [severancePay, setSeverancePay] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateTfr> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const output = calculateTfr({
        grossAnnualSalary: Number(grossAnnualSalary),
        yearsOfService: Number(yearsOfService),
        monthsOfService: Number(monthsOfService),
        inflationRate: Number(inflationRate),
        socialSecurityContribution: Number(socialSecurityContribution),
        severancePay: Number(severancePay)
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore di calcolo')
    }
  }

  return (
    <Calculator title="Calcolo TFR" description="Calcola il Trattamento di Fine Rapporto con rivalutazione e trattenute.">
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stipendio annuo lordo (EUR)</label>
            <input type="number" step="100" value={grossAnnualSalary} onChange={(e) => setGrossAnnualSalary(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anni di servizio</label>
            <input type="number" step="0.5" value={yearsOfService} onChange={(e) => setYearsOfService(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mesi di servizio</label>
            <input type="number" step="1" min="0" max="11" value={monthsOfService} onChange={(e) => setMonthsOfService(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inflazione annua (%)</label>
            <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contributo INPS (%)</label>
            <input type="number" step="0.1" value={socialSecurityContribution} onChange={(e) => setSocialSecurityContribution(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anticipi TFR (EUR)</label>
            <input type="number" step="100" value={severancePay} onChange={(e) => setSeverancePay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Calcola TFR
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3" role="status" aria-live="polite">
          <div>
            <p className="text-sm text-gray-600">TFR lordo maturato</p>
            <p className="text-2xl font-bold text-blue-700">{formatEuro(result.tfrGross)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">TFR netto</p>
              <p className="font-semibold">{formatEuro(result.tfrNet)}</p>
            </div>
            <div>
              <p className="text-gray-600">Rivalutazione inflazione</p>
              <p className="font-semibold">{formatEuro(result.inflationAdjustment)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Trattenute totali</p>
              <p className="font-semibold">{formatEuro(result.totalWithholding)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Nota: calcolo indicativo (art. 2120 c.c.). Accantonamento = retribuzione / 13.5 (al netto quota INPS 0,5%). Rivalutazione annuale = 1,5% fisso + 75% inflazione ISTAT. Tassazione finale: 17% sulla rivalutazione, 23%/35% sul resto (imposta sostitutiva DLgs 47/2000). Non sostituisce il calcolo ufficiale.
          </p>
        </div>
      )}

      <AdUnit adSlot="calcolo-tfr" />
    </Calculator>
  )
}