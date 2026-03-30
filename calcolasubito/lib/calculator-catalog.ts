export type CalculatorCategory =
  | 'Finanza'
  | 'Fisco'
  | 'Matematica'
  | 'Salute'
  | 'Scuola'
  | 'Utilita'

export interface CalculatorCatalogEntry {
  id: string
  title: string
  category: CalculatorCategory
  popularity: 'Molto Alto' | 'Alto' | 'Medio'
  description: string
  tags: string[]
}

export const CALCULATOR_CATALOG: CalculatorCatalogEntry[] = [
  {
    id: 'percentuali',
    title: 'Calcolo Percentuali',
    category: 'Matematica',
    popularity: 'Molto Alto',
    description: 'Percentuali dirette e inverse in pochi secondi.',
    tags: ['percentuale', 'sconto', 'proporzioni', 'matematica'],
  },
  {
    id: 'giorni-tra-date',
    title: 'Giorni tra Date',
    category: 'Utilita',
    popularity: 'Alto',
    description: 'Differenza in giorni tra due date.',
    tags: ['giorni', 'date', 'scadenza', 'tempo'],
  },
  {
    id: 'scorporo-iva',
    title: 'Scorporo IVA',
    category: 'Fisco',
    popularity: 'Molto Alto',
    description: 'Calcola imponibile e IVA da importi lordi o netti.',
    tags: ['iva', 'fisco', 'fattura', 'imponibile'],
  },
  {
    id: 'codice-fiscale',
    title: 'Codice Fiscale',
    category: 'Fisco',
    popularity: 'Molto Alto',
    description: 'Genera e valida codice fiscale italiano.',
    tags: ['codice fiscale', 'anagrafica', 'fisco'],
  },
  {
    id: 'rata-mutuo',
    title: 'Rata Mutuo',
    category: 'Finanza',
    popularity: 'Molto Alto',
    description: 'Rata mensile, interessi e piano di ammortamento.',
    tags: ['mutuo', 'rata', 'casa', 'interessi'],
  },
  {
    id: 'rata-prestito',
    title: 'Rata Prestito',
    category: 'Finanza',
    popularity: 'Molto Alto',
    description: 'Rata mensile e costo totale del prestito.',
    tags: ['prestito', 'rata', 'finanziamento', 'interessi'],
  },
  {
    id: 'interesse-composto',
    title: 'Interesse Composto',
    category: 'Finanza',
    popularity: 'Alto',
    description: 'Crescita del capitale con capitalizzazione periodica.',
    tags: ['interessi composti', 'investimento', 'capitale'],
  },
  {
    id: 'sconto-percentuale',
    title: 'Sconto Percentuale',
    category: 'Finanza',
    popularity: 'Alto',
    description: 'Prezzo finale e risparmio totale su uno sconto.',
    tags: ['sconto', 'prezzo', 'shopping'],
  },
  {
    id: 'aumento-percentuale',
    title: 'Aumento Percentuale',
    category: 'Finanza',
    popularity: 'Alto',
    description: 'Aumento assoluto e nuovo importo finale.',
    tags: ['aumento', 'incremento', 'percentuale'],
  },
  {
    id: 'interesse-semplice',
    title: 'Interesse Semplice',
    category: 'Finanza',
    popularity: 'Medio',
    description: 'Interessi lineari su capitale, tasso e durata.',
    tags: ['interessi', 'investimento', 'prestito'],
  },
  {
    id: 'indice-massa-corporea',
    title: 'Indice Massa Corporea (BMI)',
    category: 'Salute',
    popularity: 'Molto Alto',
    description: 'BMI e classificazione indicativa.',
    tags: ['bmi', 'salute', 'peso', 'altezza'],
  },
  {
    id: 'fabbisogno-calorico',
    title: 'Fabbisogno Calorico',
    category: 'Salute',
    popularity: 'Molto Alto',
    description: 'Stima calorie giornaliere con formula Mifflin-St Jeor.',
    tags: ['calorie', 'metabolismo', 'tdee', 'salute'],
  },
  {
    id: 'media-voti',
    title: 'Media Voti Ponderata',
    category: 'Scuola',
    popularity: 'Alto',
    description: 'Media pesata con voti e crediti.',
    tags: ['media', 'voti', 'universita', 'crediti'],
  },
  {
    id: 'area-rettangolo',
    title: 'Area Rettangolo',
    category: 'Matematica',
    popularity: 'Medio',
    description: 'Area da base e altezza.',
    tags: ['area', 'rettangolo', 'geometria'],
  },
  {
    id: 'area-cerchio',
    title: 'Area Cerchio',
    category: 'Matematica',
    popularity: 'Medio',
    description: 'Area del cerchio a partire dal raggio.',
    tags: ['area', 'cerchio', 'geometria'],
  },
  {
    id: 'conversione-temperatura',
    title: 'Conversione Temperatura',
    category: 'Utilita',
    popularity: 'Medio',
    description: 'Converti Celsius in Fahrenheit e Kelvin.',
    tags: ['temperatura', 'conversione', 'unita'],
  },
  {
    id: 'convertitore-unita-lunghezza',
    title: 'Convertitore Lunghezze',
    category: 'Utilita',
    popularity: 'Alto',
    description: 'Converte metri in km, cm, mm, miglia, piedi e pollici.',
    tags: ['conversione', 'lunghezza', 'metri', 'miglia', 'piedi'],
  },
  {
    id: 'calcolo-eta',
    title: 'Calcolo Eta',
    category: 'Utilita',
    popularity: 'Molto Alto',
    description: 'Calcola eta precisa in anni, mesi e giorni.',
    tags: ['eta', 'nascita', 'anni', 'date'],
  },
  {
    id: 'calcolo-mancia',
    title: 'Calcolo Mancia',
    category: 'Utilita',
    popularity: 'Alto',
    description: 'Mancia totale, totale conto e quota per persona.',
    tags: ['mancia', 'ristorante', 'conto'],
  },
  {
    id: 'consumo-carburante',
    title: 'Consumo Carburante',
    category: 'Utilita',
    popularity: 'Medio',
    description: 'Calcola km/l e l/100km.',
    tags: ['carburante', 'auto', 'consumi'],
  },
]

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  'Finanza',
  'Fisco',
  'Matematica',
  'Salute',
  'Scuola',
  'Utilita',
]
