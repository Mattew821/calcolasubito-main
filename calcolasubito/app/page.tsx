'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Calculator, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import AdUnit from '@/components/AdUnit'
import { useAppPreferences } from '@/components/AppPreferencesProvider'
import {
  CALCULATOR_CATALOG,
  CALCULATOR_CATEGORIES,
  type CalculatorCategory,
} from '@/lib/calculator-catalog'

const POPULARITY_SCORE = {
  'Molto Alto': 3,
  Alto: 2,
  Medio: 1,
} as const

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory | 'all'>('all')
  const { text } = useAppPreferences()

  const highlightedCalculators = useMemo(
    () =>
      [...CALCULATOR_CATALOG]
        .sort((a, b) => POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity])
        .slice(0, 4),
    []
  )

  const filteredCalculators = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return CALCULATOR_CATALOG.filter((calculator) => {
      const matchesCategory = activeCategory === 'all' || calculator.category === activeCategory
      if (!matchesCategory) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const searchableText = [
        calculator.title,
        calculator.description,
        calculator.category,
        ...calculator.tags,
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    }).sort((a, b) => {
      const popularityDiff = POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity]
      if (popularityDiff !== 0) {
        return popularityDiff
      }
      return a.title.localeCompare(b.title)
    })
  }, [activeCategory, query])

  return (
    <div className="min-h-screen page-surface relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="hero-orb hero-orb-1" data-parallax data-parallax-speed="7" />
        <div className="hero-orb hero-orb-2" data-parallax data-parallax-speed="11" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10">
        <section className="glass-panel rounded-3xl p-8 md:p-12 fade-in-up" data-reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-sky-700 mb-5">
            <Sparkles className="w-4 h-4" />
            {text.home.badge}
          </div>

          <h1 className="font-display text-4xl md:text-6xl leading-tight text-slate-900 max-w-4xl">
            {text.home.title}
          </h1>

          <p className="mt-4 text-base md:text-xl text-slate-600 max-w-3xl">
            {text.home.subtitle}
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
            <label className="relative block">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.home.searchPlaceholder}
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                aria-label={text.home.searchAriaLabel}
              />
            </label>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <SlidersHorizontal className="w-4 h-4" />
              <span>{filteredCalculators.length} {text.home.resultsLabel}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={text.home.categoryFilterLabel}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`category-chip ${activeCategory === 'all' ? 'category-chip-active' : ''}`}
            >
              {text.home.allCategories}
            </button>
            {CALCULATOR_CATEGORIES.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-chip ${activeCategory === category ? 'category-chip-active' : ''}`}
              >
                {text.categories[category]}
              </button>
            ))}
          </div>
        </section>

        <AdUnit adSlot="1234567890" />

        <section className="space-y-4 fade-in-up" id="calcolatori">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-slate-900">{text.home.allCalculatorsTitle}</h2>
              <p className="text-slate-600">{text.home.allCalculatorsSubtitle}</p>
            </div>
          </div>

          {filteredCalculators.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
              {text.home.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" data-reveal-stagger>
              {filteredCalculators.map((calculator) => (
                <Link
                  key={calculator.id}
                  href={`/${calculator.id}`}
                  className="calculator-card interactive-lift"
                  data-stagger-item
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-700 grid place-items-center">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <span className="badge-popularity">{text.popularity[calculator.popularity]}</span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {calculator.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{calculator.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {text.categories[calculator.category]}
                    </span>
                    <span className="text-sm font-semibold text-cyan-700">{text.home.openCalculator}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <AdUnit adSlot="1234567891" />

        <section className="glass-panel rounded-3xl p-7 md:p-9 fade-in-up" data-reveal>
          <h2 className="font-display text-2xl md:text-3xl text-slate-900">{text.home.highlightedTitle}</h2>
          <p className="mt-2 text-slate-600">{text.home.highlightedSubtitle}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" data-reveal-stagger>
            {highlightedCalculators.map((calculator) => (
              <Link
                key={calculator.id}
                href={`/${calculator.id}`}
                className="highlight-card interactive-lift"
                data-stagger-item
              >
                <p className="text-sm uppercase tracking-wide text-cyan-700 font-semibold">{text.categories[calculator.category]}</p>
                <h3 className="font-semibold text-slate-900 text-lg mt-1">{calculator.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{calculator.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit adSlot="1234567892" />
      </div>
    </div>
  )
}
