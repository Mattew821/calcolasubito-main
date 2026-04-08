import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cifrario Enigma Online con Plugboard | CalcolaSubito',
  description:
    'Simulatore Enigma con 3 rotori, Ringstellung, Reflector e Plugboard per cifrare e decifrare testi a scopo didattico.',
  keywords:
    'enigma, cifrario enigma, plugboard, rotori, crittografia polialfabetica, simulatore enigma',
  alternates: { canonical: '/cifrario-enigma' },
  openGraph: {
    title: 'Cifrario Enigma con Plugboard - CalcolaSubito',
    description: 'Simula la macchina Enigma con impostazioni complete.',
    type: 'website',
  },
}

export default function CifrarioEnigmaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
