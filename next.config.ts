import type { NextConfig } from 'next'

/** Host do Storage do Supabase, para liberar as imagens já gravadas (bucket público) no `next/image`. */
const hostDoStorage = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
})()

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
    remotePatterns: [
      // Temporário: fotos de exemplo. Remover quando as imagens reais estiverem em public/.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Imagens e plantas já gravadas dos projetos (bucket público, usadas na edição de cadastro).
      ...(hostDoStorage
        ? [
            {
              protocol: 'https' as const,
              hostname: hostDoStorage,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
