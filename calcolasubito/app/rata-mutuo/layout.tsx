import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Rata Mutuo Online Gratuito | CalcolaSubito',
  description: 'Calcola la rata mensile del mutuo. Simulatore online con ammortamento completo. Inserisci capitale, tasso e durata. Gratis e preciso.',
  keywords: 'calcolo rata mutuo, simulatore mutuo, ammortamento, rata mensile, mutuo immobiliare',
  openGraph: {
    title: 'Calcolo Rata Mutuo - CalcolaSubito',
    description: 'Calcola facilmente la rata del tuo mutuo',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Cosa significa tasso fisso?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il tasso rimane uguale per tutta la durata del mutuo, quindi la rata non cambia mai.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa significa tasso variabile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il tasso cambia in base all\'EURIBOR, quindi la rata varia nel tempo. Più rischioso ma potenzialmente meno costoso.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso estinguere il mutuo anticipatamente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sì, ma potrebbe essere richiesto il pagamento di una penale. Confronta il costo della penale con gli interessi risparmiati.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual è la durata tipica di un mutuo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I mutui in Italia vanno dai 5 ai 40 anni, ma i più comuni sono tra 20 e 30 anni.',
      },
    },
  ],
}

export default function RataMutuoLayout({
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

