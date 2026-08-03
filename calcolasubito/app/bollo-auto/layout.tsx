import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Bollo Auto 2024 Online | CalcolaSubito',
  description: 'Calcola il bollo auto con la tariffa base nazionale e il superbollo oltre 185 kW. Tariffa L. 449/1997, gratis e preciso.',
  keywords: 'bollo auto, calcolo bollo, tassa automobilistica, superbollo, tariffa kW',
  alternates: { canonical: '/bollo-auto' },
  openGraph: {
    title: 'Calcolo Bollo Auto 2024 Online | CalcolaSubito',
    description: 'Calcola il bollo auto con la tariffa base nazionale e il superbollo oltre 185 kW. Tariffa L. 449/1997, gratis e preciso.',
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
