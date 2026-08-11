import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IMU 2024 Calcolo Online | CalcolaSubito',
  description: 'Calcola l\'IMU 2024 (Imposta Municipale Unica). Aliquote base, detrazioni, acconto e saldo. Gratis e preciso.',
  keywords: 'IMU 2024, calcolo IMU, imposta municipale unica, aliquote IMU, detrazione prima casa',
  alternates: { canonical: '/calcolo-imu' },
  openGraph: {
    title: 'Calcolo IMU - CalcolaSubito',
    description: 'Quanto IMU paghi nel 2024?',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola l\'IMU?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'IMU = (Rendita catastale × 1,05) × 160 × aliquota. Rendita rivalutata 5% × coefficiente 160 = base imponibile. Aliquota base 0,76% (comune può variare 0,46%-1,06%).',
      },
    },
    {
      '@type': 'Question',
      name: 'Prima casa paga IMU?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, esente per abitazione principale (cat. A/2-A/7) e pertinenze (max 1 per cat. C/2, C/6, C/7). Non esente per A/1, A/8, A/9 (case di lusso).',
      },
    },
    {
      '@type': 'Question',
      name: 'Quando si paga acconto e saldo IMU?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Acconto: 16 giugno (50% imposta anno precedente). Saldo: 16 dicembre (conguaglio su aliquota anno corrente).',
      },
    },
    {
      '@type': 'Question',
      name: 'Terreni agricoli pagano IMU?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sì, base imponibile = reddito dominicale × 1,25 × 135. Esenti se posseduti da coltivatori diretti/IAP iscritti previdenza agricola.',
      },
    },
  ],
}

export default function CalcoloIMULayout({
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