import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media Ponderata Online | CalcolaSubito',
  description: 'Calcola la media ponderata di valori con pesi diversi. Voti, valutazioni, indici. Gratis e preciso.',
  keywords: 'media ponderata, calcolo media, media pesata, voti, valutazioni',
  alternates: { canonical: '/media-ponderata' },
  openGraph: {
    title: 'Media Ponderata - CalcolaSubito',
    description: 'Media con pesi differenti',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola la media ponderata?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Media = Σ(valore × peso) / Σ(pesi). Ogni valore contribuisce in proporzione al suo peso.',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza tra media aritmetica e ponderata?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aritmetica: tutti i valori hanno peso uguale (1). Ponderata: ogni valore ha peso specifico. Es: esami con CFU diversi usano media ponderata.',
      },
    },
  ],
}

export default function MediaPonderataLayout({
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