import { MetadataRoute } from 'next'

const BASE_URL = 'https://calcolasubito.vercel.app'

const calculators = [
  'percentuali',
  'giorni-tra-date',
  'scorporo-iva',
  'codice-fiscale',
  'rata-mutuo',
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

  return [homeEntry, ...calculatorEntries, ...policyEntries]
}
