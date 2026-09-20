import type { Metadata } from 'next'

import { lerParametrosListagem, montarHrefListagem, temFiltros } from '@/features/projetos'
import { ProjetosView } from '@/views/ProjetosView'

type ProjetosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const description =
  'Veja os projetos arquitetônicos prontos: sobrados, casas térreas e casas de campo com plantas, fachadas e imagens 3D. Filtre por estilo, quartos, vagas e pelo tamanho do seu terreno.'

export async function generateMetadata({ searchParams }: ProjetosPageProps): Promise<Metadata> {
  const params = lerParametrosListagem(await searchParams)
  const title =
    params.pagina > 1 ? `Projetos prontos - página ${params.pagina}` : 'Projetos prontos'

  // Cada combinação de filtro ou ordem é uma página nova para o Google: fora do índice, para não
  // gerar milhares de páginas quase iguais. Só a lista sem filtro (e suas páginas) é indexada.
  if (temFiltros(params) || params.ordem !== 'relevancia') {
    return { title, description, robots: { index: false, follow: true } }
  }

  const url = montarHrefListagem({ pagina: params.pagina })
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

export default async function ProjetosPage({ searchParams }: ProjetosPageProps) {
  const params = lerParametrosListagem(await searchParams)
  return <ProjetosView params={params} />
}
