import { isCodiceCatastale, resolveCodiceCatastale } from '../codice-fiscale-utils'

describe('codice-fiscale-utils', () => {
  it('recognizes valid catastale codes', () => {
    expect(isCodiceCatastale('H501')).toBe(true)
    expect(isCodiceCatastale(' h501 ')).toBe(true)
    expect(isCodiceCatastale('ZZ99')).toBe(false)
  })

  it('returns direct catastale code when provided', () => {
    const result = resolveCodiceCatastale(' h501 ', () => 'XXXX')
    expect(result).toBe('H501')
  })

  it('falls back to comune lookup when input is not a code', () => {
    const result = resolveCodiceCatastale('Roma', (name) =>
      name.trim().toUpperCase() === 'ROMA' ? 'H501' : 'XXXX'
    )
    expect(result).toBe('H501')
  })

  it('throws when neither direct code nor lookup is valid', () => {
    expect(() => resolveCodiceCatastale('ComuneFantasma', () => 'XXXX')).toThrow(
      'Comune o codice catastale non valido'
    )
  })
})
