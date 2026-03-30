import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Eta Online | CalcolaSubito',
  description: 'Scopri la tua eta precisa in anni, mesi e giorni con calcolo immediato e gratuito.',
  keywords: 'calcolo eta, anni mesi giorni, data di nascita',
  openGraph: {
    title: 'Calcolo Eta - CalcolaSubito',
    description: 'Calcola la tua eta in modo preciso e veloce.',
    type: 'website',
  },
}

export default function CalcoloEtaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
