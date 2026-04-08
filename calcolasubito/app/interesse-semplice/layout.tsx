import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Interesse Semplice Online | CalcolaSubito',
  description: 'Calcola interessi semplici su capitale, tasso annuo e durata.',
  keywords: 'interesse semplice, calcolo interessi, tasso annuo, capitale',
  alternates: { canonical: '/interesse-semplice' },
  openGraph: {
    title: 'Calcolo Interesse Semplice - CalcolaSubito',
    description: 'Calcola rapidamente interessi e importo finale.',
    type: 'website',
  },
}

export default function InteresseSempliceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

