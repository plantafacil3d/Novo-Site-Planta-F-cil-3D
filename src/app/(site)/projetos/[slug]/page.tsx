import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  buscarProjeto,
  hrefProjeto,
  listarSlugsProjetos,
  resumirParaBusca,
} from '@/features/projetos'
import { ProjetoView } from '@/views/ProjetoView'

type ProjetoPageProps = { params: Promise<{ slug: string }> }

// Rede de segurança, igual à da home: sem prazo, a página é gerada só no build e ficaria com as
// imagens antigas se o banco mudar fora do painel. O painel também renova na hora (invalidarCatalogo).
export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await listarSlugsProjetos()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjetoPageProps): Promise<Metadata> {
  const { slug } = await params
  const projeto = await buscarProjeto(slug)
  if (!projeto) return {}

  const title = `${projeto.titulo} | Projeto pronto`
  const description = resumirParaBusca(projeto)
  const url = hrefProjeto(projeto)

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
      images: [{ url: projeto.imagem.src, alt: projeto.imagem.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: projeto.imagem.src, alt: projeto.imagem.alt }],
    },
  }
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { slug } = await params
  const projeto = await buscarProjeto(slug)
  if (!projeto) notFound()

  return <ProjetoView projeto={projeto} />
}
