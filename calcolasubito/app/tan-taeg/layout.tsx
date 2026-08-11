import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TAN TAEG Calcolo Online | CalcolaSubito',
  description: 'Calcola TAN e TAEG di un finanziamento. Simulatore trasparente per confrontare offerte di prestiti e mutui. Gratis e preciso.',
  keywords: 'calcolo TAN TAEG, tasso annuo nominale, tasso effettivo globale, costo finanziamento, prestito, mutuo',
  alternates: { canonical: '/tan-taeg' },
  openGraph: {
    title: 'TAN TAEG - CalcolaSubito',
    description: 'Confronta il vero costo del credito',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual è la differenza tra TAN e TAEG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il TAN (Tasso Annuo Nominale) è il tasso di interesse puro. Il TAEG (Tasso Annuo Effettivo Globale) include TAN + spese accessorie (istruttoria, incasso rata, assicurazioni obbligatorie). Il TAEG è il vero costo del credito.',
      },
    },
    {
      '@type': 'Question',
      name: 'Il TAEG è sempre più alto del TAN?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sì, perché include le spese. Se non ci sono spese accessorie, TAN = TAEG.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa includono le spese accessorie nel TAEG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Istruttoria, spese incasso rata, assicurazioni obbligatorie, perizie, oneri fiscali. Non includono penali estinzione anticipata né assicurazioni facoltative.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso confrontare mutui con TAEG diversi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sì, il TAEG è l\'indicatore standard per confrontare offerte di credito diverse a parità di durata e importo.',
      },
    },
  ],
}

export default function TanTaegLayout({
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