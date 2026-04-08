import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Area Rettangolo Online | CalcolaSubito',
  description: 'Calcola l area del rettangolo partendo da base e altezza.',
  keywords: 'area rettangolo, calcolo area, geometria, base altezza',
  alternates: { canonical: '/area-rettangolo' },
  openGraph: {
    title: 'Calcolo Area Rettangolo - CalcolaSubito',
    description: 'Trova l area del rettangolo in pochi click.',
    type: 'website',
  },
}

export default function AreaRettangoloLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

