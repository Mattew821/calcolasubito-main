import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Area Cerchio Online | CalcolaSubito',
  description: "Calcola l'area del cerchio a partire dal raggio in modo rapido e preciso.",
  keywords: 'area cerchio, calcolo area cerchio, geometria, raggio',
  openGraph: {
    title: 'Calcolo Area Cerchio - CalcolaSubito',
    description: "Calcola l'area del cerchio in pochi secondi.",
    type: 'website',
  },
}

export default function AreaCerchioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
