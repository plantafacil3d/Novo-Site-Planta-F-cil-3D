import type { TipoProjeto } from '@/features/projetos'

export type StatusProjeto = 'publicado' | 'rascunho'

/** Resumo do projeto na tabela do painel. Os campos crescem quando o cadastro completo for definido. */
export type ProjetoAdmin = {
  id: string
  /** Código que o cliente vê (ex.: "PF-001"). */
  codigo: string
  slug: string
  titulo: string
  tipo: TipoProjeto
  /** Inteiro em centavos. */
  precoCentavos: number
  status: StatusProjeto
  /** Data ISO. */
  criadoEm: string
}

/** Linha da tabela: o projeto mais os textos já formatados (preço, tipo, data) pela tela que a monta. */
export type LinhaProjetoAdmin = ProjetoAdmin & {
  precoFormatado: string
  tipoRotulo: string
  criadoEmRotulo: string
}

/** Dados para criar um projeto novo; o código é gerado pelo banco. */
export type NovoProjetoAdmin = Pick<
  ProjetoAdmin,
  'slug' | 'titulo' | 'tipo' | 'precoCentavos' | 'status'
>

export type ConsultaProjetosAdmin = {
  /** Nome ou código; todas as palavras precisam aparecer. */
  busca?: string
  pagina: number
  porPagina: number
}

/** Estado da listagem como chega pela URL, já validado. */
export type ParametrosAdminProjetos = {
  q?: string
  pagina: number
}

export type ResultadoAcao = { ok: true; mensagem: string } | { ok: false; mensagem: string }
