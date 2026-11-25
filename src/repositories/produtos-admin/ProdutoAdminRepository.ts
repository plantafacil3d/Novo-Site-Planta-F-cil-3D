import type {
  ConsultaProdutosAdmin,
  LinhaProdutoAdmin,
  OpcaoDoProduto,
  OpcoesDoProduto,
  ProdutoGravavel,
  TipoDeOpcao,
  ProdutoLigado,
  ProdutoParaEditar,
} from '@/features/produtos-cadastro'
import type { Pagina } from '@/types/pagina'

/** Cadastro de produtos no painel (sempre com a sessão do administrador; o banco confere). */
export interface ProdutoAdminRepository {
  /** Uma página da tabela do menu Produtos, mais novos primeiro. Busca e paginação no banco. */
  listar(consulta: ConsultaProdutosAdmin): Promise<Pagina<LinhaProdutoAdmin>>
  /** Busca ao vivo da aba Produtos (até `limite`). Inclui inativos (o admin vê tudo). */
  pesquisar(texto: string, limite: number): Promise<ProdutoLigado[]>
  /** `null` se não existe. */
  buscarParaEditar(id: string): Promise<ProdutoParaEditar | null>
  /** O produto que já usa este link (exato), ou `null`. */
  buscarPorLink(link: string): Promise<ProdutoLigado | null>
  /** Caminho atual da foto, ou `null` se o produto não existe. */
  lerCaminhoDaFoto(id: string): Promise<string | null>
  /** Cria e devolve o id. Lança `conflito` se o link já existe. */
  criar(produto: ProdutoGravavel): Promise<string>
  /** Lança `dados_invalidos` se o produto não existe e `conflito` se o link já é de outro. */
  atualizar(id: string, produto: ProdutoGravavel): Promise<void>
  /** Resumo de um produto (para devolver à tela depois de salvar). */
  buscarLigado(id: string): Promise<ProdutoLigado | null>
  /** Apaga o produto (as ligações e os cliques saem junto). Devolve o caminho da foto, ou `null`. */
  excluir(id: string): Promise<string | null>
  /**
   * Deixa o produto ligado exatamente a estes projetos ("Aparece nos projetos"): desliga os que
   * saíram e liga os novos no fim da lista de cada projeto. As posições já gravadas não mudam.
   */
  sincronizarProjetosDoProduto(produtoId: string, projetoIds: string[]): Promise<void>
  /** Produtos ligados a um projeto, na ordem da aba Produtos (inclui inativos). */
  listarDoProjeto(projetoId: string): Promise<ProdutoLigado[]>
  /** Deixa os produtos do projeto exatamente como a lista, nesta ordem (aba Produtos). */
  sincronizarProdutosDoProjeto(projetoId: string, produtoIds: string[]): Promise<void>

  // ── Categorias e ambientes (cadastrados pelo administrador) ──

  /** Todas as opções, em ordem alfabética, com quantos produtos usam cada uma. */
  listarOpcoes(): Promise<OpcoesDoProduto>
  /** Cria e devolve a opção. Lança `conflito` se o nome já existe naquele tipo. */
  criarOpcao(tipo: TipoDeOpcao, nome: string): Promise<OpcaoDoProduto>
  /**
   * Apaga a opção (ambiente apagado sai dos produtos sozinho). Lança `conflito` se for categoria
   * em uso. Devolve `false` se a opção não existe mais.
   */
  excluirOpcao(id: string): Promise<boolean>
}
