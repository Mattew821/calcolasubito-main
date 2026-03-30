'use client'

import type { ReactNode } from 'react'

interface CalculatorProps {
  title: string
  description: string
  children: ReactNode
  keyword?: string
}

export default function Calculator({
  title,
  description,
  children,
  keyword,
}: CalculatorProps) {
  return (
    <div className="min-h-screen page-surface relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
        <header className="glass-panel rounded-3xl p-8 md:p-10 fade-in-up">
          <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
            {keyword || 'Calcolatore online'}
          </p>
          <h1 className="font-display mt-4 text-3xl md:text-5xl text-slate-900">{title}</h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-3xl">{description}</p>
        </header>

        <section className="portal-card md:p-8 p-6 fade-in-up">{children}</section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 fade-in-up">
          <article className="portal-card">
            <h2 className="font-display text-xl text-slate-900 mb-3">Privacy by design</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tutti i calcoli vengono effettuati sul tuo dispositivo. Nessun input del form viene salvato nei server del portale.
            </p>
          </article>

          <article className="portal-card">
            <h2 className="font-display text-xl text-slate-900 mb-3">Uso professionale</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              I risultati sono accurati a livello operativo. Per pratiche fiscali, legali o mediche usa sempre anche una verifica specialistica.
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}
