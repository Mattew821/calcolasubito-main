import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Media Voti Ponderata Online | CalcolaSubito',
  description: 'Calcola media voti ponderata con crediti e peso di ogni esame.',
  keywords: 'media voti ponderata, media universita, calcolo crediti, esami',
  alternates: { canonical: '/media-voti' },
  openGraph: {
    title: 'Calcolo Media Voti Ponderata - CalcolaSubito',
    description: 'Calcola media pesata di voti e crediti in modo immediato.',
    type: 'website',
  },
}

export default function MediaVotiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

