import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n'
import { getActiveIntlLocale, getActiveLanguage, getIntlLocale } from '@/lib/locale'

describe('locale helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.lang = ''
    Object.defineProperty(window.navigator, 'language', {
      value: 'it-IT',
      configurable: true,
    })
  })

  it('maps app language to Intl locale', () => {
    expect(getIntlLocale('it')).toBe('it-IT')
    expect(getIntlLocale('en')).toBe('en-US')
    expect(getIntlLocale('es')).toBe('es-ES')
  })

  it('prefers stored language when available', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es')
    expect(getActiveLanguage()).toBe('es')
    expect(getActiveIntlLocale()).toBe('es-ES')
  })

  it('uses document language when storage is missing', () => {
    document.documentElement.lang = 'en-GB'
    expect(getActiveLanguage()).toBe('en')
    expect(getActiveIntlLocale()).toBe('en-US')
  })

  it('falls back to navigator language', () => {
    Object.defineProperty(window.navigator, 'language', {
      value: 'es-AR',
      configurable: true,
    })
    expect(getActiveLanguage()).toBe('es')
    expect(getActiveIntlLocale()).toBe('es-ES')
  })

  it('defaults to italian for unsupported values', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr')
    document.documentElement.lang = 'de-DE'
    Object.defineProperty(window.navigator, 'language', {
      value: 'pt-BR',
      configurable: true,
    })

    expect(getActiveLanguage()).toBe('it')
    expect(getActiveIntlLocale()).toBe('it-IT')
  })
})
