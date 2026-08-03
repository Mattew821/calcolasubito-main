import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Rivalutazione Monetaria Online | CalcolaSubito',
  description: 'Calcola la rivalutazione monetaria di un importo per inflazione, con capitalizzazione annuale o mensile.',
  keywords: 'rivalutazione monetaria, inflazione, calcolo rivalutazione, ISTAT',
  alternates: { canonical: '/rivalutazione-monetaria' },
  openGraph: {
    title: 'Calcolo Rivalutazione Monetaria Online | CalcolaSubito',
    description: 'Calcola la rivalutazione monetaria di un importo per inflazione, con capitalizzazione annuale o mensile.',
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
