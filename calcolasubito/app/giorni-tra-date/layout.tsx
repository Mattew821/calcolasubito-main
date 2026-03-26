import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Giorni tra Due Date Online | CalcolaSubito.it',
  description: 'Calcola i giorni, settimane e mesi tra due date. Strumento online gratuito e preciso per contare i giorni passati o futuri. Nessuna registrazione.',
  keywords: 'calcolo giorni, giorni tra date, settimane, mesi, differenza date, anni',
  openGraph: {
    title: 'Calcolo Giorni tra Date - CalcolaSubito.it',
    description: 'Scopri quanti giorni passano tra due date',
    type: 'website',
  },
}

export default function GiorniTraDateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
