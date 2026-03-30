const DEFAULT_BASE_URL = 'https://calcolasubito.vercel.app'

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return DEFAULT_BASE_URL
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/+$/, '')
}

const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL

export const BASE_URL = normalizeBaseUrl(rawBaseUrl)
