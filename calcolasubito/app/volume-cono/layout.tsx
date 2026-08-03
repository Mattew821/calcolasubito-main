import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Volume Cono Online | CalcolaSubito',
  description: 'Calcola il volume di un cono da raggio e altezza. Formula pi greco per raggio al quadrato per altezza diviso 3.',
  keywords: 'volume cono, calcolo volume, geometria, cono circolare',
  alternates: { canonical: '/volume-cono' },
  openGraph: {
    title: 'Calcolo Volume Cono Online | CalcolaSubito',
    description: 'Calcola il volume di un cono da raggio e altezza. Formula pi greco per raggio al quadrato per altezza diviso 3.',
    type: 'website',
  },
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
