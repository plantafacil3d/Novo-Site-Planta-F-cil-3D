import 'server-only'

import { usuarioLogado } from '@/features/conta'
import type { Projeto } from '@/features/projetos'
import { favoritoRepository } from '@/repositories/favoritos'
import { projetoRepository } from '@/repositories/projetos'
import type { Pagina } from '@/types/pagina'

import { ordenarPorIds } from './rules'

/** Favoritos por página no painel (mesmo tamanho da grade da vitrine). */
export const FAVORITOS_POR_PAGINA = 12

/** Uma página da grade de favoritos do usuário logado; vazia (sem erro) quando não há sessão. */
export async function listarFavoritosPagina(
  pagina: number,
  porPagina: number = FAVORITOS_POR_PAGINA,
): Promise<Pagina<Projeto>> {
  const usuario = await usuarioLogado()
  if (!usuario) return { itens: [], total: 0, pagina, porPagina }

  const idsPagina = await favoritoRepository.listarIdsPagina(pagina, porPagina)
  if (idsPagina.itens.length === 0) return { ...idsPagina, itens: [] }

  const projetos = await projetoRepository.buscarPorIds(idsPagina.itens)
  return { ...idsPagina, itens: ordenarPorIds(projetos, idsPagina.itens) }
}

/** Todo o conjunto de ids favoritados do usuário logado; `[]` sem sessão. */
export async function listarTodosIdsFavoritados(): Promise<string[]> {
  const usuario = await usuarioLogado()
  if (!usuario) return []
  return favoritoRepository.listarTodosIds()
}

/** Projetos em destaque que o usuário ainda não favoritou (lista curta e curada, sem paginação). */
export async function listarSugestoes(): Promise<Projeto[]> {
  const [idsFavoritados, destaques] = await Promise.all([
    listarTodosIdsFavoritados(),
    projetoRepository.listarDestaques(),
  ])
  return destaques.filter((projeto) => !idsFavoritados.includes(projeto.id))
}
