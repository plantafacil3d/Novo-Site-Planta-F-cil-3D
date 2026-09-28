import type { Metadata } from 'next'

import { CursoUnreal5View } from '@/views/curso-unreal-5/CursoUnreal5View'

const title = 'Curso de Unreal Engine 5.6 para Archviz'
const description =
  'Curso completo e 100% atualizado de Unreal Engine 5.6 para artistas 3D e arquitetos: cenas ultrarrealistas, tours virtuais interativos e animações em tempo real, sem render.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/3d-unreal' },
  openGraph: {
    title: `${title} | Planta Fácil 3D`,
    description,
    url: '/3d-unreal',
    siteName: 'Planta Fácil 3D',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function CursoUnreal5Page() {
  return <CursoUnreal5View />
}
