import type {
  ConsultaLoja,
  FiltrosDaLoja,
  OrigemDoClique,
  ProdutoResumo,
} from '@/features/produtos'
import type { Pagina } from '@/types/pagina'

/** Leituras públicas dos produtos (só ativos) e a anotação dos cliques em "Ver oferta". */
export interface ProdutoRepository {
  /** Uma página da Loja, com busca e filtros no banco. Mais novos primeiro. */
  buscar(consulta: ConsultaLoja): Promise<Pagina<ProdutoResumo>>
  /** Categorias e ambientes que têm algum produto ativo. */
  listarFiltrosUsados(): Promise<FiltrosDaLoja>
  /** Produtos ativos ligados a um projeto publicado, na ordem escolhida no cadastro. */
  listarDoProjeto(projetoId: string): Promise<ProdutoResumo[]>
  /** Link da oferta de um produto ativo, exatamente como cadastrado. `null` se não existe/inativo. */
  buscarLinkDaOferta(produtoId: string): Promise<string | null>
  registrarClique(produtoId: string, origem: OrigemDoClique): Promise<void>
}
