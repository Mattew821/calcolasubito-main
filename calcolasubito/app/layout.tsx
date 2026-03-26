import type { Metadata } from 'next'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CalcolaSubito.it | Calcolatori Online Gratuiti',
  description: 'Suite di calcolatori online gratuiti per l\'Italia: IVA, busta paga, IMU, codice fiscale e molti altri.',
  keywords: 'calcolatori online, calcolo IVA, busta paga, codice fiscale, IMU, TARI',
  authors: [{ name: 'CalcolaSubito.it' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://calcolasubito.it',
    siteName: 'CalcolaSubito.it',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
