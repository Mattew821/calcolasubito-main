import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Sconto Percentuale Online | CalcolaSubito',
  description: 'Calcola risparmio e prezzo finale con sconto percentuale.',
  keywords: 'sconto percentuale, prezzo scontato, calcolo sconto, risparmio',
  openGraph: {
    title: 'Calcolo Sconto Percentuale - CalcolaSubito',
    description: 'Trova subito risparmio e prezzo finale con lo sconto.',
    type: 'website',
  },
}

export default function ScontoPercentualeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

