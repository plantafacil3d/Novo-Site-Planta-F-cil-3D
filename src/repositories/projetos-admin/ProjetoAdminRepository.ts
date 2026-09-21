import type {
  ConsultaProjetosAdmin,
  DadosCadastroProjeto,
  NovoProjetoAdmin,
  ProjetoAdmin,
  ProjetoAdminCompleto,
  StatusProjeto,
} from '@/features/admin'
import type { Pagina } from '@/types/pagina'

export interface ProjetoAdminRepository {
  /** Uma página, já filtrada e ordenada (mais novos primeiro). Busca e paginação rodam no banco. */
  listar(consulta: ConsultaProjetosAdmin): Promise<Pagina<ProjetoAdmin>>
  /** Só devolve os que existem; ids desconhecidos são ignorados. */
  buscarPorIds(ids: string[]): Promise<ProjetoAdmin[]>
  /** Cria projetos novos e devolve quantos foram criados. O código de cada um é gerado pelo banco. */
  criar(projetos: NovoProjetoAdmin[]): Promise<number>
  /** O projeto com todos os campos do cadastro, ou `null` se não existir. */
  buscarCompleto(id: string): Promise<ProjetoAdminCompleto | null>
  /** Cria um projeto em rascunho a partir do formulário e devolve o id. O código é gerado pelo banco. */
  criarRascunho(dados: DadosCadastroProjeto): Promise<string>
  /** Grava o formulário no projeto; campos em branco limpam o valor. Não mexe no status. */
  atualizar(id: string, dados: DadosCadastroProjeto): Promise<void>
  /** Devolve quantos projetos mudaram de status. */
  definirStatus(ids: string[], status: StatusProjeto): Promise<number>
}
