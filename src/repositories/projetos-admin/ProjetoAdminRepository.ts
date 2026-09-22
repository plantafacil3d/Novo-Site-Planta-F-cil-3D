import type {
  ArquivoDeProjeto,
  ConsultaProjetosAdmin,
  NovoProjetoAdmin,
  ProjetoAdmin,
  StatusProjeto,
} from '@/features/admin'
import type {
  ArquivoGravado,
  CadastroCompletoDoBanco,
  CadastroGravavel,
  ComplementarGravavel,
  EstadoParaPublicar,
  NovoArquivoProjeto,
  ProjetoCriado,
} from '@/features/cadastro-projeto'
import type { Pagina } from '@/types/pagina'

export interface ProjetoAdminRepository {
  /** Uma página, já filtrada e ordenada (mais novos primeiro). Busca e paginação rodam no banco. */
  listar(consulta: ConsultaProjetosAdmin): Promise<Pagina<ProjetoAdmin>>
  /** Só devolve os que existem; ids desconhecidos são ignorados. */
  buscarPorIds(ids: string[]): Promise<ProjetoAdmin[]>
  /** Cria projetos novos e devolve quantos foram criados. O código de cada um é gerado pelo banco. */
  criar(projetos: NovoProjetoAdmin[]): Promise<number>
  /** Devolve quantos projetos mudaram de status. */
  definirStatus(ids: string[], status: StatusProjeto): Promise<number>
  /**
   * Apaga os projetos de vez e devolve os ids que realmente saíram. Complementares e registros de
   * arquivo saem por cascade; os arquivos no Storage são de quem chama.
   */
  remover(ids: string[]): Promise<string[]>

  // ── Cadastro completo ──────────────────────────────────────────────────────────────────────────

  /** Cria o projeto como rascunho. Lança `conflito` se o slug já existe. */
  criarCadastro(cadastro: CadastroGravavel, slug: string): Promise<ProjetoCriado>
  /** Atualiza os dados do projeto (o slug e o status não mudam). Lança `dados_invalidos` se ele não existe. */
  atualizarCadastro(id: string, cadastro: CadastroGravavel): Promise<void>
  /** Cadastro completo do projeto (dados, complementares e arquivos), para a tela de edição. `null` se não existir. */
  buscarCadastroCompleto(id: string): Promise<CadastroCompletoDoBanco | null>
  /** Deixa os complementares do projeto exatamente como a lista: cria, atualiza e apaga o que sobrou. */
  sincronizarComplementares(
    projetoId: string,
    complementares: ComplementarGravavel[],
  ): Promise<void>
  listarArquivos(projetoId: string): Promise<ArquivoGravado[]>
  /**
   * Os arquivos gravados de vários projetos, só com o que o Storage precisa. Serve à exclusão, que
   * tem de ler os caminhos antes de apagar (o cascade leva a tabela de arquivos junto).
   */
  listarArquivosDeProjetos(ids: string[]): Promise<ArquivoDeProjeto[]>
  registrarArquivo(arquivo: NovoArquivoProjeto): Promise<void>
  removerArquivos(ids: string[]): Promise<void>
  /** Muda o nome que o cliente vê nas plantas já gravadas. */
  atualizarRotulos(rotulos: { id: string; rotulo: string | null }[]): Promise<void>
  /** `null` se o projeto não existe. */
  lerParaPublicar(id: string): Promise<EstadoParaPublicar | null>
}
