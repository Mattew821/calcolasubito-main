import type { Metadata } from 'next'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BASE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'CalcolaSubito | Calcolatori Online Gratuiti',
  description: 'Suite di calcolatori online gratuiti per l\'Italia: IVA, busta paga, IMU, codice fiscale e molti altri.',
  keywords: 'calcolatori online, calcolo IVA, busta paga, codice fiscale, IMU, TARI',
  authors: [{ name: 'CalcolaSubito' }],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: BASE_URL,
    siteName: 'CalcolaSubito',
    title: 'CalcolaSubito - Calcolatori Online Gratuiti',
    description: 'Suite di calcolatori online gratuiti per l\'Italia: percentuali, IVA, codice fiscale, mutuo e molto altro.',
    images: [
      {
        url: '/opengraph-image.svg',
        width: 1200,
        height: 630,
        alt: 'CalcolaSubito - Calcolatori Online Gratuiti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalcolaSubito',
    description: 'Calcolatori online gratuiti per l\'Italia',
    images: ['/twitter-image.svg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
    shortcut: '/favicon.ico.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '35trzUPu96FBBZV6byuA-J6D3cs2ewPLUNhURQHf0_Y',
  },
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || null

// Log warning in development if GA_ID is not configured
if (!GA_ID && process.env.NODE_ENV === 'development') {
  console.warn(
    'Google Analytics is not configured. Set NEXT_PUBLIC_GA_ID environment variable to enable GA4 tracking.'
  )
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CalcolaSubito',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [
    'https://www.facebook.com/calcolasubito',
    'https://twitter.com/calcolasubito',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'calcolasubito@gmail.com',
  },
}

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CalcolaSubito',
  url: BASE_URL,
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
        <meta name="google-site-verification" content="35trzUPu96FBBZV6byuA-J6D3cs2ewPLUNhURQHf0_Y" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4449622526771169"
          crossOrigin="anonymous"
        ></script>

        {/* Google Analytics - Only load if GA_ID is configured */}
        {GA_ID && (
          <>
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
          </>
        )}

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
