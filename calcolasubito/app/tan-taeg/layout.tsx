import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo TAN e TAEG Online | CalcolaSubito',
  description: 'Calcola TAN e TAEG di un finanziamento da rata e spese. Tasso effettivo comprensivo di costi iniziali e periodici.',
  keywords: 'calcolo TAN, calcolo TAEG, tasso effettivo, costo finanziamento, tasso annuo',
  alternates: { canonical: '/tan-taeg' },
  openGraph: {
    title: 'Calcolo TAN e TAEG Online | CalcolaSubito',
    description: 'Calcola TAN e TAEG di un finanziamento da rata e spese. Tasso effettivo comprensivo di costi iniziali e periodici.',
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
