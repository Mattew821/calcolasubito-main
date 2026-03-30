import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site-config'
import { CALCULATOR_CATALOG } from '@/lib/calculator-catalog'

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
    priority: 0.9,
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
