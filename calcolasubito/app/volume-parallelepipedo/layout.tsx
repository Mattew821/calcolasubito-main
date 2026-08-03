import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Volume Parallelepipedo Online | CalcolaSubito',
  description: 'Calcola il volume e la superficie di un parallelepipedo rettangolo da lunghezza, larghezza e altezza.',
  keywords: 'volume parallelepipedo, calcolo volume, geometria, superficie',
  alternates: { canonical: '/volume-parallelepipedo' },
  openGraph: {
    title: 'Calcolo Volume Parallelepipedo Online | CalcolaSubito',
    description: 'Calcola il volume e la superficie di un parallelepipedo rettangolo da lunghezza, larghezza e altezza.',
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
