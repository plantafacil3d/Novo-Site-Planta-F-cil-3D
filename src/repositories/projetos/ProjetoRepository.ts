import type {
  Categoria,
  Complementar,
  ConsultaProjetos,
  LimitesDeFiltro,
  Projeto,
  ProjetoDetalhe,
} from '@/features/projetos'
import type { Pagina } from '@/types/pagina'

export interface ProjetoRepository {
  listarDestaques(): Promise<Projeto[]>
  listarComplementares(): Promise<Complementar[]>
  listarCategorias(): Promise<Categoria[]>
  /**
   * Uma página do catálogo, já filtrada e ordenada. Filtro, ordem e paginação acontecem aqui,
   * onde ficam os dados (no banco, isso vira uma consulta com `where`, `order by` e `limit`);
   * nunca se baixa o catálogo inteiro para filtrar no navegador. Devolve só o resumo do projeto.
   */
  buscarProjetos(consulta: ConsultaProjetos): Promise<Pagina<Projeto>>
  /** Menor/maior preço e área entre os projetos publicados, para balizar o filtro de faixa. */
  buscarLimites(): Promise<LimitesDeFiltro>
  /** `null` quando não existe projeto com esse slug. */
  buscarPorSlug(slug: string): Promise<ProjetoDetalhe | null>
  listarSlugs(): Promise<string[]>
  /**
   * Projetos parecidos com o informado (nunca inclui o próprio). Recebe `id`/`categoria` do
   * projeto já carregado pela página, em vez do slug, para não repetir a busca que os obteve.
   */
  listarRelacionados(id: string, categoria: string): Promise<Projeto[]>
}
