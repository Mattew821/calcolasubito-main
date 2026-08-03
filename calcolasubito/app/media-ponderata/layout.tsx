import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Media Ponderata Online | CalcolaSubito',
  description: 'Calcola la media ponderata con pesi personalizzati. Ideale per voti scolastici e universitari con crediti.',
  keywords: 'media ponderata, calcolo media, voti con crediti, media universitaria',
  alternates: { canonical: '/media-ponderata' },
  openGraph: {
    title: 'Calcolo Media Ponderata Online | CalcolaSubito',
    description: 'Calcola la media ponderata con pesi personalizzati. Ideale per voti scolastici e universitari con crediti.',
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
