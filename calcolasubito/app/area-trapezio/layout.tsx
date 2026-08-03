import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Area Trapezio Online | CalcolaSubito',
  description: "Calcola l'area di un trapezio da base maggiore, base minore e altezza. Formula (B+b)*h/2, gratis e precisa.",
  keywords: 'area trapezio, calcolo area, geometria, basi e altezza',
  alternates: { canonical: '/area-trapezio' },
  openGraph: {
    title: 'Calcolo Area Trapezio Online | CalcolaSubito',
    description: "Calcola l'area di un trapezio da base maggiore, base minore e altezza. Formula (B+b)*h/2, gratis e precisa.",
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
