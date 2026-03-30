import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversione Temperatura Online | CalcolaSubito',
  description: 'Converti Celsius in Fahrenheit e Kelvin con conversione immediata.',
  keywords: 'conversione temperatura, celsius fahrenheit kelvin, convertitore',
  openGraph: {
    title: 'Conversione Temperatura - CalcolaSubito',
    description: 'Converti temperature in tempo reale.',
    type: 'website',
  },
}

export default function ConversioneTemperaturaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

