import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interesse Semplice Online | CalcolaSubito',
  description: 'Calcola l\'interesse semplice su un capitale. Formula: I = C × r × t. Gratis e preciso.',
  keywords: 'interesse semplice, calcolo interessi, capitale, tasso, tempo',
  alternates: { canonical: '/interesse-semplice' },
  openGraph: {
    title: 'Interesse Semplice - CalcolaSubito',
    description: 'Calcolo lineare degli interessi',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual è la formula dell\'interesse semplice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I = C × r × t (interessi = capitale × tasso × tempo). Montante = C + I = C × (1 + r × t).',
      },
    },
    {
      '@type': 'Question',
      name: 'Quando si usa l\'interesse semplice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prestiti brevi (< 1 anno), titoli di stato a breve scadenza, scoperti conto corrente. Non per investimenti a lungo termine dove vale il composto.',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza pratica tra semplice e composto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Su 10.000€ al 5% per 10 anni: semplice = 5.000€ interessi, composto = 6.289€. Il composto batte il semplice di 1.289€.',
      },
    },
  ],
}

export default function InteresseSempliceLayout({
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