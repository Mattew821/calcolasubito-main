import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Busta Paga Netta Online | CalcolaSubito',
  description: 'Simula stipendio netto mensile da RAL con contributi, IRPEF, detrazioni e addizionali.',
  keywords: 'busta paga netta, stipendio netto, calcolo ral netto, irpef, contributi',
  alternates: { canonical: '/busta-paga-netta' },
  openGraph: {
    title: 'Calcolo Busta Paga Netta - CalcolaSubito',
    description: 'Stima il netto mensile a partire dalla tua RAL in pochi secondi.',
    type: 'website',
  },
}

export default function BustaPagaNettaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
