import type { Metadata } from 'next'

import { SobreView } from '@/views/SobreView'

const title = 'Sobre nós'
const description =
  'Conheça a história da Planta Fácil 3D: uma empresa digital de arquitetura fundada por Herkullys de Sousa Silva, com o propósito de tornar projetos arquitetônicos acessíveis para todos.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: `${title} | Planta Fácil 3D`,
    description,
    url: '/sobre',
    siteName: 'Planta Fácil 3D',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function SobrePage() {
  return <SobreView />
}
