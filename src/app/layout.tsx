import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'

import { siteUrl } from '@/features/site'
import { QueryProvider } from '@/providers/QueryProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Planta Fácil 3D', template: '%s | Planta Fácil 3D' },
  description:
    'Projetos arquitetônicos prontos: plantas baixas, fachadas e imagens 3D para construir ou investir com segurança.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
