'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Calculator from '@/components/Calculator'
import AdUnit from '@/components/AdUnit'
import { runEnigmaCipher, type EnigmaMachineResult } from '@/lib/calculations'
import { enigmaSchema } from '@/lib/validations'

const ROTOR_OPTIONS = ['I', 'II', 'III', 'IV', 'V'] as const
const REFLECTOR_OPTIONS = ['B', 'C'] as const

function formatInFiveGroups(value: string): string {
  const onlyLetters = value.replace(/[^A-Z]/g, '')
  if (!onlyLetters) {
    return ''
  }
  const groups = onlyLetters.match(/.{1,5}/g)
  return groups ? groups.join(' ') : onlyLetters
}

export default function CifrarioEnigmaPage() {
  const [text, setText] = useState('ATTACCO ALL ALBA')
  const [rotorLeft, setRotorLeft] = useState<(typeof ROTOR_OPTIONS)[number]>('I')
  const [rotorMiddle, setRotorMiddle] = useState<(typeof ROTOR_OPTIONS)[number]>('II')
  const [rotorRight, setRotorRight] = useState<(typeof ROTOR_OPTIONS)[number]>('III')
  const [ringLeft, setRingLeft] = useState('1')
  const [ringMiddle, setRingMiddle] = useState('1')
  const [ringRight, setRingRight] = useState('1')
  const [positionLeft, setPositionLeft] = useState('A')
  const [positionMiddle, setPositionMiddle] = useState('A')
  const [positionRight, setPositionRight] = useState('A')
  const [reflector, setReflector] = useState<(typeof REFLECTOR_OPTIONS)[number]>('B')
  const [plugboardPairs, setPlugboardPairs] = useState('AB CD EF')
  const [preserveNonLetters, setPreserveNonLetters] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<EnigmaMachineResult | null>(null)

  const groupedOutput = useMemo(() => {
    if (!result) {
      return ''
    }
    return formatInFiveGroups(result.output)
  }, [result])

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const parsed = enigmaSchema.safeParse({
      text,
      rotorLeft,
      rotorMiddle,
      rotorRight,
      ringLeft: Number(ringLeft),
      ringMiddle: Number(ringMiddle),
      ringRight: Number(ringRight),
      positionLeft,
      positionMiddle,
      positionRight,
      reflector,
      plugboardPairs,
      preserveNonLetters,
    })

    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      setResult(null)
      setError(issue?.message ?? 'Input non valido')
      return
    }

    try {
      const output = runEnigmaCipher({
        text: parsed.data.text,
        rotors: [parsed.data.rotorLeft, parsed.data.rotorMiddle, parsed.data.rotorRight],
        ringSettings: [parsed.data.ringLeft, parsed.data.ringMiddle, parsed.data.ringRight],
        positions: [parsed.data.positionLeft, parsed.data.positionMiddle, parsed.data.positionRight],
        reflector: parsed.data.reflector,
        plugboardPairs: parsed.data.plugboardPairs,
        preserveNonLetters: parsed.data.preserveNonLetters,
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Errore durante la cifratura Enigma')
    }
  }

  const useOutputAsNextInput = () => {
    if (!result) {
      return
    }
    setText(result.output)
    setResult(null)
    setError(null)
  }

  return (
    <Calculator
      title="Cifrario Enigma (Simulatore a Rotori)"
      description="Simula la macchina Enigma con 3 rotori, Ringstellung, Reflector e Plugboard per cifrare o decifrare testi."
      keyword="enigma"
    >
      <form onSubmit={onCalculate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Testo</label>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="w-full min-h-36 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Inserisci il messaggio da cifrare/decifrare"
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rotore sinistro</label>
            <select
              value={rotorLeft}
              onChange={(event) => setRotorLeft(event.target.value as (typeof ROTOR_OPTIONS)[number])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {ROTOR_OPTIONS.map((option) => (
                <option key={`left-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rotore centrale</label>
            <select
              value={rotorMiddle}
              onChange={(event) => setRotorMiddle(event.target.value as (typeof ROTOR_OPTIONS)[number])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {ROTOR_OPTIONS.map((option) => (
                <option key={`middle-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rotore destro</label>
            <select
              value={rotorRight}
              onChange={(event) => setRotorRight(event.target.value as (typeof ROTOR_OPTIONS)[number])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {ROTOR_OPTIONS.map((option) => (
                <option key={`right-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ring sinistro (1-26)</label>
            <input
              type="number"
              min="1"
              max="26"
              value={ringLeft}
              onChange={(event) => setRingLeft(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ring centrale (1-26)</label>
            <input
              type="number"
              min="1"
              max="26"
              value={ringMiddle}
              onChange={(event) => setRingMiddle(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ring destro (1-26)</label>
            <input
              type="number"
              min="1"
              max="26"
              value={ringRight}
              onChange={(event) => setRingRight(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Posizione sinistra</label>
            <input
              type="text"
              maxLength={1}
              value={positionLeft}
              onChange={(event) => setPositionLeft(event.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Posizione centrale</label>
            <input
              type="text"
              maxLength={1}
              value={positionMiddle}
              onChange={(event) => setPositionMiddle(event.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Posizione destra</label>
            <input
              type="text"
              maxLength={1}
              value={positionRight}
              onChange={(event) => setPositionRight(event.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Reflector</label>
            <select
              value={reflector}
              onChange={(event) => setReflector(event.target.value as (typeof REFLECTOR_OPTIONS)[number])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {REFLECTOR_OPTIONS.map((option) => (
                <option key={`reflector-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Plugboard (es. AB CD EF)</label>
          <input
            type="text"
            value={plugboardPairs}
            onChange={(event) => setPlugboardPairs(event.target.value.toUpperCase())}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="AB CD EF"
          />
          <p className="text-xs text-slate-500">Massimo 10 coppie, senza ripetere lettere.</p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={preserveNonLetters}
            onChange={(event) => setPreserveNonLetters(event.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
          />
          Mantieni spazi, numeri e punteggiatura in output
        </label>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Cifra / Decifra
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-4 bg-cyan-50 border border-cyan-200 rounded-lg p-5" role="status" aria-live="polite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Posizione finale rotori:</span>{' '}
              {result.finalPositions.join(' - ')}
            </p>
            <p>
              <span className="font-semibold">Caratteri cifrati:</span> {result.steppedLetters}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Output Enigma</p>
            <textarea
              readOnly
              value={result.output}
              className="w-full min-h-28 px-4 py-3 border border-cyan-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Output in gruppi da 5 (solo lettere)</p>
            <textarea
              readOnly
              value={groupedOutput}
              className="w-full min-h-20 px-4 py-3 border border-cyan-200 rounded-lg bg-white text-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={useOutputAsNextInput}
            className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3 rounded-lg border border-slate-300 transition-colors"
          >
            Usa output come nuovo input
          </button>
        </div>
      )}

      <AdUnit adSlot="1234567922" />

      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
        <p className="font-semibold">Nota pratica</p>
        <p>
          Enigma usa lo stesso processo per cifrare e decifrare: per decodificare, reinserisci il testo cifrato con le stesse
          impostazioni iniziali di rotori, ring, posizioni, reflector e plugboard.
        </p>
      </div>
    </Calculator>
  )
}
