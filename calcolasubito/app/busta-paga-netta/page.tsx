'use client'

import { useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { calculateNetSalary } from '@/lib/calculations'
import { bustaPagaNettaSchema } from '@/lib/validations'

function formatEuro(value: number): string {
  return value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function BustaPagaNettaPage() {
  const [grossAnnualSalary, setGrossAnnualSalary] = useState('35000')
  const [monthlyPayments, setMonthlyPayments] = useState('13')
  const [employeeContributionRate, setEmployeeContributionRate] = useState('9.19')
  const [regionalAdditionalRate, setRegionalAdditionalRate] = useState('1.40')
  const [municipalAdditionalRate, setMunicipalAdditionalRate] = useState('0.80')
  const [employerContributionRate, setEmployerContributionRate] = useState('30')
  const [applyIntegrativeTreatment, setApplyIntegrativeTreatment] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof calculateNetSalary> | null>(null)

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const parsedInput = bustaPagaNettaSchema.safeParse({
      grossAnnualSalary: Number(grossAnnualSalary),
      monthlyPayments: Number(monthlyPayments),
      employeeContributionRate: Number(employeeContributionRate),
      regionalAdditionalRate: Number(regionalAdditionalRate),
      municipalAdditionalRate: Number(municipalAdditionalRate),
      employerContributionRate: Number(employerContributionRate),
      applyIntegrativeTreatment,
    })

    if (!parsedInput.success) {
      const firstIssue = parsedInput.error.issues[0]
      setResult(null)
      setError(firstIssue?.message ?? 'Errore di validazione dati busta paga')
      return
    }

    try {
      const output = calculateNetSalary(parsedInput.data)
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore nel calcolo busta paga')
    }
  }

  return (
    <Calculator
      title="Calcolo Busta Paga Netta"
      description="Simula lo stipendio netto da RAL con contributi, IRPEF, detrazioni, addizionali e costo azienda."
      keyword="busta paga"
    >
      <form onSubmit={onCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="grossAnnualSalary" className="block text-sm font-medium text-gray-700 mb-2">
              RAL annua (EUR)
            </label>
            <input
              id="grossAnnualSalary"
              name="grossAnnualSalary"
              type="number"
              step="0.01"
              min="0"
              value={grossAnnualSalary}
              onChange={(event) => setGrossAnnualSalary(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="monthlyPayments" className="block text-sm font-medium text-gray-700 mb-2">
              Mensilità annue
            </label>
            <select
              id="monthlyPayments"
              name="monthlyPayments"
              value={monthlyPayments}
              onChange={(event) => setMonthlyPayments(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="employeeContributionRate" className="block text-sm font-medium text-gray-700 mb-2">
              Contributi dipendente (%)
            </label>
            <input
              id="employeeContributionRate"
              name="employeeContributionRate"
              type="number"
              step="0.01"
              min="0"
              value={employeeContributionRate}
              onChange={(event) => setEmployeeContributionRate(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="employerContributionRate" className="block text-sm font-medium text-gray-700 mb-2">
              Contributi azienda (%)
            </label>
            <input
              id="employerContributionRate"
              name="employerContributionRate"
              type="number"
              step="0.01"
              min="0"
              value={employerContributionRate}
              onChange={(event) => setEmployerContributionRate(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="regionalAdditionalRate" className="block text-sm font-medium text-gray-700 mb-2">
              Addizionale regionale (%)
            </label>
            <input
              id="regionalAdditionalRate"
              name="regionalAdditionalRate"
              type="number"
              step="0.01"
              min="0"
              value={regionalAdditionalRate}
              onChange={(event) => setRegionalAdditionalRate(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="municipalAdditionalRate" className="block text-sm font-medium text-gray-700 mb-2">
              Addizionale comunale (%)
            </label>
            <input
              id="municipalAdditionalRate"
              name="municipalAdditionalRate"
              type="number"
              step="0.01"
              min="0"
              value={municipalAdditionalRate}
              onChange={(event) => setMunicipalAdditionalRate(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            id="applyIntegrativeTreatment"
            name="applyIntegrativeTreatment"
            type="checkbox"
            checked={applyIntegrativeTreatment}
            onChange={(event) => setApplyIntegrativeTreatment(event.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          Applica trattamento integrativo (stima automatica)
        </label>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcola busta paga netta
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-lg p-5 space-y-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Netto mensile stimato</p>
              <p className="text-3xl font-bold text-cyan-700">{formatEuro(result.netMonthlySalary)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Netto annuo stimato</p>
              <p className="text-3xl font-bold text-cyan-700">{formatEuro(result.netAnnualSalary)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">RAL mensile lorda:</span> {formatEuro(result.grossMonthlySalary)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Contributi dipendente:</span> {formatEuro(result.employeeContributionsAnnual)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Imponibile fiscale:</span> {formatEuro(result.taxableIncomeAnnual)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">IRPEF lorda:</span> {formatEuro(result.irpefGrossAnnual)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Detrazioni lavoro:</span> {formatEuro(result.employeeDetractionAnnual)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">IRPEF netta:</span> {formatEuro(result.irpefNetAnnual)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Addizionali totali:</span> {formatEuro(result.additionalTaxesAnnual)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Trattamento integrativo:</span> {formatEuro(result.integrativeTreatmentAnnual)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-white border border-cyan-200 p-4">
              <p className="text-sm text-gray-600">Contributi azienda annui</p>
              <p className="text-xl font-semibold text-cyan-700">{formatEuro(result.employerContributionsAnnual)}</p>
            </div>
            <div className="rounded-lg bg-white border border-cyan-200 p-4">
              <p className="text-sm text-gray-600">Costo azienda annuo stimato</p>
              <p className="text-xl font-semibold text-cyan-700">{formatEuro(result.companyCostAnnual)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Simulazione orientativa: le buste paga reali dipendono da contratto, bonus, detrazioni specifiche e normativa aggiornata.
      </div>

      <AdUnit adSlot="1234567918" />
    </Calculator>
  )
}
