import type {
  ArquivoApagado,
  ArquivoDaBiblioteca,
  ArquivoParaSelecao,
  ConsultaBiblioteca,
  NovoArquivoDaBiblioteca,
} from '@/features/biblioteca-exemplos'
import type { Pagina } from '@/types/pagina'

export interface BibliotecaExemplosRepository {
  /** Uma página, já filtrada e ordenada (mais novos primeiro), com quantos projetos usam cada
   *  arquivo (`vinculos`) — é o que sustenta o aviso antes de excluir. */
  listar(consulta: ConsultaBiblioteca): Promise<Pagina<ArquivoDaBiblioteca>>
  /** Até um teto fixo, só o que os checkboxes do cadastro de projeto precisam mostrar. */
  listarParaSelecao(): Promise<ArquivoParaSelecao[]>
  /** Só devolve os que existem; ids desconhecidos são ignorados. Hidrata a aba de exemplos do
   *  cadastro de projeto quando ele já tem arquivos vinculados. */
  buscarPorIds(ids: string[]): Promise<ArquivoParaSelecao[]>
  /** Grava a linha depois da conferência de conteúdo (extensão, tamanho e assinatura binária). */
  registrar(arquivo: NovoArquivoDaBiblioteca): Promise<void>
  /** Troca só o nome de exibição. O caminho no Storage é baseado no id, não no nome — não move nada
   *  no bucket. Quem consome o arquivo (aba "Arquivos de Exemplo" do cadastro de projeto) lê o nome
   *  ao vivo, nunca guarda uma cópia, então renomear aqui já propaga sozinho para todo lugar. */
  renomear(id: string, nomeOriginal: string): Promise<void>
  /**
   * Apaga de vez. O vínculo com os projetos sai sozinho, por cascade (`projeto_arquivos_exemplo`).
   * Devolve os caminhos de quem realmente saiu, para o Storage ser limpo por quem chamou.
   */
  remover(ids: string[]): Promise<ArquivoApagado[]>
}
