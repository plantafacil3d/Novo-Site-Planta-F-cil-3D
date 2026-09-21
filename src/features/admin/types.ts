import type { EstiloArquitetonico, TipoProjeto } from '@/features/projetos'

export type StatusProjeto = 'publicado' | 'rascunho'

export type SeloAdmin = 'mais-vendido' | 'lancamento'

export type TipoDiferencialAdmin = 'piscina' | 'varanda-gourmet'

/** Resumo do projeto na tabela do painel. */
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

/**
 * Etapas 1 (básico) e 2 (especificações) do cadastro. Tudo que é opcional pode ficar em branco
 * no rascunho; o que falta para publicar é conferido na hora de publicar.
 */
export type DetalhesProjetoAdmin = {
  estilo?: EstiloArquitetonico
  selo?: SeloAdmin
  /** Só `https:`. */
  checkoutUrl?: string
  /** Frase curta do topo da página do projeto. */
  resumo?: string
  descricao?: string
  larguraM?: number
  profundidadeM?: number
  areaConstruidaM2?: number
  /** Quartos além das suítes. */
  quartos?: number
  suites?: number
  banheiros?: number
  vagas?: number
  pavimentos?: number
  piscina: boolean
  closet: boolean
  areaGourmet: boolean
  diferencialTipo?: TipoDiferencialAdmin
  /** Texto exibido (ex.: "Piscina opcional"). Obrigatório quando há `diferencialTipo`. */
  diferencialRotulo?: string
}

/** O que o formulário de cadastro envia. O status não vem dele: nasce rascunho e só muda ao publicar. */
export type DadosCadastroProjeto = Pick<
  ProjetoAdmin,
  'slug' | 'titulo' | 'tipo' | 'precoCentavos'
> &
  DetalhesProjetoAdmin

/** Projeto aberto para edição no formulário. */
export type ProjetoAdminCompleto = ProjetoAdmin & DetalhesProjetoAdmin

/** Retorno do formulário de cadastro. `erros` traz uma mensagem por campo, pelo nome do campo. */
export type EstadoFormulario = {
  ok: boolean
  mensagem: string
  erros?: Record<string, string>
} | null

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
