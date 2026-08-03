import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regola del Tre Online | CalcolaSubito',
  description: 'Risolvi una proporzione a : b = c : x con la regola del tre. Calcolo immediato della incognita x.',
  keywords: 'regola del tre, proporzioni, incognita, calcolo proporzione, matematica',
  alternates: { canonical: '/regola-del-tre' },
  openGraph: {
    title: 'Regola del Tre Online | CalcolaSubito',
    description: 'Risolvi una proporzione a : b = c : x con la regola del tre. Calcolo immediato della incognita x.',
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
