export type EtapaId =
  | 'informacoes'
  | 'imagens'
  | 'plantaHumanizada'
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

/** Uma linha da lista "Informações da planta" de um pavimento. Números ficam como texto digitado
 *  (a conversão mora em `rules.ts`/`schemas.ts`, igual ao resto do formulário). */
export type ItemDaPlanta = {
  id: string
  nome: string
  /** Só o número, vírgula decimal (ex.: "24,36"); vazio = sem metragem. O "m²" é só de exibição. */
  metragem: string
  /** Número desenhado na imagem (ex.: "3"); vazio = sem bolinha. */
  numeroBolinha: string
}

/** Um cartão de pavimento na aba "Planta humanizada". */
export type PavimentoProjeto = {
  id: string
  /** '' = sem nome customizado: a tela mostra o padrão calculado pela posição ("Pavimento N"). */
  nome: string
  imagem: ImagemProjeto | null
  itens: ItemDaPlanta[]
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
  /** Código manual digitado pelo admin, sempre em maiúsculas: liga o projeto a um vídeo do YouTube. */
  codigoYoutube: string
  precoNormal: string
  precoPromocional: string
  categoria: string
  estilo: string
  resumo: string
  descricao: string
  ambientes: string
  indicadoPara: string
  aplicacoes: string
  perfilTerreno: string
  /** Digitado como número (capacidade de pessoas); vira "Até N pessoas" na página pública. */
  familiaCapacidade: string
  tags: string[]
  videoUrl: string
  checkoutUrl: string
  // 2. Imagens
  imagemPrincipal: ImagemProjeto | null
  imagens: ImagemProjeto[]
  // 2.1 Planta humanizada (aba própria, opcional). Nome diferente de `pavimentos` (abaixo, o
  // número de pavimentos do imóvel, aba Características) para não colidir com ele.
  plantaHumanizada: PavimentoProjeto[]
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

/** Arquivo da biblioteca de exemplos do arquiteto (aba 5), para marcar nos checkboxes. */
export type ArquivoDeExemplo = {
  id: string
  nome: string
  tipoMime: string
  tamanhoBytes: number
}

export type ModoSalvar = 'rascunho' | 'completo'

/** Erros de uma etapa: mensagem por campo (`titulo`, `plantaHumanizada.0.imagem`, ...). */
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
  'imagemPrincipal' | 'imagens' | 'plantaHumanizada' | 'entregaArquivos' | 'complementares'
> & {
  imagemPrincipal: A | null
  imagens: A[]
  plantaHumanizada: (Omit<PavimentoProjeto, 'imagem'> & { imagem: A | null })[]
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
  codigoYoutube: string | null
  categoria: string | null
  estilo: string | null
  precoCentavos: number | null
  precoPromocionalCentavos: number | null
  resumo: string | null
  descricao: string | null
  ambientes: string | null
  indicadoPara: string | null
  aplicacoes: string | null
  perfilTerreno: string | null
  familiaCapacidade: number | null
  tags: string[]
  videoUrl: string | null
  checkoutUrl: string | null
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

/** Uma linha de `pavimento_itens`, pronta para gravar. */
export type ItemDaPlantaGravavel = {
  id: string
  nome: string
  metragemM2: number | null
  numeroBolinha: number | null
  ordem: number
}

/** Um pavimento pronto para gravar (`projeto_pavimentos`); a imagem viaja à parte, como arquivo. */
export type PavimentoGravavel = {
  id: string
  /** `null` = sem nome customizado. */
  nome: string | null
  ordem: number
  itens: ItemDaPlantaGravavel[]
}

export type ProjetoCriado = { id: string; codigo: string; slug: string }

/** Um arquivo gravado, com tudo que a tela de edição precisa (nome, tamanho e o papel dele). */
export type ArquivoCompletoDoBanco = {
  id: string
  papel: PapelDoArquivo
  complementarId: string | null
  /** Pavimento a que a imagem pertence (só o papel `planta`). */
  pavimentoId: string | null
  caminho: string
  nomeOriginal: string
  tamanhoBytes: number
  tipoMime: string
  ordem: number
}

/** Um pavimento como está gravado (linha de `projeto_pavimentos` + seus `pavimento_itens`). */
export type PavimentoDoBanco = {
  id: string
  nome: string | null
  ordem: number
  itens: ItemDaPlantaGravavel[]
}

/** O projeto como está gravado, para carregar a tela de edição: dados, complementares e arquivos. */
export type CadastroCompletoDoBanco = CadastroGravavel & {
  id: string
  /** Endereço público do projeto (parte final do link). Fixo desde a criação — editar o título não
   *  muda o que já está gravado (skill `arquitetura`: URLs estáveis, ver `references/stack.md`). */
  slug: string
  complementares: ComplementarGravavel[]
  /** Cartões de pavimento da aba "Planta humanizada". Nome diferente de `pavimentos` (herdado de
   *  `CadastroGravavel`: o número de pavimentos do imóvel) para não colidir com ele. */
  plantaHumanizada: PavimentoDoBanco[]
  arquivos: ArquivoCompletoDoBanco[]
  /** Ids dos arquivos da biblioteca vinculados a este projeto (aba 5). */
  arquivosExemplo: string[]
}

/** Um arquivo que já está gravado (linha em `projeto_arquivos`). */
export type ArquivoGravado = {
  id: string
  papel: PapelDoArquivo
  complementarId: string | null
  pavimentoId: string | null
  caminho: string
  tamanhoBytes: number
}

export type NovoArquivoProjeto = {
  id: string
  projetoId: string
  papel: PapelDoArquivo
  complementarId: string | null
  pavimentoId: string | null
  caminho: string
  nomeOriginal: string
  tamanhoBytes: number
  tipoMime: string
  ordem: number
}

/** O que o servidor lê do projeto gravado para decidir se pode publicar. */
export type EstadoParaPublicar = {
  entregaLink: string | null
  complementares: { id: string; entrega: 'link' | 'pdf' | null }[]
  /** Cada pavimento cadastrado precisa ter uma imagem entre os `arquivos` abaixo. */
  plantaHumanizada: { id: string }[]
  arquivos: { papel: PapelDoArquivo; complementarId: string | null; pavimentoId: string | null }[]
}

/** Resposta das ações do servidor: ou deu certo (com o que a ação devolve) ou vem a mensagem do problema. */
export type ResultadoCadastro<T extends object = object> =
  ({ ok: true; mensagem: string } & T) | { ok: false; mensagem: string }

/** Resultado de UM item dentro de uma ação em lote: mesmo formato de `ResultadoCadastro`, com o id do
 *  item para o chamador casar a resposta com o arquivo que a gerou. */
export type ResultadoDoItem<T extends object = object> = { id: string } & ResultadoCadastro<T>
