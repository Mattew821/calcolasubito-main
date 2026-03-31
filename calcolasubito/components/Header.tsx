'use client'

import Link from 'next/link'
import { Calculator, Menu, MoonStar, SunMedium, X } from 'lucide-react'
import { useState } from 'react'
import { useAppPreferences } from '@/components/AppPreferencesProvider'
import { SUPPORTED_LANGUAGES, THEME_OPTIONS, type AppLanguage, type ThemePreference } from '@/lib/i18n'

const navItems = [
  { href: '/', key: 'home' as const },
  { href: '/#calcolatori', key: 'calculators' as const },
  { href: '/about', key: 'about' as const },
  { href: '/privacy', key: 'privacy' as const },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    language,
    setLanguage,
    themePreference,
    setThemePreference,
    resolvedTheme,
    text,
  } = useAppPreferences()

  const themeLabelByValue: Record<ThemePreference, string> = {
    system: text.common.themeSystem,
    light: text.common.themeLight,
    dark: text.common.themeDark,
  }

  const themeIcon =
    resolvedTheme === 'dark' ? (
      <MoonStar className="w-4 h-4" aria-hidden="true" />
    ) : (
      <SunMedium className="w-4 h-4" aria-hidden="true" />
    )

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-display font-bold text-lg text-cyan-800"
          aria-label={`${text.header.nav.home} - ${text.common.brandName}`}
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 transition-transform duration-300 group-hover:scale-105">
            <Calculator className="w-5 h-5" />
          </span>
          <span>{text.common.brandName}</span>
        </Link>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? text.header.closeMenu : text.header.openMenu}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 hover:text-cyan-700 transition-colors"
            >
              {text.header.nav[item.key]}
            </Link>
          ))}

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
            <label htmlFor="header-language" className="sr-only">
              {text.common.language}
            </label>
            <select
              id="header-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as AppLanguage)}
              className="bg-transparent text-xs font-semibold outline-none"
              aria-label={text.common.language}
            >
              {SUPPORTED_LANGUAGES.map((option) => (
                <option key={option} value={option}>
                  {text.common.supportedLanguages[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700">
            {themeIcon}
            <label htmlFor="header-theme" className="sr-only">
              {text.common.theme}
            </label>
            <select
              id="header-theme"
              value={themePreference}
              onChange={(event) => setThemePreference(event.target.value as ThemePreference)}
              className="bg-transparent text-xs font-semibold outline-none"
              aria-label={text.common.theme}
            >
              {THEME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {themeLabelByValue[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {text.header.nav[item.key]}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as AppLanguage)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                aria-label={text.common.language}
              >
                {SUPPORTED_LANGUAGES.map((option) => (
                  <option key={option} value={option}>
                    {text.common.supportedLanguages[option]}
                  </option>
                ))}
              </select>

              <select
                value={themePreference}
                onChange={(event) => setThemePreference(event.target.value as ThemePreference)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                aria-label={text.common.theme}
              >
                {THEME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {themeLabelByValue[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
