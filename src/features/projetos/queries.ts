import 'server-only'

import { cache } from 'react'

import { projetoRepository } from '@/repositories/projetos'

import { montarConsulta } from './rules'
import type { ParametrosListagem, ProjetoDetalhe } from './types'

// Loaders para Server Components: o conteúdo público é renderizado no servidor (SEO).

/** Uma página do catálogo para os parâmetros da URL (já validados por `lerParametrosListagem`). */
export function listarProjetos(params: ParametrosListagem) {
  return projetoRepository.buscarProjetos(montarConsulta(params))
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
  return projetoRepository.buscarLimites()
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
