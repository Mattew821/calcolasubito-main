import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Rata Leasing Online | CalcolaSubito',
  description: 'Calcola la rata del leasing con anticipo e valore residuo. Simulatore finanziario preciso con tasso annuo.',
  keywords: 'rata leasing, calcolo leasing, canone leasing, finanziamento auto',
  alternates: { canonical: '/rata-leasing' },
  openGraph: {
    title: 'Calcolo Rata Leasing Online | CalcolaSubito',
    description: 'Calcola la rata del leasing con anticipo e valore residuo. Simulatore finanziario preciso con tasso annuo.',
    type: 'website',
  },
}

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
