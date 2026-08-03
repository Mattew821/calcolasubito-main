import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teorema di Pitagora Online | CalcolaSubito',
  description: "Calcola l'ipotenusa di un triangolo rettangolo dai due cateti. Formula c = radice(a^2 + b^2), gratis e precisa.",
  keywords: 'teorema di pitagora, ipotenusa, cateti, triangolo rettangolo, geometria',
  alternates: { canonical: '/teorema-pitagora' },
  openGraph: {
    title: 'Teorema di Pitagora Online | CalcolaSubito',
    description: "Calcola l'ipotenusa di un triangolo rettangolo dai due cateti. Formula c = radice(a^2 + b^2), gratis e precisa.",
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
