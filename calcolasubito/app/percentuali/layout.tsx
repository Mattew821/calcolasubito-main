import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Percentuali Online | CalcolaSubito',
  description: 'Calcolo percentuali: percentuale di un numero, variazione percentuale, percentuale inversa. Gratis e preciso.',
  keywords: 'calcolo percentuali, percentuale, variazione percentuale, percentuale inversa',
  alternates: { canonical: '/percentuali' },
  openGraph: {
    title: 'Percentuali - CalcolaSubito',
    description: 'Tutti i calcoli con le percentuali',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come calcolare la percentuale di un numero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentuale = Numero × % / 100. Es: 20% di 150 = 150 × 20 / 100 = 30.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come calcolare la variazione percentuale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Variazione % = (Finale - Iniziale) / Iniziale × 100. Positivo = aumento, negativo = diminuzione.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come trovare il numero sapendo la percentuale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Numero = Percentuale × 100 / %. Es: 30 è il 20% di che numero? 30 × 100 / 20 = 150.',
      },
    },
  ],
}

export default function PercentualiLayout({
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