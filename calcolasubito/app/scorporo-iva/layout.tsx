import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Scorporo IVA Online Gratuito | CalcolaSubito.it',
  description: 'Scorporo IVA online: calcola l\'imponibile da un importo lordo o applica IVA a un importo netto. Aliquote italiane 4%, 5%, 10%, 22%. Gratis e senza registrazione.',
  keywords: 'scorporo IVA, calcolo IVA, IVA 22%, imponibile, ritenuta IVA, calcolo imposte',
  openGraph: {
    title: 'Calcolo Scorporo IVA - CalcolaSubito.it',
    description: 'Calcola facilmente lo scorporo IVA con tutte le aliquote italiane',
    type: 'website',
  },
}

export default function ScorporoIvaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
