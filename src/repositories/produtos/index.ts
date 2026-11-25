import type { ProdutoRepository } from './ProdutoRepository'
import { SupabaseProdutoRepository } from './SupabaseProdutoRepository'

export type { ProdutoRepository } from './ProdutoRepository'
export const produtoRepository: ProdutoRepository = new SupabaseProdutoRepository()
