import type { CalculatorCategory } from '@/lib/calculator-catalog'

export const SUPPORTED_LANGUAGES = ['it', 'en', 'es'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const THEME_OPTIONS = ['system', 'light', 'dark'] as const
export type ThemePreference = (typeof THEME_OPTIONS)[number]
export type ResolvedTheme = 'light' | 'dark'

export const LANGUAGE_STORAGE_KEY = 'calcolasubito:language'
export const THEME_STORAGE_KEY = 'calcolasubito:theme'

export const POPULARITY_LEVELS = ['Molto Alto', 'Alto', 'Medio'] as const
export type PopularityLevel = (typeof POPULARITY_LEVELS)[number]

type NavKey = 'home' | 'calculators' | 'about' | 'privacy'

export interface UITexts {
  common: {
    brandName: string
    language: string
    theme: string
    themeSystem: string
    themeLight: string
    themeDark: string
    currentTheme: string
    supportedLanguages: Record<AppLanguage, string>
  }
  header: {
    nav: Record<NavKey, string>
    openMenu: string
    closeMenu: string
  }
  footer: {
    description: string
    activeDomain: string
    navigation: string
    topCalculators: string
    rightsReserved: string
    localExecution: string
  }
  home: {
    badge: string
    title: string
    subtitle: string
    searchPlaceholder: string
    searchAriaLabel: string
    resultsLabel: string
    categoryFilterLabel: string
    allCategories: string
    allCalculatorsTitle: string
    allCalculatorsSubtitle: string
    noResults: string
    openCalculator: string
    highlightedTitle: string
    highlightedSubtitle: string
  }
  calculator: {
    addFavorite: string
    favorite: string
    copyLink: string
    share: string
    print: string
    resetForm: string
    recalculate: string
    restoreValues: string
    exportHistory: string
    importHistory: string
    clearHistory: string
    favoriteAdded: string
    favoriteRemoved: string
    copiedLink: string
    copyLinkError: string
    shareCompleted: string
    shareCanceled: string
    formNotFound: string
    formReset: string
    calculationSubmitted: string
    noHistory: string
    restoreCompleted: string
    historyCleared: string
    noExportHistory: string
    exportCompleted: string
    exportError: string
    importNoUsableData: string
    importCompleted: string
    importError: string
    relatedCalculators: string
    recentCalculators: string
    favorites: string
    localHistory: string
    localHistoryLastSaved: string
    localHistoryEmpty: string
    noRecentItems: string
    noFavoriteItems: string
    privacyByDesign: string
    privacyByDesignText: string
    professionalUse: string
    professionalUseText: string
  }
  categories: Record<'all' | CalculatorCategory, string>
  popularity: Record<PopularityLevel, string>
}

export const UI_TEXTS: Record<AppLanguage, UITexts> = {
  it: {
    common: {
      brandName: 'CalcolaSubito',
      language: 'Lingua',
      theme: 'Tema',
      themeSystem: 'Sistema',
      themeLight: 'Chiaro',
      themeDark: 'Scuro',
      currentTheme: 'Tema attivo',
      supportedLanguages: {
        it: 'Italiano',
        en: 'English',
        es: 'Español',
      },
    },
    header: {
      nav: {
        home: 'Home',
        calculators: 'Calcolatori',
        about: 'Chi Siamo',
        privacy: 'Privacy',
      },
      openMenu: 'Apri menu',
      closeMenu: 'Chiudi menu',
    },
    footer: {
      description:
        'Portale italiano di calcolatori online per finanza, fisco, salute, scuola e utilità quotidiane.',
      activeDomain: 'Dominio attivo',
      navigation: 'Navigazione',
      topCalculators: 'Calcolatori Top',
      rightsReserved: 'Tutti i diritti riservati.',
      localExecution: 'I calcoli sono eseguiti localmente nel browser dell’utente.',
    },
    home: {
      badge: 'Calcolatori professionali sempre aggiornati',
      title: 'Calcolatori online veloci, affidabili e facili da usare',
      subtitle:
        'Cerca subito il calcolatore che ti serve tra finanza, fisco, salute, scuola e utilità. Tutto gira nel browser: nessun dato personale viene salvato.',
      searchPlaceholder: 'Cerca per nome, tag o categoria (es. mutuo, BMI, IVA, mancia...)',
      searchAriaLabel: 'Cerca calcolatore',
      resultsLabel: 'risultati',
      categoryFilterLabel: 'Filtra per categoria',
      allCategories: 'Tutte',
      allCalculatorsTitle: 'Tutti i calcolatori',
      allCalculatorsSubtitle:
        'Selezione dei calcolatori più cercati e usati, organizzati per categoria.',
      noResults:
        'Nessun risultato trovato. Prova con un altro termine di ricerca o cambia categoria.',
      openCalculator: 'Apri calcolatore',
      highlightedTitle: 'Calcolatori più usati',
      highlightedSubtitle:
        'Ecco i tool con domanda più alta nel portale: perfetti per partire subito.',
    },
    calculator: {
      addFavorite: 'Aggiungi ai preferiti',
      favorite: 'Preferito',
      copyLink: 'Copia link',
      share: 'Condividi',
      print: 'Stampa',
      resetForm: 'Reset form',
      recalculate: 'Ricalcola',
      restoreValues: 'Ripristina ultimi valori',
      exportHistory: 'Esporta cronologia',
      importHistory: 'Importa cronologia',
      clearHistory: 'Svuota cronologia',
      favoriteAdded: 'Aggiunto ai preferiti.',
      favoriteRemoved: 'Rimosso dai preferiti.',
      copiedLink: 'Link copiato negli appunti.',
      copyLinkError: 'Impossibile copiare il link.',
      shareCompleted: 'Condivisione completata.',
      shareCanceled: 'Condivisione annullata.',
      formNotFound: 'Form non trovato.',
      formReset: 'Form ripristinato ai valori iniziali.',
      calculationSubmitted: 'Calcolo inviato.',
      noHistory: 'Nessuna cronologia disponibile.',
      restoreCompleted: 'Ultimi valori ripristinati.',
      historyCleared: 'Cronologia locale cancellata.',
      noExportHistory: 'Nessuna cronologia da esportare.',
      exportCompleted: 'Cronologia esportata in JSON.',
      exportError: 'Errore durante esportazione cronologia.',
      importNoUsableData: 'File valido ma senza snapshot utilizzabili.',
      importCompleted: 'Snapshot importati con successo.',
      importError: 'File non valido: impossibile importare cronologia.',
      relatedCalculators: 'Calcolatori correlati',
      recentCalculators: 'Visitati di recente',
      favorites: 'Preferiti',
      localHistory: 'Cronologia input locale',
      localHistoryLastSaved: 'Ultimo salvataggio',
      localHistoryEmpty: 'Nessuna cronologia locale.',
      noRecentItems: 'Nessun calcolatore recente oltre a quello corrente.',
      noFavoriteItems: 'Aggiungi questo o altri calcolatori ai preferiti.',
      privacyByDesign: 'Privacy by design',
      privacyByDesignText:
        'Tutti i calcoli vengono effettuati sul tuo dispositivo. Nessun input del form viene salvato nei server del portale.',
      professionalUse: 'Uso professionale',
      professionalUseText:
        'I risultati sono accurati a livello operativo. Per pratiche fiscali, legali o mediche usa sempre anche una verifica specialistica.',
    },
    categories: {
      all: 'Tutte',
      Finanza: 'Finanza',
      Fisco: 'Fisco',
      Matematica: 'Matematica',
      Salute: 'Salute',
      Scuola: 'Scuola',
      Utilita: 'Utilità',
    },
    popularity: {
      'Molto Alto': 'Molto Alto',
      Alto: 'Alto',
      Medio: 'Medio',
    },
  },
  en: {
    common: {
      brandName: 'CalcolaSubito',
      language: 'Language',
      theme: 'Theme',
      themeSystem: 'System',
      themeLight: 'Light',
      themeDark: 'Dark',
      currentTheme: 'Active theme',
      supportedLanguages: {
        it: 'Italian',
        en: 'English',
        es: 'Spanish',
      },
    },
    header: {
      nav: {
        home: 'Home',
        calculators: 'Calculators',
        about: 'About',
        privacy: 'Privacy',
      },
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    footer: {
      description:
        'Italian online calculator portal for finance, taxes, health, education and daily utilities.',
      activeDomain: 'Active domain',
      navigation: 'Navigation',
      topCalculators: 'Top Calculators',
      rightsReserved: 'All rights reserved.',
      localExecution: 'Calculations run locally in the user browser.',
    },
    home: {
      badge: 'Professional calculators, always updated',
      title: 'Fast, reliable and easy-to-use online calculators',
      subtitle:
        'Find the calculator you need across finance, tax, health, school and utilities. Everything runs in your browser: no personal data is stored.',
      searchPlaceholder: 'Search by name, tag or category (e.g. mortgage, BMI, VAT, tip...)',
      searchAriaLabel: 'Search calculator',
      resultsLabel: 'results',
      categoryFilterLabel: 'Filter by category',
      allCategories: 'All',
      allCalculatorsTitle: 'All calculators',
      allCalculatorsSubtitle:
        'Selection of the most searched and used calculators, organized by category.',
      noResults: 'No results found. Try another search term or switch category.',
      openCalculator: 'Open calculator',
      highlightedTitle: 'Most used calculators',
      highlightedSubtitle:
        'Here are the highest-demand tools on the portal: perfect to start immediately.',
    },
    calculator: {
      addFavorite: 'Add to favorites',
      favorite: 'Favorite',
      copyLink: 'Copy link',
      share: 'Share',
      print: 'Print',
      resetForm: 'Reset form',
      recalculate: 'Recalculate',
      restoreValues: 'Restore latest values',
      exportHistory: 'Export history',
      importHistory: 'Import history',
      clearHistory: 'Clear history',
      favoriteAdded: 'Added to favorites.',
      favoriteRemoved: 'Removed from favorites.',
      copiedLink: 'Link copied to clipboard.',
      copyLinkError: 'Unable to copy link.',
      shareCompleted: 'Sharing completed.',
      shareCanceled: 'Sharing canceled.',
      formNotFound: 'Form not found.',
      formReset: 'Form reset to initial values.',
      calculationSubmitted: 'Calculation submitted.',
      noHistory: 'No history available.',
      restoreCompleted: 'Latest values restored.',
      historyCleared: 'Local history cleared.',
      noExportHistory: 'No history to export.',
      exportCompleted: 'History exported as JSON.',
      exportError: 'Error while exporting history.',
      importNoUsableData: 'Valid file but no usable snapshots.',
      importCompleted: 'Snapshots imported successfully.',
      importError: 'Invalid file: cannot import history.',
      relatedCalculators: 'Related calculators',
      recentCalculators: 'Recently visited',
      favorites: 'Favorites',
      localHistory: 'Local input history',
      localHistoryLastSaved: 'Last saved',
      localHistoryEmpty: 'No local history.',
      noRecentItems: 'No recent calculator besides the current one.',
      noFavoriteItems: 'Add this or other calculators to favorites.',
      privacyByDesign: 'Privacy by design',
      privacyByDesignText:
        'All calculations run on your device. No form inputs are stored on portal servers.',
      professionalUse: 'Professional use',
      professionalUseText:
        'Results are operationally accurate. For fiscal, legal or medical cases, always validate with a specialist.',
    },
    categories: {
      all: 'All',
      Finanza: 'Finance',
      Fisco: 'Tax',
      Matematica: 'Math',
      Salute: 'Health',
      Scuola: 'Education',
      Utilita: 'Utilities',
    },
    popularity: {
      'Molto Alto': 'Very High',
      Alto: 'High',
      Medio: 'Medium',
    },
  },
  es: {
    common: {
      brandName: 'CalcolaSubito',
      language: 'Idioma',
      theme: 'Tema',
      themeSystem: 'Sistema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      currentTheme: 'Tema activo',
      supportedLanguages: {
        it: 'Italiano',
        en: 'Inglés',
        es: 'Español',
      },
    },
    header: {
      nav: {
        home: 'Inicio',
        calculators: 'Calculadoras',
        about: 'Quiénes somos',
        privacy: 'Privacidad',
      },
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },
    footer: {
      description:
        'Portal italiano de calculadoras online para finanzas, impuestos, salud, educación y utilidades diarias.',
      activeDomain: 'Dominio activo',
      navigation: 'Navegación',
      topCalculators: 'Calculadoras Top',
      rightsReserved: 'Todos los derechos reservados.',
      localExecution: 'Los cálculos se ejecutan localmente en el navegador del usuario.',
    },
    home: {
      badge: 'Calculadoras profesionales siempre actualizadas',
      title: 'Calculadoras online rápidas, fiables y fáciles de usar',
      subtitle:
        'Encuentra la calculadora que necesitas entre finanzas, impuestos, salud, escuela y utilidades. Todo funciona en tu navegador: no se guardan datos personales.',
      searchPlaceholder: 'Buscar por nombre, etiqueta o categoría (ej. hipoteca, IMC, IVA, propina...)',
      searchAriaLabel: 'Buscar calculadora',
      resultsLabel: 'resultados',
      categoryFilterLabel: 'Filtrar por categoría',
      allCategories: 'Todas',
      allCalculatorsTitle: 'Todas las calculadoras',
      allCalculatorsSubtitle:
        'Selección de las calculadoras más buscadas y usadas, organizadas por categoría.',
      noResults:
        'No se encontraron resultados. Prueba con otro término o cambia de categoría.',
      openCalculator: 'Abrir calculadora',
      highlightedTitle: 'Calculadoras más usadas',
      highlightedSubtitle:
        'Aquí tienes las herramientas con mayor demanda del portal: perfectas para empezar de inmediato.',
    },
    calculator: {
      addFavorite: 'Agregar a favoritos',
      favorite: 'Favorito',
      copyLink: 'Copiar enlace',
      share: 'Compartir',
      print: 'Imprimir',
      resetForm: 'Restablecer formulario',
      recalculate: 'Recalcular',
      restoreValues: 'Restaurar últimos valores',
      exportHistory: 'Exportar historial',
      importHistory: 'Importar historial',
      clearHistory: 'Vaciar historial',
      favoriteAdded: 'Añadido a favoritos.',
      favoriteRemoved: 'Eliminado de favoritos.',
      copiedLink: 'Enlace copiado al portapapeles.',
      copyLinkError: 'No se pudo copiar el enlace.',
      shareCompleted: 'Compartido correctamente.',
      shareCanceled: 'Compartir cancelado.',
      formNotFound: 'Formulario no encontrado.',
      formReset: 'Formulario restablecido a los valores iniciales.',
      calculationSubmitted: 'Cálculo enviado.',
      noHistory: 'No hay historial disponible.',
      restoreCompleted: 'Últimos valores restaurados.',
      historyCleared: 'Historial local eliminado.',
      noExportHistory: 'No hay historial para exportar.',
      exportCompleted: 'Historial exportado en JSON.',
      exportError: 'Error al exportar el historial.',
      importNoUsableData: 'Archivo válido, pero sin snapshots utilizables.',
      importCompleted: 'Snapshots importados correctamente.',
      importError: 'Archivo no válido: no se puede importar historial.',
      relatedCalculators: 'Calculadoras relacionadas',
      recentCalculators: 'Visitadas recientemente',
      favorites: 'Favoritos',
      localHistory: 'Historial local de entradas',
      localHistoryLastSaved: 'Último guardado',
      localHistoryEmpty: 'Sin historial local.',
      noRecentItems: 'No hay calculadoras recientes aparte de la actual.',
      noFavoriteItems: 'Agrega esta u otras calculadoras a favoritos.',
      privacyByDesign: 'Privacidad por diseño',
      privacyByDesignText:
        'Todos los cálculos se ejecutan en tu dispositivo. Ninguna entrada del formulario se guarda en los servidores del portal.',
      professionalUse: 'Uso profesional',
      professionalUseText:
        'Los resultados son precisos a nivel operativo. Para casos fiscales, legales o médicos, valida siempre con un especialista.',
    },
    categories: {
      all: 'Todas',
      Finanza: 'Finanzas',
      Fisco: 'Fiscal',
      Matematica: 'Matemáticas',
      Salute: 'Salud',
      Scuola: 'Escuela',
      Utilita: 'Utilidades',
    },
    popularity: {
      'Molto Alto': 'Muy Alta',
      Alto: 'Alta',
      Medio: 'Media',
    },
  },
}

export function detectLanguage(input: string | null | undefined): AppLanguage {
  const locale = (input ?? '').toLowerCase()
  if (locale.startsWith('es')) return 'es'
  if (locale.startsWith('en')) return 'en'
  return 'it'
}

export function isSupportedLanguage(value: string | null | undefined): value is AppLanguage {
  if (!value) {
    return false
  }
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  if (!value) {
    return false
  }
  return (THEME_OPTIONS as readonly string[]).includes(value)
}

export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean
): ResolvedTheme {
  if (preference === 'system') {
    return systemDark ? 'dark' : 'light'
  }
  return preference
}
