import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Percentuali Online Gratuito | CalcolaSubito.it',
  description: 'Calcola percentuali, sconti e proporzioni online gratis. Strumento preciso e veloce per qualsiasi calcolo percentuale. Nessuna registrazione richiesta.',
  keywords: 'calcolo percentuali, sconto percentuale, percentuale di, aumento percentuale, proporzioni',
  openGraph: {
    title: 'Calcolo Percentuali - CalcolaSubito.it',
    description: 'Calcola facilmente percentuali, sconti e proporzioni',
    type: 'website',
  },
}

export default function PercentualiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
