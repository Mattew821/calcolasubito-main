import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Rata Mutuo Online Gratuito | CalcolaSubito.it',
  description: 'Calcola la rata mensile del mutuo. Simulatore online con ammortamento completo. Inserisci capitale, tasso e durata. Gratis e preciso.',
  keywords: 'calcolo rata mutuo, simulatore mutuo, ammortamento, rata mensile, mutuo immobiliare',
  openGraph: {
    title: 'Calcolo Rata Mutuo - CalcolaSubito.it',
    description: 'Calcola facilmente la rata del tuo mutuo',
    type: 'website',
  },
}

export default function RataMutuoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
