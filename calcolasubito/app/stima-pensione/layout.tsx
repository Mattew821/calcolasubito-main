import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stima Pensione Online | CalcolaSubito',
  description: 'Stima la pensione pubblica con il sistema contributivo INPS: montante, coefficienti di trasformazione e tasso di sostituzione.',
  keywords: 'stima pensione, calcolo pensione, sistema contributivo, montante contributivo, pensione futura',
  alternates: { canonical: '/stima-pensione' },
  openGraph: {
    title: 'Stima Pensione Online | CalcolaSubito',
    description: 'Stima la pensione pubblica con il sistema contributivo INPS: montante, coefficienti di trasformazione e tasso di sostituzione.',
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
