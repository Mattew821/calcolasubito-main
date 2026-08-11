import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo TFR Online | CalcolaSubito',
  description: 'Calcola il Trattamento di Fine Rapporto maturato. Simulatore TFR con rivalutazione annuale (1,5% + 75% inflazione) e tassazione separata. Aggiornato 2024.',
  keywords: 'calcolo TFR, trattamento fine rapporto, liquidazione, rivalutazione TFR, tassazione separata, TFR netto',
  alternates: { canonical: '/calcolo-tfr' },
  openGraph: {
    title: 'Calcolo TFR - CalcolaSubito',
    description: 'Quanto TFR hai maturato? Calcola online',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come si calcola il TFR annuo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TFR annuo = retribuzione annua lorda / 13,5. Il divisore 13,5 deriva da 12 mensilità + 1/3 di tredicesima.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come funziona la rivalutazione del TFR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il TFR maturato si rivaluta ogni anno al 31 dicembre: 1,5% fisso + 75% della variazione dell\'indice ISTAT dei prezzi al consumo (FOI). La rivalutazione non si applica all\'ultimo anno (non completo).',
      },
    },
    {
      '@type': 'Question',
      name: 'Come viene tassato il TFR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tassazione separata: si calcola l\'IRPEF media degli ultimi 5 anni (aliquota media) e si applica al TFR lordo. Non cumula con altri redditi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Il TFR si può lasciare in azienda o va al fondo pensione?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per aziende >50 dipendenti: TFR va al fondo pensione (conferimento tacito se non scegli). Per aziende ≤50: resta in azienda (rivalutazione legale). Puoi sempre scegliere il fondo pensione.',
      },
    },
  ],
}

export default function CalcoloTFRLayout({
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