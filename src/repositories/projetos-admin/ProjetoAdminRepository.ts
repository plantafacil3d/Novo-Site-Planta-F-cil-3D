import type {
  ConsultaProjetosAdmin,
  NovoProjetoAdmin,
  ProjetoAdmin,
  StatusProjeto,
} from '@/features/admin'
import type {
  ArquivoGravado,
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

  // ── Cadastro completo ──────────────────────────────────────────────────────────────────────────

  /** Cria o projeto como rascunho. Lança `conflito` se o slug já existe. */
  criarCadastro(cadastro: CadastroGravavel, slug: string): Promise<ProjetoCriado>
  /** Atualiza os dados do projeto (o slug e o status não mudam). Lança `dados_invalidos` se ele não existe. */
  atualizarCadastro(id: string, cadastro: CadastroGravavel): Promise<void>
  /** Deixa os complementares do projeto exatamente como a lista: cria, atualiza e apaga o que sobrou. */
  sincronizarComplementares(
    projetoId: string,
    complementares: ComplementarGravavel[],
  ): Promise<void>
  listarArquivos(projetoId: string): Promise<ArquivoGravado[]>
  registrarArquivo(arquivo: NovoArquivoProjeto): Promise<void>
  removerArquivos(ids: string[]): Promise<void>
  /** Muda o nome que o cliente vê nas plantas já gravadas. */
  atualizarRotulos(rotulos: { id: string; rotulo: string | null }[]): Promise<void>
  /** `null` se o projeto não existe. */
  lerParaPublicar(id: string): Promise<EstadoParaPublicar | null>
}
