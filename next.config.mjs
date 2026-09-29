/** @type {import('next').NextConfig} */
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

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Temporário: fotos de exemplo. Remover quando as imagens reais estiverem em public/.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Imagens e plantas já gravadas dos projetos (bucket público, usadas na edição de cadastro).
      ...(hostDoStorage
        ? [
            {
              protocol: 'https',
              hostname: hostDoStorage,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
  },
  async redirects() {
    // URL antiga do curso: mantém links e posição no Google.
    return [{ source: '/3d-unreal', destination: '/curso-unreal-engine', permanent: true }]
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
