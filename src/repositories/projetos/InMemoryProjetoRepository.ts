import type { ConsultaProjetos } from '@/features/projetos'

import { categorias, complementares } from './catalogoDeExemplo'
import type { ProjetoRepository } from './ProjetoRepository'

/**
 * Adapter com dados fixos: só `listarComplementares`/`listarCategorias` têm conteúdo de verdade
 * (complementares ainda não têm tabela própria; categorias é a navegação fixa da home). O resto
 * do catálogo de projetos vem 100% do Supabase (`SupabaseProjetoRepository`); aqui devolve vazio.
 */
export class InMemoryProjetoRepository implements ProjetoRepository {
  async listarDestaques() {
    return []
  }

  async buscarProjetos(consulta: ConsultaProjetos) {
    return { itens: [], total: 0, pagina: consulta.pagina, porPagina: consulta.porPagina }
  }

  async buscarLimites() {
    return { precoMinCentavos: 0, precoMaxCentavos: 0, areaMinM2: 0, areaMaxM2: 0 }
  }

  async buscarPorSlug() {
    return null
  }

  async listarSlugs() {
    return []
  }

  async listarRelacionados() {
    return []
  }

  async listarComplementares() {
    return complementares
  }

  async listarCategorias() {
    return categorias
  }
}
