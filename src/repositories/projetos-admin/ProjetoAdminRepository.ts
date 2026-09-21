import type {
  ConsultaProjetosAdmin,
  NovoProjetoAdmin,
  ProjetoAdmin,
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
  /** Devolve quantos projetos mudaram de status. */
  definirStatus(ids: string[], status: StatusProjeto): Promise<number>
}
