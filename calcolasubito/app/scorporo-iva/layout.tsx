import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scorporo IVA Online | CalcolaSubito',
  description: 'Scorpora l\'IVA da un prezzo lordo. Calcola imponibile, IVA e netto da importo incluso IVA. Aliquote 4%, 10%, 22%. Gratis e preciso.',
  keywords: 'scorporo IVA, calcolo IVA, imponibile, prezzo lordo, prezzo netto, aliquota IVA',
  alternates: { canonical: '/scorporo-iva' },
  openGraph: {
    title: 'Scorporo IVA - CalcolaSubito',
    description: 'Da lordo a netto + IVA',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si scorpora l\'IVA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Imponibile = Lordo / (1 + %IVA/100). IVA = Lordo - Imponibile. Es: 122€ con IVA 22% → 122 / 1,22 = 100€ imponibile, 22€ IVA.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quali sono le aliquote IVA in Italia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '4% (beni primari, editoria), 10% (ristorazione, turismo, farmaci), 22% (aliquota ordinaria, maggior parte beni/servizi).',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza tra scorporo e calcolo IVA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scorporo: parti da prezzo lordo (incluso IVA) per trovare imponibile. Calcolo IVA: parti da imponibile per trovare lordo.',
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