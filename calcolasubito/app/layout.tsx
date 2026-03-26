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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CalcolaSubito.it',
  url: 'https://calcolasubito.it',
  logo: 'https://calcolasubito.vercel.app/logo.png',
  sameAs: [
    'https://www.facebook.com/calcolasubito',
    'https://twitter.com/calcolasubito',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'info@calcolasubito.it',
  },
}

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CalcolaSubito.it',
  url: 'https://calcolasubito.it',
  description: 'Suite di calcolatori online gratuiti per l\'Italia',
  applicationCategory: 'UtilityApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
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

        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* JSON-LD WebApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
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
