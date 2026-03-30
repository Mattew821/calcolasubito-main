import { MetadataRoute } from 'next'

// Use environment variable with fallback to production domain
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://calcolasubito.it'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
