import Link from 'next/link'
import { CALCULATOR_CATALOG, CALCULATOR_CATEGORIES } from '@/lib/calculator-catalog'

export const metadata = {
  title: 'Chi Siamo | CalcolaSubito',
  description:
    'Scopri la missione di CalcolaSubito: calcolatori online gratuiti, affidabili e facili da usare.',
  alternates: {
    canonical: '/about',
  },
}

const POPULARITY_SCORE = {
  'Molto Alto': 3,
  Alto: 2,
  Medio: 1,
} as const

const highlightedCalculators = [...CALCULATOR_CATALOG]
  .sort((a, b) => POPULARITY_SCORE[b.popularity] - POPULARITY_SCORE[a.popularity])
  .slice(0, 8)

export default function AboutPage() {
  return (
    <div className="min-h-screen page-surface relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="hero-orb hero-orb-1" data-parallax data-parallax-speed="7" />
        <div className="hero-orb hero-orb-2" data-parallax data-parallax-speed="11" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
        <header className="glass-panel rounded-3xl p-8 md:p-10 fade-in-up" data-reveal>
          <h1 className="font-display text-3xl md:text-5xl text-slate-900">Chi Siamo</h1>
          <p className="mt-4 text-slate-600 text-base md:text-lg">
            CalcolaSubito nasce con un obiettivo semplice: offrire strumenti di calcolo online
            gratuiti, chiari e veloci, utili nella vita quotidiana, nello studio e nel lavoro.
          </p>
        </header>

        <section className="portal-card interactive-lift fade-in-up space-y-4" data-reveal>
          <h2 className="font-display text-2xl text-slate-900">Il Portale Oggi</h2>
          <p className="text-slate-600">
            Il portale include <strong>{CALCULATOR_CATALOG.length} calcolatori</strong> organizzati
            in <strong>{CALCULATOR_CATEGORIES.length} categorie</strong>.
          </p>
          <div className="flex flex-wrap gap-2">
            {CALCULATOR_CATEGORIES.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700"
              >
                {category}
              </span>
            ))}
          </div>
        </section>

        <section className="portal-card interactive-lift fade-in-up space-y-4" data-reveal>
          <h2 className="font-display text-2xl text-slate-900">Calcolatori Più Utilizzati</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highlightedCalculators.map((calculator) => (
              <li key={calculator.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <Link href={`/${calculator.id}`} className="font-semibold text-cyan-700 hover:underline">
                  {calculator.title}
                </Link>
                <p className="text-sm text-slate-600 mt-1">{calculator.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="portal-card interactive-lift fade-in-up space-y-4" data-reveal>
          <h2 className="font-display text-2xl text-slate-900">Affidabilità e Privacy</h2>
          <p className="text-slate-600">
            I calcoli vengono eseguiti nel browser dell&apos;utente. Per contesti fiscali, sanitari o
            legali, i risultati devono essere sempre verificati con un professionista.
          </p>
        </section>

        <section className="portal-card interactive-lift fade-in-up space-y-4" data-reveal>
          <h2 className="font-display text-2xl text-slate-900">Qualità dei contenuti</h2>
          <p className="text-slate-600">
            Ogni area del sito viene aggiornata per mantenere una struttura chiara, con una
            descrizione utile del problema risolto e del contesto d&apos;uso. Questo aiuta gli utenti
            a capire subito se il calcolatore è adatto al loro caso.
          </p>
          <p className="text-slate-600">
            I contenuti sono pensati per essere concreti: esempi reali, nomi comprensibili,
            categorizzazione coerente e collegamenti rapidi verso strumenti affini.
          </p>
        </section>

        <section className="portal-card interactive-lift fade-in-up space-y-4" data-reveal>
          <h2 className="font-display text-2xl text-slate-900">Uso corretto del portale</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>Usa il calcolatore più vicino al tuo scenario reale.</li>
            <li>Se hai dubbi su unità, periodi o formule, leggi prima la descrizione.</li>
            <li>Per situazioni fiscali, mediche o legali, verifica sempre il risultato con un esperto.</li>
            <li>Preferisci i percorsi guidati quando il problema ha varianti o casi limite.</li>
          </ul>
        </section>

        <section className="portal-card interactive-lift fade-in-up space-y-3" data-reveal>
          <h2 className="font-display text-2xl text-slate-900">Contatti</h2>
          <p className="text-slate-600">
            Per segnalazioni o suggerimenti puoi scrivere a{' '}
            <a href="mailto:calcolasubito@gmail.com" className="text-cyan-700 hover:underline">
              calcolasubito@gmail.com
            </a>
            .
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-cyan-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/cookie" className="text-cyan-700 hover:underline">
              Cookie Policy
            </Link>
            <Link href="/" className="text-cyan-700 hover:underline">
              Torna alla Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

