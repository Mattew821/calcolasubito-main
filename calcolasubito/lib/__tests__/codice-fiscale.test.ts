import { buildCodiceFiscale, normalizeCodiceFiscaleText } from '../codice-fiscale'

interface ReferencePerson {
  name: string
  surname: string
  gender: string
  birthday: string
  birthplace: string
}
interface ReferenceInstance {
  code: string
}
// Riferimento indipendente: libreria `codice-fiscale-js` (CommonJS dist)
const ReferenceCf = require('codice-fiscale-js/dist/codice.fiscale.commonjs2.js') as {
  new (data: ReferencePerson): ReferenceInstance
  check(codiceFiscale: string): boolean
}

/**
 * Riferimento indipendente: libreria `codice-fiscale-js` (implementazione terza,
 * basata sulle stesse regole ufficiali Agenzia delle Entrate / D.M. 12/1976).
 * Il corpus copre: sesso M/F, nomi con >3 consonanti (regola 1a-3a-4a), cognomi
 * con <3 consonanti, cognomi composti, lettere accentate/estere, anno bisestile.
 */
const corpus: Array<{
  surname: string
  name: string
  birthDate: string
  gender: 'M' | 'F'
  catastaleCode: string
  birthplace: string
}> = [
  { surname: 'ROSSI', name: 'MARIO', birthDate: '1980-01-27', gender: 'M', catastaleCode: 'H501', birthplace: 'ROMA' },
  { surname: 'BIANCHI', name: 'MARIA', birthDate: '1992-08-15', gender: 'F', catastaleCode: 'F205', birthplace: 'MILANO' },
  { surname: 'VERDI', name: 'GIUSEPPE', birthDate: '2000-02-29', gender: 'M', catastaleCode: 'F839', birthplace: 'NAPOLI' },
  { surname: 'DE LUCA', name: 'ANNA', birthDate: '1975-05-03', gender: 'F', catastaleCode: 'L219', birthplace: 'TORINO' },
  { surname: 'MAO', name: 'FRANCO', birthDate: '1963-12-31', gender: 'M', catastaleCode: 'D612', birthplace: 'FIRENZE' },
  { surname: 'RUSSO', name: 'ALESSANDRO', birthDate: '1988-03-14', gender: 'M', catastaleCode: 'F839', birthplace: 'NAPOLI' },
  { surname: 'FERRARI', name: 'LAURA', birthDate: '1995-07-22', gender: 'F', catastaleCode: 'H501', birthplace: 'ROMA' },
  { surname: 'ESPOSITO', name: 'PAOLO', birthDate: '1970-11-05', gender: 'M', catastaleCode: 'F205', birthplace: 'MILANO' },
  { surname: "D'AMICO", name: 'CHIARA', birthDate: '2001-04-18', gender: 'F', catastaleCode: 'D969', birthplace: 'GENOVA' },
  { surname: 'COLOMBO', name: 'STEFANO', birthDate: '1985-09-09', gender: 'M', catastaleCode: 'F205', birthplace: 'MILANO' },
  { surname: 'RICCI', name: 'ELENA', birthDate: '1998-02-28', gender: 'F', catastaleCode: 'H501', birthplace: 'ROMA' },
  { surname: 'MARINO', name: 'LUCA', birthDate: '1979-06-17', gender: 'M', catastaleCode: 'F839', birthplace: 'NAPOLI' },
  { surname: 'GRECO', name: 'SILVIA', birthDate: '1990-10-25', gender: 'F', catastaleCode: 'A944', birthplace: 'BOLOGNA' },
  { surname: 'BRUNO', name: 'ANDREA', birthDate: '1967-01-01', gender: 'M', catastaleCode: 'L219', birthplace: 'TORINO' },
  { surname: 'GALLO', name: 'VALENTINA', birthDate: '1982-05-30', gender: 'F', catastaleCode: 'D612', birthplace: 'FIRENZE' },
]

describe('buildCodiceFiscale (riferimento indipendente: codice-fiscale-js)', () => {
  for (const c of corpus) {
    it(`matches reference for ${c.name} ${c.surname} (${c.gender}, ${c.birthDate})`, () => {
      // Riferimento indipendente
      const ref = new ReferenceCf({
        name: c.name,
        surname: c.surname,
        gender: c.gender,
        birthday: c.birthDate,
        birthplace: c.birthplace,
      })
      const got = buildCodiceFiscale({
        surname: c.surname,
        name: c.name,
        birthDate: c.birthDate,
        gender: c.gender,
        catastaleCode: c.catastaleCode,
      })
      expect(got).toBe(ref.code)
      // Seconda verifica indipendente: il CF generato deve superare il check della libreria
      expect(ReferenceCf.check(got)).toBe(true)
    })
  }
})

