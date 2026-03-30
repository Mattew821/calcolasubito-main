const DEFAULT_BASE_URL = 'https://vercel.vercel.app'

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL

export const BASE_URL = rawBaseUrl.replace(/\/+$/, '')
