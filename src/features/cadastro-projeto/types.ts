export type EtapaId =
  | 'informacoes'
  | 'imagens'
  | 'caracteristicas'
  | 'itens'
  | 'exemplos'
  | 'complementares'
  | 'entrega'

/** Situação de uma aba no menu: completa, com pendência ou opcional ainda sem conteúdo. */
export type SituacaoDaEtapa = 'complete' | 'pending' | 'optional'

export type SimNao = '' | 'sim' | 'nao'

/**
 * Arquivo escolhido no formulário. `arquivo` existe quando acabou de ser enviado pelo usuário;
 * um arquivo que já estava salvo (na edição) vem sem ele, só com os dados de exibição.
 */
export type ArquivoEscolhido = {
  id: string
  nomeArquivo: string
  /** Em bytes. */
  tamanho: number
  /** Tipo MIME informado pelo navegador (pode vir vazio em alguns sistemas). */
  tipo: string
  arquivo?: File
}

export type ImagemProjeto = ArquivoEscolhido & {
  /** Endereço da prévia (local enquanto não enviada). */
  url: string
}

export type PlantaProjeto = ImagemProjeto & {
  /** Nome que o cliente vê (ex.: "Térreo"). */
  nome: string
}

export type AnexoProjeto = ArquivoEscolhido

export type EntregaComplementar = '' | 'link' | 'pdf'

export type ComplementarProjeto = {
  id: string
  titulo: string
  /** Texto digitado, em reais (ex.: "1.299,90"). */
  valor: string
  descricao: string
  entrega: EntregaComplementar
  link: string
  pdf: AnexoProjeto | null
}

/**
 * Tudo que o formulário guarda. Números e preços ficam como texto digitado; a conversão e a
 * conferência são feitas em `schemas.ts`. O formulário nasce vazio (`dadosVazios`).
 */
export type DadosProjeto = {
  // 1. Informações Gerais
  titulo: string
  precoNormal: string
  precoPromocional: string
  categoria: string
  estilo: string
  resumo: string
  descricao: string
  tags: string[]
  videoUrl: string
  // 2. Imagens
  imagemPrincipal: ImagemProjeto | null
  imagens: ImagemProjeto[]
  plantas: PlantaProjeto[]
  // 3. Características
  larguraTerreno: string
  profundidadeTerreno: string
  areaConstruida: string
  quartos: string
  suites: string
  suiteMaster: string
  banheiros: string
  lavabo: string
  vagas: string
  pavimentos: string
  piscina: SimNao
  areaGourmet: SimNao
  // 4. Itens incluídos
  itens: string[]
  // 5. Arquivos de exemplo (ids da biblioteca)
  arquivosExemplo: string[]
  // 6. Complementares
  complementares: ComplementarProjeto[]
  // 7. Entrega
  entregaArquivos: AnexoProjeto[]
  entregaLink: string
}

/** Arquivo da biblioteca de exemplos do arquiteto (aba 5). */
export type ArquivoDeExemplo = {
  id: string
  nome: string
}

export type ModoSalvar = 'rascunho' | 'completo'

/** Erros de uma etapa: mensagem por campo (`titulo`, `plantas.0.nome`, ...). */
export type ErrosDaEtapa = Record<string, string>

// ── Arquivos ─────────────────────────────────────────────────────────────────────────────────────

/** Para que serve o arquivo no projeto. Decide o tipo aceito, a pasta e se o acesso é público. */
export type PapelDoArquivo = 'principal' | 'galeria' | 'planta' | 'entrega' | 'complementar_pdf'

/** O que a conferência precisa saber de um arquivo (um `File` do navegador já se encaixa). */
export type MetaArquivo = { nomeArquivo: string; tamanho: number; tipo: string }

/** Arquivo como viaja para o servidor: sem o `File` (que não vai na ação) e com o aviso se já foi gravado. */
export type ArquivoDoPayload = MetaArquivo & { id: string; salvo: boolean }

type DadosComArquivos<A extends MetaArquivo> = Omit<
  DadosProjeto,
  'imagemPrincipal' | 'imagens' | 'plantas' | 'entregaArquivos' | 'complementares'
> & {
  imagemPrincipal: A | null
  imagens: A[]
  plantas: (A & { nome: string })[]
  entregaArquivos: A[]
  complementares: (Omit<ComplementarProjeto, 'pdf'> & { pdf: A | null })[]
}

/** Dados vistos pela conferência (`schemas.ts`): só o que ela lê dos arquivos. */
export type DadosValidaveis = DadosComArquivos<MetaArquivo>

/** O que o formulário envia ao servidor para gravar. */
export type PayloadProjeto = DadosComArquivos<ArquivoDoPayload>

// ── Gravação ─────────────────────────────────────────────────────────────────────────────────────

/** O projeto pronto para o banco: números de verdade, preços em centavos, vazio virou `null`. */
export type CadastroGravavel = {
  titulo: string
  categoria: string | null
  estilo: string | null
  precoCentavos: number | null
  precoPromocionalCentavos: number | null
  resumo: string | null
  descricao: string | null
  tags: string[]
  videoUrl: string | null
  larguraM: number | null
  profundidadeM: number | null
  areaConstruidaM2: number | null
  quartos: number | null
  suites: number | null
  suiteMaster: number | null
  banheiros: number | null
  lavabo: number | null
  vagas: number | null
  pavimentos: number | null
  piscina: boolean | null
  areaGourmet: boolean | null
  itens: string[]
  entregaLink: string | null
}

export type ComplementarGravavel = {
  id: string
  titulo: string | null
  valorCentavos: number | null
  descricao: string | null
  entrega: 'link' | 'pdf' | null
  link: string | null
  ordem: number
}

export type ProjetoCriado = { id: string; codigo: string; slug: string }

/** Um arquivo que já está gravado (linha em `projeto_arquivos`). */
export type ArquivoGravado = {
  id: string
  papel: PapelDoArquivo
  complementarId: string | null
  caminho: string
  tamanhoBytes: number
}

export type NovoArquivoProjeto = {
  id: string
  projetoId: string
  papel: PapelDoArquivo
  complementarId: string | null
  caminho: string
  nomeOriginal: string
  /** Nome que o cliente vê (só as plantas). */
  rotulo: string | null
  tamanhoBytes: number
  tipoMime: string
  ordem: number
}

/** O que o servidor lê do projeto gravado para decidir se pode publicar. */
export type EstadoParaPublicar = {
  entregaLink: string | null
  complementares: { id: string; entrega: 'link' | 'pdf' | null }[]
  arquivos: { papel: PapelDoArquivo; complementarId: string | null }[]
}

/** Resposta das ações do servidor: ou deu certo (com o que a ação devolve) ou vem a mensagem do problema. */
export type ResultadoCadastro<T extends object = object> =
  ({ ok: true; mensagem: string } & T) | { ok: false; mensagem: string }
