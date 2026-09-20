import type { ProjetoAdminRepository } from './ProjetoAdminRepository'
import { SupabaseProjetoAdminRepository } from './SupabaseProjetoAdminRepository'

export type { ProjetoAdminRepository } from './ProjetoAdminRepository'
export const projetoAdminRepository: ProjetoAdminRepository = new SupabaseProjetoAdminRepository()
