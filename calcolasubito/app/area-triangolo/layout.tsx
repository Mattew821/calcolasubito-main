import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Area Triangolo Online | CalcolaSubito',
  description: "Calcola l'area e il perimetro di un triangolo da base e altezza o dai tre lati, in modo rapido e preciso.",
  keywords: 'area triangolo, calcolo area triangolo, geometria, perimetro',
  alternates: { canonical: '/area-triangolo' },
  openGraph: {
    title: 'Calcolo Area Triangolo Online | CalcolaSubito',
    description: "Calcola l'area e il perimetro di un triangolo da base e altezza o dai tre lati, in modo rapido e preciso.",
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
