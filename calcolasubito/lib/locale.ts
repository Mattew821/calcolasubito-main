import {
  LANGUAGE_STORAGE_KEY,
  detectLanguage,
  isSupportedLanguage,
  type AppLanguage,
} from '@/lib/i18n'

const INTL_LOCALE_BY_LANGUAGE: Record<AppLanguage, string> = {
  it: 'it-IT',
  en: 'en-US',
  es: 'es-ES',
}

export function getIntlLocale(language: AppLanguage): string {
  return INTL_LOCALE_BY_LANGUAGE[language]
}

export function getActiveLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'it'
  }

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isSupportedLanguage(storedLanguage)) {
      return storedLanguage
    }
  } catch {
    // Ignore storage errors
  }

  const docLanguage = window.document?.documentElement?.lang
  if (docLanguage) {
    return detectLanguage(docLanguage)
  }

  return detectLanguage(window.navigator?.language)
}

export function getActiveIntlLocale(): string {
  return getIntlLocale(getActiveLanguage())
}
