/**
 * Generic CSV Loader and Search Engine
 * Works with any CSV file - analyzes structure and provides search functionality
 */

export interface CSVRecord {
  [key: string]: string
}

export interface CSVStructure {
  headers: string[]
  rowCount: number
  columnCount: number
}

export class CSVLoader {
  private content: string = ''
  private structure: CSVStructure | null = null
  private cache: Map<string, Map<string, CSVRecord>> = new Map()

  /**
   * Load CSV content from URL or string
   * @param contentOrUrl CSV content as string or URL path
   */
  async load(contentOrUrl: string): Promise<void> {
    try {
      // Try to load as URL first
      if (contentOrUrl.startsWith('/') || contentOrUrl.startsWith('http')) {
        const response = await fetch(contentOrUrl)
        this.content = await response.text()
      } else {
        // Treat as direct content
        this.content = contentOrUrl
      }

      // Analyze structure
      this.analyzeStructure()
    } catch (error) {
      console.error('Failed to load CSV:', error)
      throw error
    }
  }

  /**
   * Analyze CSV structure - extract headers and count rows
   */
  private analyzeStructure(): void {
    const lines = this.content.split('\n')

    if (lines.length < 1) {
      throw new Error('Empty CSV')
    }

    // Parse header
    const headers = this.parseCSVLine(lines[0])

    this.structure = {
      headers,
      columnCount: headers.length,
      rowCount: lines.length - 1, // Exclude header
    }
  }

  /**
   * Parse a single CSV line handling quoted fields
   * @param line CSV line
   * @returns Array of field values
   */
  private parseCSVLine(line: string): string[] {
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

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
    return fields
  }

  /**
   * Get CSV structure information
   */
  getStructure(): CSVStructure | null {
    return this.structure
  }

  /**
   * Get all column headers
   */
  getHeaders(): string[] {
    return this.structure?.headers || []
  }

  /**
   * Build index for fast searching on a specific column
   * @param columnName Column to index
   */
  private buildIndex(columnName: string): void {
    if (this.cache.has(columnName)) return

    const headers = this.structure?.headers || []
    const columnIndex = headers.indexOf(columnName)

    if (columnIndex === -1) {
      throw new Error(`Column not found: ${columnName}`)
    }

    const index = new Map<string, CSVRecord>()
    const lines = this.content.split('\n')

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const fields = this.parseCSVLine(line)
      const keyValue = fields[columnIndex]?.trim().toUpperCase()

      if (keyValue) {
        const record: CSVRecord = {}
        headers.forEach((header, idx) => {
          record[header] = fields[idx] || ''
        })

        index.set(keyValue, record)
      }
    }

    this.cache.set(columnName, index)
  }

  /**
   * Search for a value in a specific column
   * @param searchColumn Column to search in
   * @param searchValue Value to find
   * @returns Full record if found, null otherwise
   */
  search(searchColumn: string, searchValue: string): CSVRecord | null {
    if (!this.structure) {
      throw new Error('CSV not loaded')
    }

    // Build index if not exists
    this.buildIndex(searchColumn)

    const index = this.cache.get(searchColumn)
    if (!index) return null

    const searchKey = searchValue.trim().toUpperCase()
    return index.get(searchKey) || null
  }

  /**
   * Search and return specific field value
   * @param searchColumn Column to search in
   * @param searchValue Value to find
   * @param returnColumn Column value to return
   * @returns Field value or null
   */
  searchField(searchColumn: string, searchValue: string, returnColumn: string): string | null {
    const record = this.search(searchColumn, searchValue)
    return record ? (record[returnColumn] || null) : null
  }

  /**
   * Get all records (warning: memory intensive for large CSVs)
   */
  getAllRecords(): CSVRecord[] {
    const records: CSVRecord[] = []
    const headers = this.structure?.headers || []
    const lines = this.content.split('\n')

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const fields = this.parseCSVLine(line)
      const record: CSVRecord = {}

      headers.forEach((header, idx) => {
        record[header] = fields[idx] || ''
      })

      records.push(record)
    }

    return records
  }

  /**
   * Clear cache (useful after multiple searches)
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { indexes: number; totalCached: number } {
    let totalCached = 0
    this.cache.forEach(map => {
      totalCached += map.size
    })

    return {
      indexes: this.cache.size,
      totalCached,
    }
  }
}
