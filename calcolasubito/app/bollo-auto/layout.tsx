import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bollo Auto Online | CalcolaSubito',
  description: 'Calcola il bollo auto 2024. Tariffa nazionale base per kW (L. 449/1997) + superbollo per auto >185 kW (L. 147/2013). Gratis e preciso.',
  keywords: 'bollo auto, calcolo bollo, tassa automobilistica, superbollo, kw, cavalli fiscali, regione',
  alternates: { canonical: '/bollo-auto' },
  openGraph: {
    title: 'Bollo Auto - CalcolaSubito',
    description: 'Quanto costa il bollo della tua auto?',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola il bollo auto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bollo base = kW × tariffa per fascia (L. 449/1997): fino 100 kW = €2,58/kW; 101-150 kW = €3,87/kW; 151-185 kW = €4,65/kW; oltre 185 kW = €5,82/kW. Superbollo = €20/kW oltre 185 kW (raddoppiato per Euro 0-3).',
      },
    },
    {
      '@type': 'Question',
      name: 'Il bollo è uguale in tutte le regioni?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La tariffa base è nazionale. Alcune regioni applicano coefficienti propri, sconti per alimentazione/anzianità, esenzioni veicoli elettrici. Questo calcolatore mostra la tariffa nazionale base.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa è il superbollo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Addizionale di €20 per ogni kW oltre 185 kW. Raddoppiato (€40/kW) per veicoli Euro 0, 1, 2, 3. Non si applica a veicoli elettrici/ibridi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quando si paga il bollo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entro l\'ultimo giorno del mese successivo alla scadenza (mese di immatricolazione). Ritardo = sanzioni + interessi.',
      },
    },
  ],
}

export default function BolloAutoLayout({
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