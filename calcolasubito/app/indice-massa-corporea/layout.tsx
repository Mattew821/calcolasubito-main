import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo BMI Online | CalcolaSubito',
  description: 'Calcola indice di massa corporea (BMI) con peso e altezza.',
  keywords: 'bmi, indice massa corporea, calcolo bmi, peso altezza',
  openGraph: {
    title: 'Calcolo BMI - CalcolaSubito',
    description: 'Scopri il tuo indice di massa corporea in pochi secondi.',
    type: 'website',
  },
}

export default function IndiceMassaCorporeaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

