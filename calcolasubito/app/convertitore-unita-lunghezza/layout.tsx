import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Convertitore Lunghezze Online | CalcolaSubito',
  description: 'Converti metri in chilometri, centimetri, millimetri, miglia, piedi e pollici in tempo reale.',
  keywords: 'convertitore unita lunghezza, metri km cm mm miglia piedi pollici',
  openGraph: {
    title: 'Convertitore Lunghezze - CalcolaSubito',
    description: 'Conversione precisa delle unita di lunghezza.',
    type: 'website',
  },
}

export default function ConvertitoreUnitaLunghezzaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
