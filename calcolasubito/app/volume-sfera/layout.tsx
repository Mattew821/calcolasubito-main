import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Volume Sfera Online | CalcolaSubito',
  description: 'Calcola volume e superficie di una sfera dal raggio. Formula 4/3 pi greco r cubo, gratis e preciso.',
  keywords: 'volume sfera, calcolo volume, geometria, superficie sfera',
  alternates: { canonical: '/volume-sfera' },
  openGraph: {
    title: 'Calcolo Volume Sfera Online | CalcolaSubito',
    description: 'Calcola volume e superficie di una sfera dal raggio. Formula 4/3 pi greco r cubo, gratis e preciso.',
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
