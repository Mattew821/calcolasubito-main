import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generatore Numeri Casuali Online | CalcolaSubito',
  description: 'Estrai numeri casuali in un intervallo personalizzato, con o senza ripetizioni.',
  keywords: 'numeri casuali, generatore random, estrazione numeri, calcolatore random',
  openGraph: {
    title: 'Generatore Numeri Casuali - CalcolaSubito',
    description: 'Genera estrazioni casuali in pochi secondi.',
    type: 'website',
  },
}

export default function NumeriCasualiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