describe('buildCodiceFiscale — valori noti (esempi pubblicati/ufficiali)', () => {
  it('ROSSI MARIO, 27/01/1980, Roma: RSSMRA80A27H501N', () => {
    const got = buildCodiceFiscale({ surname: 'ROSSI', name: 'MARIO', birthDate: '1980-01-27', gender: 'M', catastaleCode: 'H501' })
    expect(got).toBe('RSSMRA80A27H501N')
  })

  it('VERDI GIUSEPPE, 29/02/2000, Napoli (bisestile): VRDGPP00B29F839A', () => {
    const got = buildCodiceFiscale({ surname: 'VERDI', name: 'GIUSEPPE', birthDate: '2000-02-29', gender: 'M', catastaleCode: 'F839' })
    expect(got).toBe('VRDGPP00B29F839A')
  })
})

describe('buildCodiceFiscale — regole specifiche', () => {
  it('nome con >3 consonanti usa 1a-3a-4a (MARCELLO -> MCL)', () => {
    const got = buildCodiceFiscale({ surname: 'VERDI', name: 'MARCELLO', birthDate: '1980-01-27', gender: 'M', catastaleCode: 'H501' })
    expect(got.slice(3, 6)).toBe('MCL')
    expect(ReferenceCf.check(got)).toBe(true)
  })

  it('cognome con <3 consonanti integra con vocali (MAO -> MAO)', () => {
    const got = buildCodiceFiscale({ surname: 'MAO', name: 'FRANCO', birthDate: '1963-12-31', gender: 'M', catastaleCode: 'D612' })
    expect(got.slice(0, 3)).toBe('MAO')
  })

  it('donna: giorno + 40 (15/08/1992 -> 55)', () => {
    const got = buildCodiceFiscale({ surname: 'BIANCHI', name: 'MARIA', birthDate: '1992-08-15', gender: 'F', catastaleCode: 'F205' })
    expect(got.slice(9, 11)).toBe('55')
  })

  it('mese dicembre = T', () => {
    const got = buildCodiceFiscale({ surname: 'MAO', name: 'FRANCO', birthDate: '1963-12-31', gender: 'M', catastaleCode: 'D612' })
    expect(got.charAt(8)).toBe('T')
  })
})

describe('buildCodiceFiscale — validazione input', () => {
  it('throws on empty surname/name', () => {
    expect(() => buildCodiceFiscale({ surname: '', name: 'MARIO', birthDate: '1980-01-27', gender: 'M', catastaleCode: 'H501' })).toThrow()
    expect(() => buildCodiceFiscale({ surname: 'ROSSI', name: '   ', birthDate: '1980-01-27', gender: 'M', catastaleCode: 'H501' })).toThrow()
  })

  it('throws on invalid gender', () => {
    expect(() => buildCodiceFiscale({ surname: 'ROSSI', name: 'MARIO', birthDate: '1980-01-27', gender: 'X' as 'M', catastaleCode: 'H501' })).toThrow()
  })

  it('throws on invalid birth date', () => {
    expect(() => buildCodiceFiscale({ surname: 'ROSSI', name: 'MARIO', birthDate: 'not-a-date', gender: 'M', catastaleCode: 'H501' })).toThrow()
  })

  it('throws on malformed catastale code', () => {
    expect(() => buildCodiceFiscale({ surname: 'ROSSI', name: 'MARIO', birthDate: '1980-01-27', gender: 'M', catastaleCode: 'H50' })).toThrow()
  })
})

describe('normalizeCodiceFiscaleText', () => {
  it('strips accents and uppercase', () => {
    expect(normalizeCodiceFiscaleText('Garzón')).toBe('GARZON')
    expect(normalizeCodiceFiscaleText("d'Amico")).toBe('DAMICO')
  })

  it('maps special foreign letters', () => {
    expect(normalizeCodiceFiscaleText('Jørgensen')).toBe('JORGENSEN')
    expect(normalizeCodiceFiscaleText('Þórðarson')).toBe('THORDARSON')
  })
})
