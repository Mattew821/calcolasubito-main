import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import AppPreferencesProvider from '@/components/AppPreferencesProvider'
import ScrollReveal from '@/components/ScrollReveal'
import { BASE_URL } from '@/lib/site-config'
import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from '@/lib/i18n'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CalcolaSubito | Calcolatori Online Gratuiti',
  description:
    'Suite di calcolatori online gratuiti per l\'Italia: percentuali, IVA, codice fiscale, mutuo, prestito, BMI e molti altri.',
  keywords:
    'calcolatori online, calcolo percentuali, scorporo IVA, codice fiscale, rata mutuo, rata prestito, BMI',
  authors: [{ name: 'CalcolaSubito' }],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
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

const INITIAL_PREFERENCES_SCRIPT = `
(() => {
  try {
    const root = document.documentElement;
    const langStored = localStorage.getItem('${LANGUAGE_STORAGE_KEY}');
    const themeStored = localStorage.getItem('${THEME_STORAGE_KEY}');
    const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'it';
    const detectedLang = String(navLang).toLowerCase().startsWith('es')
      ? 'es'
      : String(navLang).toLowerCase().startsWith('en')
        ? 'en'
        : 'it';
    const lang = ['it', 'en', 'es'].includes(langStored || '') ? langStored : detectedLang;
    root.lang = lang;

    const pref = ['system', 'light', 'dark'].includes(themeStored || '') ? themeStored : 'system';
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = pref === 'system' ? (systemDark ? 'dark' : 'light') : pref;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  } catch (error) {
    // ignore bootstrap preference errors
  }
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="35trzUPu96FBBZV6byuA-J6D3cs2ewPLUNhURQHf0_Y" />

        <script
          dangerouslySetInnerHTML={{
            __html: INITIAL_PREFERENCES_SCRIPT,
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4449622526771169"
          crossOrigin="anonymous"
        ></script>

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
      <body className={`flex flex-col min-h-screen ${manrope.variable} ${spaceGrotesk.variable}`}>
        <AppPreferencesProvider>
          {GA_ID && <GoogleAnalytics measurementId={GA_ID} />}
          <ScrollReveal />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppPreferencesProvider>
      </body>
    </html>
  )
}
