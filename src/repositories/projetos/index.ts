import { SupabaseProjetoRepository } from './SupabaseProjetoRepository'
import type { ProjetoRepository } from './ProjetoRepository'

export type { ProjetoRepository } from './ProjetoRepository'
export const projetoRepository: ProjetoRepository = new SupabaseProjetoRepository()
