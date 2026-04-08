import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Età Online | CalcolaSubito',
  description: 'Scopri la tua età precisa in anni, mesi e giorni con calcolo immediato e gratuito.',
  keywords: 'calcolo età, anni mesi giorni, data di nascita',
  alternates: { canonical: '/calcolo-eta' },
  openGraph: {
    title: 'Calcolo Età - CalcolaSubito',
    description: 'Calcola la tua età in modo preciso e veloce.',
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
