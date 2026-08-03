import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Volume Cilindro Online | CalcolaSubito',
  description: 'Calcola volume, area laterale e superficie totale di un cilindro da raggio e altezza. Gratis e preciso.',
  keywords: 'volume cilindro, calcolo volume, geometria, area cilindro',
  alternates: { canonical: '/volume-cilindro' },
  openGraph: {
    title: 'Calcolo Volume Cilindro Online | CalcolaSubito',
    description: 'Calcola volume, area laterale e superficie totale di un cilindro da raggio e altezza. Gratis e preciso.',
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
