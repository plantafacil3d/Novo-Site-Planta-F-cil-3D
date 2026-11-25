import type { ProdutoAdminRepository } from './ProdutoAdminRepository'
import { SupabaseProdutoAdminRepository } from './SupabaseProdutoAdminRepository'

export type { ProdutoAdminRepository } from './ProdutoAdminRepository'
export const produtoAdminRepository: ProdutoAdminRepository = new SupabaseProdutoAdminRepository()
