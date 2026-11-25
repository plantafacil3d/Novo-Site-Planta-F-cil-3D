import type { Metadata } from 'next'

import { lerParametrosLoja, montarHrefLoja, temFiltrosNaLoja } from '@/features/produtos'
import { LojaView } from '@/views/LojaView'

type LojaPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const description =
  'Móveis, iluminação, acabamentos e ferramentas para construir e decorar a sua casa, selecionados pela equipe Planta Fácil 3D.'

export async function generateMetadata({ searchParams }: LojaPageProps): Promise<Metadata> {
  const params = lerParametrosLoja(await searchParams)
  const title = params.pagina > 1 ? `Loja - página ${params.pagina}` : 'Loja'

  // Cada combinação de filtro é uma página quase igual: fica fora do Google. Só a lista sem
  // filtro (e suas páginas) é indexada.
  if (temFiltrosNaLoja(params)) {
    return { title, description, robots: { index: false, follow: true } }
  }

  const url = montarHrefLoja({ pagina: params.pagina })
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Planta Fácil 3D',
      locale: 'pt_BR',
      type: 'website',
    },
  }
}

export default async function LojaPage({ searchParams }: LojaPageProps) {
  const params = lerParametrosLoja(await searchParams)
  return <LojaView params={params} />
}
