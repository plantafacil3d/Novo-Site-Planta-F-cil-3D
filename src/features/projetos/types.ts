import type { EstiloArquitetonico, FaixaArea, OrdenacaoProjetos, TipoProjeto } from './catalogo'

export type ImagemRef = {
  src: string
  alt: string
}

export type SeloProjeto = 'Mais vendido' | 'Lançamento'

export type Diferencial = {
  tipo: 'piscina' | 'varanda-gourmet'
  /** Texto exibido (ex.: "Piscina opcional"). */
  rotulo: string
}

/** Resumo do projeto: o que o card e a listagem mostram e o que os filtros usam. */
export type Projeto = {
  id: string
  /** Código que o cliente vê e pode buscar (ex.: "PF-012"). */
  codigo: string
  /** Código manual do admin, opcional: liga o projeto a um vídeo do YouTube (ex.: "CASA-010"). */
  codigoYoutube?: string
  slug: string
  titulo: string
  selo?: SeloProjeto
  imagem: ImagemRef
  /** Taxonomia fixa da listagem/filtro público; projetos vindos do Cadastro não têm (usam só `categoria`/`estilo` como texto livre). */
  tipo?: TipoProjeto
  estilo?: EstiloArquitetonico
  larguraM: number
  profundidadeM: number
  areaConstruidaM2: number
  suites: number
  /** Suíte principal do projeto, contada à parte das demais suítes. */
  suiteMaster: number
  quartos: number
  banheiros: number
  lavabo: number
  vagas: number
  pavimentos: number
  piscina: boolean
  areaGourmet: boolean
  /** Calculado de `piscina`/`areaGourmet`; `undefined` quando nenhum dos dois é real. */
  diferencial?: Diferencial
  /** Inteiro em centavos, para nunca somar/comparar valores com ponto flutuante. */
  precoCentavos: number
}

export type ItemGaleria = {
  id: string
  imagem: ImagemRef
}

/** Cadastro: campo "Link de vídeo ou tour virtual" (YouTube ou Vimeo). */
export type VideoProjeto = {
  src: string
}

export type PerfilDoProjeto = {
  /** Calculado a partir de `larguraM` x `profundidadeM` — não é um campo do Cadastro. */
  terrenoMinimo: string
  /** Cadastro: campo "Perfil do terreno" (aba 1). */
  perfilDoTerreno: string
  /** Cadastro: campo "Família indicada" (aba 1). */
  familia: string
  /**
   * Cadastro: campo "Estilo arquitetônico" (aba 1), texto puro, como cadastrado — não confundir
   * com `Projeto.estilo` (taxonomia fixa do site público, usada em filtro/listagem).
   */
  estilo: string
  /**
   * Cadastro: campo "Categoria" (aba 1), texto puro, como cadastrado — não confundir com
   * `ProjetoDetalhe.categoria` (taxonomia fixa da listagem/breadcrumb).
   */
  categoria: string
}

/** Textos da seção "Sobre o projeto". Cadastro: campos da aba 1 (aba "Informações Gerais"). */
export type ConteudoSobre = {
  /** Cadastro: campo "Descrição detalhada". */
  descricao: string
  ambientes: string
  indicadoPara: string
  aplicacoes: string
}

/** Página completa de um projeto: o `Projeto` do card mais tudo que só a página mostra. */
export type ProjetoDetalhe = Projeto & {
  /**
   * Categoria como cadastrada (texto puro) — não confundir com `Categoria`, a taxonomia fixa da
   * listagem/filtro público. Usada só para exibir no breadcrumb.
   */
  categoriaRotulo: string
  /** Checkout externo (Hotmart ou outra plataforma). Só `https:` é aceito (ver `checkoutSeguro`). */
  checkoutUrl: string
  /** Frase curta do topo da página. */
  resumo: string
  sobre: ConteudoSobre
  galeria: ItemGaleria[]
  /** `undefined` quando o projeto não tem vídeo cadastrado. */
  video?: VideoProjeto
  /** Cadastro: coluna `itens` (aba 4, "Itens Incluídos"). Alimenta a seção "O que está incluso". */
  itensInclusos: string[]
  perfil: PerfilDoProjeto
}

export type Complementar = {
  id: string
  slug: string
  titulo: string
  imagem: ImagemRef
  precoCentavos: number
}

/** `mais` é a categoria "E muito mais": leva à listagem completa. */
export type CategoriaSlug =
  | 'sobrados'
  | 'casas-terreas'
  | 'casas-pequenas'
  | 'casas-de-campo'
  | 'kitnets'
  | 'casas-de-praia'
  | 'casas-geminadas'
  | 'projetos-de-fachada'
  | 'mais'

export type Categoria = {
  slug: CategoriaSlug
  rotulo: string
}

/** Categorias que viram filtro na listagem; `mais` só leva à listagem sem filtro. */
export type CategoriaFiltravel = Exclude<CategoriaSlug, 'mais'>

/**
 * Estado da listagem como chega pela URL (`/projetos?tipo=sobrado&pagina=2`), já validado.
 * Os nomes são os mesmos da URL; `q` é o texto digitado (nome ou código).
 */
export type ParametrosListagem = {
  q?: string
  categoria?: CategoriaFiltravel
  tipo?: TipoProjeto
  estilo?: EstiloArquitetonico
  /** Os três a seguir são "N ou mais". */
  quartos?: number
  suites?: number
  vagas?: number
  area?: FaixaArea
  /** Medidas do terreno do cliente, em metros: só entram projetos que cabem nele. */
  largura?: number
  profundidade?: number
  piscina?: boolean
  gourmet?: boolean
  ordem: OrdenacaoProjetos
  /** Começa em 1. */
  pagina: number
}

/** Filtros no vocabulário do domínio: é o que o repository entende (a URL é traduzida antes). */
export type FiltrosProjetos = {
  /** Nome ou código; todas as palavras precisam aparecer. */
  busca?: string
  categoria?: CategoriaFiltravel
  tipo?: TipoProjeto
  estilo?: EstiloArquitetonico
  quartosMin?: number
  suitesMin?: number
  vagasMin?: number
  areaMinM2?: number
  areaMaxM2?: number
  terrenoLarguraM?: number
  terrenoProfundidadeM?: number
  piscina?: boolean
  areaGourmet?: boolean
}

export type ConsultaProjetos = {
  filtros: FiltrosProjetos
  ordenacao: OrdenacaoProjetos
  pagina: number
  porPagina: number
}
