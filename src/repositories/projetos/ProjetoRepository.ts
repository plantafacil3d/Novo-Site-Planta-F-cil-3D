import type { Categoria, Complementar, Projeto, ProjetoDetalhe } from '@/features/projetos'

export interface ProjetoRepository {
  listarDestaques(): Promise<Projeto[]>
  listarComplementares(): Promise<Complementar[]>
  listarCategorias(): Promise<Categoria[]>
  /** `null` quando não existe projeto com esse slug. */
  buscarPorSlug(slug: string): Promise<ProjetoDetalhe | null>
  listarSlugs(): Promise<string[]>
  /** Projetos parecidos com o do slug informado (nunca inclui o próprio). */
  listarRelacionados(slug: string): Promise<Projeto[]>
}
