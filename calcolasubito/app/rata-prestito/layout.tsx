import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Rata Prestito Online | CalcolaSubito',
  description: 'Simula la rata del prestito con tasso e durata: importo mensile, interessi e totale finanziamento.',
  keywords: 'rata prestito, calcolo finanziamento, simulazione prestito',
  alternates: { canonical: '/rata-prestito' },
  openGraph: {
    title: 'Rata Prestito - CalcolaSubito',
    description: 'Calcola subito la rata mensile del tuo prestito.',
    type: 'website',
  },
}

export default function RataPrestitoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
