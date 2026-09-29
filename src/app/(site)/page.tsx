import type { Metadata } from 'next'

import { HomeView } from '@/views/HomeView'

const title = 'Planta Fácil 3D | Projetos arquitetônicos prontos'
const description =
  'Encontre o projeto ideal para o seu sonho: plantas baixas, fachadas, imagens 3D e projetos complementares para construir ou investir com segurança.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Planta Fácil 3D',
    locale: 'pt_BR',
    type: 'website',
  },
}

// Sem isto a home é gerada uma única vez no build e a vitrine nunca mostra projetos novos.
// 600 s = mesma rede de segurança do catálogo (queries.ts); o painel também invalida na hora.
export const revalidate = 600

export default function HomePage() {
  return <HomeView />
}
