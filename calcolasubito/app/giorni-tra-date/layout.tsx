import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolo Giorni tra Due Date Online | CalcolaSubito',
  description: 'Calcola i giorni, settimane e mesi tra due date. Strumento online gratuito e preciso per contare i giorni passati o futuri. Nessuna registrazione.',
  keywords: 'calcolo giorni, giorni tra date, settimane, mesi, differenza date, anni',
  alternates: { canonical: '/giorni-tra-date' },
  openGraph: {
    title: 'Calcolo Giorni tra Date - CalcolaSubito',
    description: 'Scopri quanti giorni passano tra due date',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Come funziona il conteggio dei giorni?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il calcolatore calcola la differenza in giorni tra le due date. Ad esempio, dal 1 gennaio al 3 gennaio risultano 2 giorni.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come si calcola il numero di mesi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dividi il numero di giorni per 30 (media dei giorni in un mese). Per un calcolo preciso, consulta il nostro calcolatore.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cosa sono gli anni bisestili?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un anno bisestile ha 366 giorni invece di 365, accade ogni 4 anni. Il nostro calcolatore tiene automaticamente conto di questo.',
      },
    },
  ],
}

export default function GiorniTraDateLayout({
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

