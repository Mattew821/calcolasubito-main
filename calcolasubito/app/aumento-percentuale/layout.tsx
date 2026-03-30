import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Aumento Percentuale Online | CalcolaSubito',
  description: 'Calcola aumento percentuale, incremento assoluto e valore finale.',
  keywords: 'aumento percentuale, incremento percentuale, calcolo aumento',
  openGraph: {
    title: 'Calcolo Aumento Percentuale - CalcolaSubito',
    description: 'Ottieni incremento e valore finale in pochi secondi.',
    type: 'website',
  },
}

export default function AumentoPercentualeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

