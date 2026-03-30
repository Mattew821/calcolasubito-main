import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site-config'

const ROBOTS_HOST = new URL(BASE_URL).host

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
    host: ROBOTS_HOST,
  }
}
