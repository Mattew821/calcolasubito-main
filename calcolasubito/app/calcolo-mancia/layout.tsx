import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Mancia Online | CalcolaSubito',
  description: 'Calcola mancia, totale del conto e divisione per persona per ristorante, bar o delivery.',
  keywords: 'calcolo mancia, dividere conto, tip calculator',
  alternates: { canonical: '/calcolo-mancia' },
  openGraph: {
    title: 'Calcolo Mancia - CalcolaSubito',
    description: 'Calcola mancia e quota per persona in pochi click.',
    type: 'website',
  },
}

export default function CalcoloManciaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
