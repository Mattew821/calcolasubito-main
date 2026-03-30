import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Interesse Composto Online | CalcolaSubito',
  description: 'Simula crescita del capitale con interesse composto e capitalizzazione periodica.',
  keywords: 'interesse composto, capitalizzazione, investimento, crescita capitale',
  openGraph: {
    title: 'Calcolo Interesse Composto - CalcolaSubito',
    description: 'Calcola il rendimento del tuo capitale con interesse composto.',
    type: 'website',
  },
}

export default function InteresseCompostoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

