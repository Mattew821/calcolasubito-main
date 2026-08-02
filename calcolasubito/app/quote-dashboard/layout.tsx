import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quote Dashboard | Pricing Engine Validato',
  description: 'Motore quote con validazione speculare tra frontend e backend, sanity check e CMP anti-drift.',
  keywords: 'quote dashboard, pricing engine, zod, pydantic, cmp, validation',
  alternates: { canonical: '/quote-dashboard' },
  openGraph: {
    title: 'Quote Dashboard - CalcolaSubito',
    description: 'Motore pricing con validazione zero-drift',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'A cosa serve il CMP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CMP confronta input e risposta per intercettare deviazioni di contratto, campo o calcolo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Perche il sanity check blocca alcune quote?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il sistema impedisce risultati sotto una soglia minima per evitare output non plausibili o degradati.',
      },
    },
  ],
}

export default function QuoteDashboardLayout({
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
