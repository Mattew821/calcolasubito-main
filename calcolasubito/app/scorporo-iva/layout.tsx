import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Scorporo IVA Online Gratuito | CalcolaSubito',
  description: 'Scorporo IVA online: calcola l\'imponibile da un importo lordo o applica IVA a un importo netto. Aliquote italiane 4%, 5%, 10%, 22%. Gratis e senza registrazione.',
  keywords: 'scorporo IVA, calcolo IVA, IVA 22%, imponibile, ritenuta IVA, calcolo imposte',
  openGraph: {
    title: 'Calcolo Scorporo IVA - CalcolaSubito',
    description: 'Calcola facilmente lo scorporo IVA con tutte le aliquote italiane',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola il scorporo dall\'importo lordo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Formula: IVA = (Importo Lordo × Aliquota) ÷ (100 + Aliquota). Importo Netto = Importo Lordo - IVA',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual è la differenza tra lordo e netto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lordo significa con IVA inclusa, netto significa senza IVA. Il nostro calcolatore converte tra i due.',
      },
    },
  ],
}

export default function ScorporoIvaLayout({
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

