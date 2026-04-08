import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Percentuali Online Gratuito | CalcolaSubito',
  description: 'Calcola percentuali, sconti e proporzioni online gratis. Strumento preciso e veloce per qualsiasi calcolo percentuale. Nessuna registrazione richiesta.',
  keywords: 'calcolo percentuali, sconto percentuale, percentuale di, aumento percentuale, proporzioni',
  alternates: { canonical: '/percentuali' },
  openGraph: {
    title: 'Calcolo Percentuali - CalcolaSubito',
    description: 'Calcola facilmente percentuali, sconti e proporzioni',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come calcolare uno sconto percentuale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Calcola la percentuale del prezzo originale, poi sottrai dal totale. Esempio: prezzo 100€, sconto 20%. Sconto = 100 × 20 ÷ 100 = 20€. Prezzo finale = 100 - 20 = 80€.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quale percentuale è 15 su 60?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dividi 15 per 60 e moltiplica per 100: (15 ÷ 60) × 100 = 25%. Quindi 15 è il 25% di 60.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come calcolo un aumento percentuale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Se un valore è 100 e aumenta del 10%, il nuovo valore è 100 + (100 × 10 ÷ 100) = 110.',
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

