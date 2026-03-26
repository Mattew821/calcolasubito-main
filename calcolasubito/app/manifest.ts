import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CalcolaSubito - Calcolatori Online Gratuiti',
    short_name: 'CalcolaSubito',
    description: 'Suite di calcolatori online gratuiti per l\'Italia: percentuali, IVA, codice fiscale, mutuo e molto altro',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#667eea',
    background_color: '#ffffff',
    categories: ['utilities', 'productivity'],
    screenshots: [
      {
        src: '/icon.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        src: '/opengraph-image.svg',
        sizes: '1200x630',
        type: 'image/svg+xml',
      },
    ],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    shortcuts: [
      {
        name: 'Calcolo Percentuali',
        short_name: 'Percentuali',
        description: 'Calcola percentuali rapidamente',
        url: '/percentuali',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Calcolo IVA',
        short_name: 'IVA',
        description: 'Calcola scorporo e applicazione IVA',
        url: '/scorporo-iva',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Codice Fiscale',
        short_name: 'Cod. Fiscale',
        description: 'Genera il codice fiscale italiano',
        url: '/codice-fiscale',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Giorni tra Date',
        short_name: 'Giorni',
        description: 'Conta i giorni tra due date',
        url: '/giorni-tra-date',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      {
        name: 'Rata Mutuo',
        short_name: 'Mutuo',
        description: 'Calcola rate mutuo immobiliare',
        url: '/rata-mutuo',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    ],
  }
}
