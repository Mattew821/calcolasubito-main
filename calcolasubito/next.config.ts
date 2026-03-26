import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ottimizzazione per SEO e performance
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Static site generation per SEO
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
