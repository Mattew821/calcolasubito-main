import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aumento Percentuale Online | CalcolaSubito',
  description: 'Calcola l\'aumento percentuale su un valore. Valore finale, incremento assoluto, percentuale di aumento. Gratis e preciso.',
  keywords: 'aumento percentuale, calcolo aumento, incremento percentuale, variazione percentuale',
  alternates: { canonical: '/aumento-percentuale' },
  openGraph: {
    title: 'Aumento Percentuale - CalcolaSubito',
    description: 'Calcola l\'incremento percentuale',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola l\'aumento percentuale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aumento = Valore × % / 100. Valore finale = Valore + Aumento. % aumento = (Finale - Iniziale) / Iniziale × 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza tra aumento e sconto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Matematicamente identici ma segno opposto. Aumento: valore finale > iniziale. Sconto: valore finale < iniziale.',
      },
    },
  ],
}

export default function AumentoPercentualeLayout({
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