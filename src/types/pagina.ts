/** Uma fatia de uma lista grande, mais o total para montar a paginação. */
export type Pagina<T> = {
  itens: T[]
  /** Quantidade de itens em toda a lista (com os filtros aplicados), não só nesta página. */
  total: number
  /** Começa em 1. */
  pagina: number
  porPagina: number
}
