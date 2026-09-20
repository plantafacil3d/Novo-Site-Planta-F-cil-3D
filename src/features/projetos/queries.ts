import 'server-only'

import { cache } from 'react'

import { projetoRepository } from '@/repositories/projetos'

// Loaders para Server Components: o conteúdo público é renderizado no servidor (SEO).

export function listarProjetosEmDestaque() {
  return projetoRepository.listarDestaques()
}

export function listarComplementares() {
  return projetoRepository.listarComplementares()
}

export function listarCategorias() {
  return projetoRepository.listarCategorias()
}

/**
 * `null` quando o slug não existe (a rota responde 404). Com `cache`, a página e o
 * `generateMetadata` compartilham uma única busca por requisição.
 */
export const buscarProjeto = cache((slug: string) => projetoRepository.buscarPorSlug(slug))

export function listarSlugsProjetos() {
  return projetoRepository.listarSlugs()
}

export function listarProjetosRelacionados(slug: string) {
  return projetoRepository.listarRelacionados(slug)
}
