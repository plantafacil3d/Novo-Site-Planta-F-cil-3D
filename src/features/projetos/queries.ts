import 'server-only'

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { cache } from 'react'

import { projetoRepository } from '@/repositories/projetos'

import { montarConsulta } from './rules'
import type { ParametrosListagem, ProjetoDetalhe } from './types'

// Loaders para Server Components: o conteúdo público é renderizado no servidor (SEO).

const TAG_CATALOGO = 'catalogo-projetos'
// Rede de segurança: se alguém mexer no banco direto (fora do painel), o site se atualiza sozinho.
const SEGUNDOS_DE_CACHE = 600

// A listagem lê `searchParams`, então a página é sempre montada na hora; sem cache, cada clique
// refazia as consultas ao banco. Aqui o resultado fica guardado por combinação de filtros.
const listarProjetosEmCache = unstable_cache(
  (consulta: ReturnType<typeof montarConsulta>) => projetoRepository.buscarProjetos(consulta),
  ['listar-projetos'],
  { tags: [TAG_CATALOGO], revalidate: SEGUNDOS_DE_CACHE },
)

const buscarLimitesEmCache = unstable_cache(
  () => projetoRepository.buscarLimites(),
  ['limites-de-filtro'],
  { tags: [TAG_CATALOGO], revalidate: SEGUNDOS_DE_CACHE },
)

/** Chamar depois de criar, editar, publicar, despublicar ou excluir projetos (Server Actions). */
export function invalidarCatalogo() {
  revalidateTag(TAG_CATALOGO, { expire: 0 })
  // A vitrine da home é uma página estática; sem isto ela só atualizaria no prazo do `revalidate`.
  revalidatePath('/')
  // A página de cada projeto também é estática (`generateStaticParams`): sem isto ela guarda os
  // endereços das imagens de antes e, depois de trocar as imagens, mostra as antigas (já apagadas).
  revalidatePath('/projetos/[slug]', 'page')
}

/** Uma página do catálogo para os parâmetros da URL (já validados por `lerParametrosListagem`). */
export function listarProjetos(params: ParametrosListagem) {
  return listarProjetosEmCache(montarConsulta(params))
}

export function listarProjetosEmDestaque() {
  return projetoRepository.listarDestaques()
}

export function listarComplementares() {
  return projetoRepository.listarComplementares()
}

export function listarCategorias() {
  return projetoRepository.listarCategorias()
}

/** Menor/maior preço e área entre os projetos publicados, para balizar o filtro "De/Até". */
export function listarLimitesDeFiltro() {
  return buscarLimitesEmCache()
}

/**
 * `null` quando o slug não existe (a rota responde 404). Com `cache`, a página e o
 * `generateMetadata` compartilham uma única busca por requisição.
 */
export const buscarProjeto = cache((slug: string) => projetoRepository.buscarPorSlug(slug))

export function listarSlugsProjetos() {
  return projetoRepository.listarSlugs()
}

/** Recebe o projeto já carregado (não busca de novo id/categoria, que a página já tem). */
export function listarProjetosRelacionados(projeto: ProjetoDetalhe) {
  return projetoRepository.listarRelacionados(projeto.id, projeto.categoriaRotulo)
}
