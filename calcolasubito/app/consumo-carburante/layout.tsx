import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Consumo Carburante Online | CalcolaSubito',
  description: 'Calcola consumo auto in km/l e l/100km partendo da distanza e litri.',
  keywords: 'consumo carburante, km litro, l 100km, calcolo consumi auto',
  alternates: { canonical: '/consumo-carburante' },
  openGraph: {
    title: 'Calcolo Consumo Carburante - CalcolaSubito',
    description: 'Calcola rapidamente il consumo del tuo veicolo.',
    type: 'website',
  },
}

export default function ConsumoCarburanteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

