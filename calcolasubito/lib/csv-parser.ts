/**
 * CSV Parser with search algorithm
 * Reads comuni_italiani_2020.csv and provides lookup by municipality name
 */

interface Comune {
  codice_comune: string
  denominazione_italiano: string
  codice_catastale: string
}

/**
 * Parse CSV line - handles quoted fields
 * @param line CSV line
 * @param headers Column headers
 * @returns Object with column values
 */
function parseCSVLine(line: string, headers: string[]): Record<string, string> {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      fields.push(current.replace(/"/g, '').trim())
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current.replace(/"/g, '').trim())

  const record: Record<string, string> = {}
  headers.forEach((header, idx) => {
    record[header] = fields[idx] || ''
  })

  return record
}

/**
 * Search algorithm: Linear search through CSV for municipality name
 * @param csvContent Full CSV content as string
 * @param searchName Municipality name to search for
 * @returns ISTAT code if found, 'XXXX' if not found
 */
export function searchComuneInCSV(csvContent: string, searchName: string): string {
  const lines = csvContent.split('\n')
  if (lines.length < 2) return 'XXXX'

  // Parse header
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  const nameIndex = headers.indexOf('denominazione_italiano')
  const istatIndex = headers.indexOf('codice_catastale')

  if (nameIndex === -1 || istatIndex === -1) {
    console.warn('CSV headers not found')
    return 'XXXX'
  }

  const searchUpper = searchName.trim().toUpperCase()

  // Linear search through CSV
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const record = parseCSVLine(line, headers)
    const denominazione = record.denominazione_italiano?.trim().toUpperCase()

    // Exact match
    if (denominazione === searchUpper) {
      const catastale = record.codice_catastale?.trim()
      return catastale || 'XXXX'
    }
  }

  // Not found
  return 'XXXX'
}

/**
 * Optimized search with caching (for repeated searches)
 * Builds in-memory map on first access
 */
export class ComuniSearcher {
  private cache: Map<string, string> = new Map()
  private csvContent: string = ''
  private isInitialized = false

  async initialize(csvContent: string): Promise<void> {
    this.csvContent = csvContent
    const lines = csvContent.split('\n')

    if (lines.length < 2) {
      console.warn('Empty CSV')
      return
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    const nameIndex = headers.indexOf('denominazione_italiano')
    const istatIndex = headers.indexOf('codice_catastale')

    if (nameIndex === -1 || istatIndex === -1) {
      console.warn('CSV headers not found')
      return
    }

    // Build cache
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const record = parseCSVLine(line, headers)
      const denominazione = record.denominazione_italiano?.trim().toUpperCase()
      const catastale = record.codice_catastale?.trim()

      if (denominazione && catastale) {
        this.cache.set(denominazione, catastale)
      }
    }

    this.isInitialized = true
  }

  search(searchName: string): string {
    if (!this.isInitialized) {
      return 'XXXX'
    }

    const searchUpper = searchName.trim().toUpperCase()
    return this.cache.get(searchUpper) || 'XXXX'
  }

  getStats(): { cached: number; initialized: boolean } {
    return {
      cached: this.cache.size,
      initialized: this.isInitialized,
    }
  }
}
