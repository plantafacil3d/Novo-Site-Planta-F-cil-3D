import { InMemoryProjetoRepository } from './InMemoryProjetoRepository'
import type { ProjetoRepository } from './ProjetoRepository'

export type { ProjetoRepository } from './ProjetoRepository'
export const projetoRepository: ProjetoRepository = new InMemoryProjetoRepository()
