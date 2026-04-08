/**
 * Security Headers Configuration
 * Based on OWASP Secure Headers Project recommendations
 * References:
 * - https://owasp.org/www-project-secure-headers/
 * - https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
 * - https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  },

  // Security headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent MIME sniffing
          // https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },

          // Prevent clickjacking attacks
          // CSP frame-ancestors obsoletes X-Frame-Options but we include both for compatibility
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },

          // Enable XSS filter in browsers (legacy protection)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },

          // Referrer Policy - Don't leak referrer to cross-origin requests
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },

          // Disable DNS prefetch to reduce metadata leakage
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          },

          // Disable Adobe Flash/Acrobat cross-domain policy files
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none'
          },

          // Isolate browsing context group where supported
          {
            key: 'Origin-Agent-Cluster',
            value: '?1'
          },

          // Permissions Policy - Restrict browser features
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()'
          },

          // Content Security Policy - Prevents XSS and injection attacks
          // https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'"
            ].join('; ')
          },

          // Strict Transport Security - Force HTTPS
          // https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
          // max-age: 63072000 (2 years), includes subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
            // Note: Only add preload if certain all subdomains serve HTTPS
          }
        ]
      }
    ]
  }
};

export default nextConfig;
