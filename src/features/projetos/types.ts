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
  tipo: TipoProjeto
  estilo: EstiloArquitetonico
  larguraM: number
  profundidadeM: number
  areaConstruidaM2: number
  suites: number
  quartos: number
  vagas: number
  pavimentos: number
  piscina: boolean
  areaGourmet: boolean
  diferencial: Diferencial
  /** Inteiro em centavos, para nunca somar/comparar valores com ponto flutuante. */
  precoCentavos: number
}

export type CategoriaGaleria =
  'fachadas' | 'ambientes' | 'plantas' | 'implantacao' | 'detalhes' | 'imagens-3d'

export type ItemGaleria = {
  id: string
  categoria: CategoriaGaleria
  imagem: ImagemRef
}

export type VideoProjeto = {
  src: string
  poster: ImagemRef
  /** Ex.: "04:32". Sem valor, o selo de duração não aparece. */
  duracao?: string
}

export type TipoAmbiente =
  'sala-estar' | 'sala-jantar' | 'cozinha' | 'suite' | 'area-servico' | 'varanda-gourmet'

export type Ambiente = {
  tipo: TipoAmbiente
  titulo: string
  descricao: string
}

export type PerfilDoProjeto = {
  terrenoMinimo: string
  perfilDoTerreno: string
  familia: string
  estiloDeVida: string
  aplicacoes: string
  observacao: string
}

/** Textos da seção "Sobre o projeto". */
export type ConteudoSobre = {
  introducao: string
  textos: string[]
  /** Diferenciais em tópicos (com check). */
  destaques: string[]
  ambientes: string
  indicadoPara: string
  aplicacoes: string
  imagem: ImagemRef
}

/** Página completa de um projeto: o `Projeto` do card mais tudo que só a página mostra. */
export type ProjetoDetalhe = Projeto & {
  categoria: Categoria
  /** Checkout externo (Hotmart ou outra plataforma). Só `https:` é aceito (ver `checkoutSeguro`). */
  checkoutUrl: string
  banheiros: number
  closet: boolean
  /** Frase curta do topo da página. */
  resumo: string
  /** Parágrafo do topo da página. */
  descricao: string
  sobre: ConteudoSobre
  galeria: ItemGaleria[]
  video: VideoProjeto
  ambientes: Ambiente[]
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
  | 'modernas'
  | 'com-1-suite'
  | 'com-2-suites'
  | 'com-piscina'
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
