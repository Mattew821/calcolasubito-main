import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site-config'

const calculators = [
  'percentuali',
  'giorni-tra-date',
  'scorporo-iva',
  'codice-fiscale',
  'rata-mutuo',
  'sconto-percentuale',
  'aumento-percentuale',
  'interesse-semplice',
  'interesse-composto',
  'indice-massa-corporea',
  'consumo-carburante',
  'area-rettangolo',
  'area-cerchio',
  'media-voti',
  'conversione-temperatura',
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Homepage
  const homeEntry: MetadataRoute.Sitemap[0] = {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }

  // Calculator pages
  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calc) => ({
    url: `${BASE_URL}/${calc}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // About page
  const aboutEntry: MetadataRoute.Sitemap[0] = {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }

  // Policy pages
  const policyEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cookie`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  return [homeEntry, ...calculatorEntries, aboutEntry, ...policyEntries]
}
