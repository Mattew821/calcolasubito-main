import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rivalutazione Monetaria Online | CalcolaSubito',
  description: 'Calcola la rivalutazione monetaria di un importo per adeguarlo all\'inflazione. Formula esatta con tasso mensile composto (1+r)^(1/12)-1. Gratis e preciso.',
  keywords: 'rivalutazione monetaria, calcolo inflazione, adeguamento monetario, potere acquisto, ISTAT, coefficienti rivalutazione',
  alternates: { canonical: '/rivalutazione-monetaria' },
  openGraph: {
    title: 'Rivalutazione Monetaria - CalcolaSubito',
    description: 'Adegua un importo all\'inflazione nel tempo',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Cos\'è la rivalutazione monetaria?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'È l\'adeguamento di un importo di denaro per tener conto della perdita di potere d\'acquisto dovuta all\'inflazione nel tempo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Perché si usa il tasso mensile composto e non la divisione semplice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il tasso mensile esatto è (1+r)^(1/12)-1, non r/12. La capitalizzazione composta mensile produce risultati più accurati, specialmente su orizzonti lunghi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quali coefficienti ISTAT usa il calcolatore?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il calcolatore accetta un tasso di inflazione annuo personalizzato. Per calcoli ufficiali si usano i coefficienti ISTAT annuali (FOI per famiglie operai/impiegati).',
      },
    },
    {
      '@type': 'Question',
      name: 'Si può usare per adeguare canoni di affitto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sì, la rivalutazione monetaria è la base per l\'adeguamento ISTAT dei canoni di locazione (75% o 100% dell\'inflazione FOI a seconda del contratto).',
      },
    },
  ],
}

export default function RivalutazioneMonetariaLayout({
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