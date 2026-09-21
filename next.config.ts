import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // CSP: definir liberando só o que o app usa (Supabase, analytics...).
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Temporário: fotos de exemplo. Remover quando as imagens reais estiverem em public/.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  async redirects() {
    // Só existe uma tela de login; links antigos para /entrar levam a ela.
    return [{ source: '/entrar', destination: '/admin/entrar', permanent: true }]
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
