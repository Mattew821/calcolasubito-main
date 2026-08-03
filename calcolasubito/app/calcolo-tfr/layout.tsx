import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo TFR Online | CalcolaSubito',
  description: 'Calcola il TFR maturato con rivalutazione e tassazione. Accantonamento retribuzione/13.5, rivalutazione 1.5% + 75% inflazione.',
  keywords: 'calcolo TFR, trattamento fine rapporto, liquidazione, rivalutazione TFR',
  alternates: { canonical: '/calcolo-tfr' },
  openGraph: {
    title: 'Calcolo TFR Online | CalcolaSubito',
    description: 'Calcola il TFR maturato con rivalutazione e tassazione. Accantonamento retribuzione/13.5, rivalutazione 1.5% + 75% inflazione.',
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
