import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metabolismo Basale Online (BMR) | CalcolaSubito',
  description: "Stima il metabolismo basale con l'equazione di Mifflin-St Jeor (1990). Inserisci peso, altezza, età e sesso.",
  keywords: 'metabolismo basale, BMR, Mifflin-St Jeor, calorie a riposo, fabbisogno energetico',
  alternates: { canonical: '/metabolismo-basale' },
  openGraph: {
    title: 'Metabolismo Basale Online (BMR) | CalcolaSubito',
    description: "Stima il metabolismo basale con l'equazione di Mifflin-St Jeor (1990). Inserisci peso, altezza, età e sesso.",
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
