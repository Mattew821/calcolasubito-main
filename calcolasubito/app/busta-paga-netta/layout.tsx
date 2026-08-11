import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Busta Paga Netta Online | CalcolaSubito',
  description: 'Calcola lo stipendio netto dalla retribuzione lorda. Simulatore busta paga con ritenute IRPEF, contributi INPS, addizionali regionali/comunali. Aggiornato 2024.',
  keywords: 'busta paga netta, stipendio netto, calcolo stipendio, IRPEF, INPS, trattenute, retribuzione lorda',
  alternates: { canonical: '/busta-paga-netta' },
  openGraph: {
    title: 'Busta Paga Netta - CalcolaSubito',
    description: 'Da lordo a netto in un click',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual è la differenza tra stipendio lordo e netto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lo stipendio lordo è la retribuzione totale prima delle trattenute. Il netto è l\'importo che ricevi effettivamente dopo IRPEF, contributi INPS (9,19% a carico lavoratore) e addizionali regionali/comunali.',
      },
    },
    {
      '@type': 'Question',
      name: 'Le addizionali regionali e comunali sono uguali per tutti?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, variano per regione e comune di residenza. L\'addizionale regionale va dallo 0,7% al 3,33%, quella comunale fino allo 0,8%. Il calcolatore usa medie nazionali.',
      },
    },
    {
      '@type': 'Question',
      name: 'Il calcolo include i bonus fiscali (es. bonus Renzi)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, questo calcolatore mostra la struttura base. I trattamenti integrativi e bonus dipendono da reddito complessivo e composizione familiare.',
      },
    },
    {
      '@type': 'Question',
      name: 'I contributi INPS sono sempre al 9,19%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per i lavoratori dipendenti privati sì (9,19% a carico lavoratore, resto a carico datore). Per pubblici, parasubordinati e altre categorie le aliquote differiscono.',
      },
    },
  ],
}

export default function BustaPagaNettaLayout({
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