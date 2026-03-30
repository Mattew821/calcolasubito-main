const CODICE_CATASTALE_REGEX = /^[A-Z][0-9]{3}$/

export function isCodiceCatastale(value: string): boolean {
  return CODICE_CATASTALE_REGEX.test(value.trim().toUpperCase())
}

export function resolveCodiceCatastale(
  input: string,
  lookupComune: (name: string) => string
): string {
  const trimmed = input.trim().toUpperCase()
  if (CODICE_CATASTALE_REGEX.test(trimmed)) {
    return trimmed
  }

  const lookedUp = lookupComune(input).trim().toUpperCase()
  if (CODICE_CATASTALE_REGEX.test(lookedUp)) {
    return lookedUp
  }

  throw new Error('Comune o codice catastale non valido')
}
