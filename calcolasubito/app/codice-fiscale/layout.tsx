import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Codice Fiscale Online Gratuito | CalcolaSubito',
  description: 'Calcola il codice fiscale italiano dai dati anagrafici. Generatore online gratuito e veloce. Struttura codice fiscale spiegata.',
  keywords: 'codice fiscale, generatore codice fiscale, calcolo codice fiscale, CF italiano',
  openGraph: {
    title: 'Calcolo Codice Fiscale - CalcolaSubito',
    description: 'Calcola il tuo codice fiscale italiano',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Il codice fiscale ha una scadenza?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, il codice fiscale non scade mai. È valido per tutta la vita e rimane lo stesso dal momento dell\'assegnazione.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cos\'è il control digit (ultimo carattere)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'È una cifra di controllo calcolata in base ai 15 caratteri precedenti, utile per verificare la correttezza del codice.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come ottengo il codice fiscale ufficiale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contatta l\'Agenzia delle Entrate più vicina oppure richiedilo online sul sito dell\'Agenzia.',
      },
    },
  ],
}

export default function CodiceFiscaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {children}
    </>
  )
}

