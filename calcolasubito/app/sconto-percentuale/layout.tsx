import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sconto Percentuale Online | CalcolaSubito',
  description: 'Calcola lo sconto percentuale su un prezzo. Prezzo scontato, risparmio, percentuale di sconto. Gratis e preciso.',
  keywords: 'sconto percentuale, calcolo sconto, prezzo scontato, risparmio, offerta',
  alternates: { canonical: '/sconto-percentuale' },
  openGraph: {
    title: 'Sconto Percentuale - CalcolaSubito',
    description: 'Quanto risparmi con lo sconto?',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola lo sconto percentuale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sconto = Prezzo × % / 100. Prezzo finale = Prezzo - Sconto. % sconto = (Prezzo - Finale) / Prezzo × 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Due sconti consecutivi si sommano?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. 20% + 20% ≠ 40%. Secondo sconto si applica sul prezzo già scontato. Es: 100€ -20% = 80€ -20% = 64€ (sconto totale 36%, non 40%).',
      },
    },
    {
      '@type': 'Question',
      name: 'Come calcolare il prezzo originale da quello scontato?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prezzo originale = Prezzo scontato / (1 - %/100). Es: 80€ con 20% sconto → 80 / 0,8 = 100€.',
      },
    },
  ],
}

export default function ScontoPercentualeLayout({
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