import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fabbisogno Calorico Online (BMR/TDEE) | CalcolaSubito',
  description: 'Calcola metabolismo basale e calorie giornaliere stimate con formula Mifflin-St Jeor e livello attivita.',
  keywords: 'fabbisogno calorico, bmr, tdee, calorie giornaliere',
  openGraph: {
    title: 'Fabbisogno Calorico - CalcolaSubito',
    description: 'Stima BMR e TDEE in pochi secondi.',
    type: 'website',
  },
}

export default function FabbisognoCaloricoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
