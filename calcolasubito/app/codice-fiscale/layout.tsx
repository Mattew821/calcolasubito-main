import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Codice Fiscale Online Gratuito | CalcolaSubito.it',
  description: 'Calcola il codice fiscale italiano dai dati anagrafici. Generatore online gratuito e veloce. Struttura codice fiscale spiegata.',
  keywords: 'codice fiscale, generatore codice fiscale, calcolo codice fiscale, CF italiano',
  openGraph: {
    title: 'Calcolo Codice Fiscale - CalcolaSubito.it',
    description: 'Calcola il tuo codice fiscale italiano',
    type: 'website',
  },
}

export default function CodiceFiscaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
