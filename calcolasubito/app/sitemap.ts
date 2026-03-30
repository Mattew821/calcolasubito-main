import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site-config'
import { CALCULATOR_CATALOG } from '@/lib/calculator-catalog'

const PRIORITY_BY_POPULARITY: Record<(typeof CALCULATOR_CATALOG)[number]['popularity'], number> = {
  'Molto Alto': 0.95,
  Alto: 0.9,
  Medio: 0.85,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const homeEntry: MetadataRoute.Sitemap[0] = {
    url: BASE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1,
  }

  const calculatorEntries: MetadataRoute.Sitemap = CALCULATOR_CATALOG.map((calculator) => ({
    url: `${BASE_URL}/${calculator.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: PRIORITY_BY_POPULARITY[calculator.popularity],
  }))

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cookie`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  return [homeEntry, ...calculatorEntries, ...staticEntries]
}
