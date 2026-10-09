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

// Páginas públicas que o painel muda (vitrine da home e página de cada projeto). O Next as serve com
// `s-maxage=600` por causa do `revalidate`, e a CDN da Hostinger (hcdn) obedece: guarda o HTML por 10
// minutos e `revalidatePath` não alcança essa cópia. Com este valor a CDN confere com o servidor a
// cada acesso (resposta 304, barata); o cache do Next (`revalidate = 600` + invalidação do painel)
// continua sendo quem guarda a página pronta. É o mesmo valor que o Next usa no sitemap.xml.
const semCopiaNaCdn = [
  { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
]

const nextConfig = {
  poweredByHeader: false,
  images: {
    // Cache de 1 ano das imagens otimizadas: o Next guarda cada variante e responde ao navegador com
    // `max-age` desse valor. A validade vale o maior entre este número e o `Cache-Control` do
    // Supabase (também de 1 ano). É seguro porque o Next não tem como invalidar esse cache: toda foto
    // nova tem nome único (sufixo), então trocar a foto muda a URL em vez de reaproveitá-la.
    minimumCacheTTL: 31536000,
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
    return [
      { source: '/(.*)', headers: securityHeaders },
      { source: '/', headers: semCopiaNaCdn },
      { source: '/projetos/:slug', headers: semCopiaNaCdn },
    ]
  },
}

export default nextConfig
