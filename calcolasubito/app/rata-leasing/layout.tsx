import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rata Leasing Online | CalcolaSubito',
  description: 'Calcola la rata di un leasing auto/strumentale. Simulatore con canone mensile, valore di riscatto, durata e tasso. Gratis e preciso.',
  keywords: 'rata leasing, calcolo leasing, leasing auto, leasing strumentale, canone leasing, riscatto',
  alternates: { canonical: '/rata-leasing' },
  openGraph: {
    title: 'Rata Leasing - CalcolaSubito',
    description: 'Calcola il canone del tuo leasing',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola la rata di un leasing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simile al prestito ma con valore di riscatto finale. Rata = (Capitale - Riscatto/(1+r)^n) × [r × (1+r)^n] / [(1+r)^n - 1]. Il riscatto riduce la rata rispetto a un prestito uguale.',
      },
    },
    {
      '@type': 'Question',
      name: 'Differenza tra leasing finanziario e operativo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Finanziario: sei proprietario economico, rischi/benefici tuoi, riscatto finale. Operativo: noleggio a lungo termine, manutenzione inclusa, restituisci il bene.',
      },
    },
    {
      '@type': 'Question',
      name: 'Il leasing è deducibile fiscalmente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Leasing finanziario: quote capitale ammortizzabili, interessi deducibili. Leasing operativo: canoni interamente deducibili (limiti per auto). Auto: deducibilità limitata al 20-80% per uso promiscuo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso riscattare l\'auto prima della scadenza?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dipende dal contratto. Spesso possibile con penale. Valuta costo riscatto anticipato vs rate residue + riscatto finale.',
      },
    },
  ],
}

export default function RataLeasingLayout({
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