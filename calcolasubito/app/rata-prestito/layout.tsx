import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rata Prestito Online | CalcolaSubito',
  description: 'Calcola la rata mensile di un prestito personale. Simulatore con piano di ammortamento, TAN, TAEG e costo totale. Gratis e preciso.',
  keywords: 'rata prestito, calcolo prestito, ammortamento, finanziamento, prestito personale, rata mensile',
  alternates: { canonical: '/rata-prestito' },
  openGraph: {
    title: 'Rata Prestito - CalcolaSubito',
    description: 'Calcola la rata del tuo prestito',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola la rata di un prestito?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rata = Capitale × [r × (1+r)^n] / [(1+r)^n - 1], dove r = TAN/12 (tasso mensile), n = numero rate. Formula del piano di ammortamento alla francese (rate costanti).',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa include il costo totale del prestito?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Capitale + interessi totali + spese accessorie (istruttoria, incasso rata, assicurazioni). Il TAEG sintetizza tutto in un unico tasso percentuale annuo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso estinguere il prestito anticipatamente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sì, per legge (D.Lgs 385/1993) puoi estinguere in qualsiasi momento. La penale massima è 1% del capitale residuo (0,5% se residuo ≤ 1 anno).',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza tra prestito personale e cessione del quinto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prestito personale: rata pagata direttamente, importo libero. Cessione del quinto: rata trattenuta da stipendio/pensione (max 1/5), tasso spesso più basso, assicurazione obbligatoria.',
      },
    },
  ],
}

export default function RataPrestitoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {children}
    </>
  )
}