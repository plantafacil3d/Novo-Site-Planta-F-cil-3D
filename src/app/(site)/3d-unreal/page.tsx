import type { Metadata } from 'next'

import { CursoUnreal5View } from '@/views/curso-unreal-5/CursoUnreal5View'

const title = 'Curso Unreal Engine 5.6'
const description =
  'Domine a Unreal Engine 5.6 e leve suas visualizações arquitetônicas ao extraordinário: mais de 60 horas de aulas, 19 módulos e cenas bônus.'

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
