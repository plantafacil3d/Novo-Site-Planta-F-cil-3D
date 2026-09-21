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
  closets: string
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

export type ResultadoSalvar = { ok: boolean; mensagem: string }

/** Erros de uma etapa: mensagem por campo (`titulo`, `plantas.0.nome`, ...). */
export type ErrosDaEtapa = Record<string, string>
