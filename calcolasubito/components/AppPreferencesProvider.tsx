'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  UI_TEXTS,
  detectLanguage,
  isSupportedLanguage,
  isThemePreference,
  resolveTheme,
  type AppLanguage,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/i18n'

interface AppPreferencesContextValue {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
  themePreference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
  resolvedTheme: ResolvedTheme
  text: (typeof UI_TEXTS)[AppLanguage]
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null)

function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return 'it'
  }
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (isSupportedLanguage(stored)) {
    return stored
  }
  return detectLanguage(window.navigator.language)
}

function getInitialThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system'
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isThemePreference(stored)) {
    return stored
  }
  return 'system'
}

function getSystemDarkMode(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>('it')
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system')
  const [systemDark, setSystemDark] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const nextLanguage = getInitialLanguage()
    const nextThemePreference = getInitialThemePreference()
    const nextSystemDark = getSystemDarkMode()

    setLanguageState(nextLanguage)
    setThemePreferenceState(nextThemePreference)
    setSystemDark(nextSystemDark)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches)
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const resolvedTheme = useMemo(
    () => resolveTheme(themePreference, systemDark),
    [themePreference, systemDark]
  )

  useEffect(() => {
    if (!isInitialized || typeof document === 'undefined') {
      return
    }
    document.documentElement.lang = language
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // Ignore storage failures
    }
  }, [isInitialized, language])

  useEffect(() => {
    if (!isInitialized || typeof document === 'undefined') {
      return
    }
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
    } catch {
      // Ignore storage failures
    }
  }, [isInitialized, themePreference, resolvedTheme])

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      themePreference,
      setThemePreference: setThemePreferenceState,
      resolvedTheme,
      text: UI_TEXTS[language],
    }),
    [language, themePreference, resolvedTheme]
  )

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>
}

export function useAppPreferences(): AppPreferencesContextValue {
  const context = useContext(AppPreferencesContext)
  if (!context) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider')
  }
  return context
}
