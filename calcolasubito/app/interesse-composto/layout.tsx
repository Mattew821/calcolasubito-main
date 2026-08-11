import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interesse Composto Online | CalcolaSubito',
  description: 'Calcola l\'interesse composto su un capitale. Simulatore con versamenti periodici, capitalizzazione composta e grafico crescita. Gratis e preciso.',
  keywords: 'interesse composto, capitalizzazione composta, interesse su interesse, crescita capitale, montante',
  alternates: { canonical: '/interesse-composto' },
  openGraph: {
    title: 'Interesse Composto - CalcolaSubito',
    description: 'La forza degli interessi sugli interessi',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual è la formula dell\'interesse composto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'M = C × (1 + r)^t, dove M = montante finale, C = capitale iniziale, r = tasso per periodo, t = numero periodi. Con versamenti periodici: M = C(1+r)^t + PMT × [(1+r)^t - 1] / r.',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza tra interesse semplice e composto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Semplice: interessi solo sul capitale iniziale. Composto: interessi generano a loro volta interessi (capitalizzazione). A parità di tasso e tempo, il composto rende sempre di più.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa significa capitalizzazione annua/semestrale/mensile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Frequenza con cui gli interessi vengono aggiunti al capitale. Più frequente = rendimento effettivo più alto. Tasso annuo nominale 5%: mensile = 5,12% effettivo, giornaliero = 5,13%.',
      },
    },
    {
      '@type': 'Question',
      name: 'La regola del 72 funziona sempre?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Approssimazione: anni per raddoppiare ≈ 72 / tasso%. Funziona bene tra 5-10%. Per tassi molto alti/bassi usa il calcolo esatto: ln(2)/ln(1+r).',
      },
    },
  ],
}

export default function InteresseCompostoLayout({
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