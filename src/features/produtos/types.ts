/** O que o card de produto mostra (Loja e "Decore como no projeto"). Sem preço, de propósito. */
export type ProdutoResumo = {
  id: string
  nome: string
  foto: { src: string; alt: string }
  /** Nome da categoria (cadastrada no painel). */
  categoria: string
  /** Nomes dos ambientes (cadastrados no painel), em ordem alfabética. */
  ambientes: string[]
}

/** Estado da Loja na URL (`/loja?q=...&categoria=...&ambiente=...&pagina=2`), já validado. */
export type ParametrosLoja = {
  q?: string
  categoria?: string
  ambiente?: string
  pagina: number
}

/** O que o repository precisa para buscar uma página da Loja. */
export type ConsultaLoja = {
  busca?: string
  categoria?: string
  ambiente?: string
  pagina: number
  porPagina: number
}

/** Categorias e ambientes que têm pelo menos um produto ativo (opções dos filtros da Loja). */
export type FiltrosDaLoja = {
  categorias: string[]
  ambientes: string[]
}

/** De onde veio o clique em "Ver oferta". */
export type OrigemDoClique = { pagina: 'loja' } | { pagina: 'projeto'; projetoId: string }
