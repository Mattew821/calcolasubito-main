import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stima Pensione Online | CalcolaSubito',
  description: 'Stima la tua pensione pubblica futura. Calcolo basato su stipendio attuale, età, anni di contributi e tasso di crescita salariale. Gratis e preciso.',
  keywords: 'stima pensione, calcolo pensione, pensione pubblica, previdenza, INPS, montante contributivo',
  alternates: { canonical: '/stima-pensione' },
  openGraph: {
    title: 'Stima Pensione - CalcolaSubito',
    description: 'Calcola la tua pensione futura online',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come viene calcolata la pensione nel sistema contributivo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il sistema contributivo calcola la pensione moltiplicando il montante contributivo (contributi versati rivalutati) per il coefficiente di trasformazione basato sull\'età di pensionamento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa significa rivalutazione del montante?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I contributi versati negli anni passati vengono rivalutati annualmente in base al PIL nominale (tasso di rivalutazione), per mantenere il potere d\'acquisto.',
      },
    },
    {
      '@type': 'Question',
      name: 'La crescita salariale futura è garantita?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, il tasso di crescita inserito è una stima ipotetica. I risultati sono indicativi e non costituiscono previsione certa.',
      },
    },
    {
      '@type': 'Question',
      name: 'Il calcolo include la quota di pensione maturata nel sistema retributivo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Questo calcolatore usa il sistema contributivo puro. Per carriere miste (retributivo + contributivo) serve un calcolo più complesso.',
      },
    },
  ],
}

export default function StimaPensioneLayout({
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