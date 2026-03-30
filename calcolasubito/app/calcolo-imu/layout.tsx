import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo IMU Online | CalcolaSubito',
  description: 'Calcola IMU annua, acconto e saldo partendo da rendita catastale, aliquota e quota di possesso.',
  keywords: 'calcolo imu, imu seconda casa, rendita catastale, acconto imu, saldo imu',
  openGraph: {
    title: 'Calcolo IMU - CalcolaSubito',
    description: 'Stima IMU in pochi secondi con parametri personalizzati.',
    type: 'website',
  },
}

export default function CalcoloImuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
