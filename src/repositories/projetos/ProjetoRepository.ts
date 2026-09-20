import type { Categoria, Complementar, Projeto } from '@/features/projetos'

export interface ProjetoRepository {
  listarDestaques(): Promise<Projeto[]>
  listarComplementares(): Promise<Complementar[]>
  listarCategorias(): Promise<Categoria[]>
}
