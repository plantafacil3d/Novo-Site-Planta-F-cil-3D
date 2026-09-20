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

export type Projeto = {
  id: string
  slug: string
  titulo: string
  selo?: SeloProjeto
  imagem: ImagemRef
  larguraM: number
  profundidadeM: number
  suites: number
  quartos: number
  vagas: number
  pavimentos: number
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
  areaConstruidaM2: number
  banheiros: number
  piscina: boolean
  closet: boolean
  areaGourmet: boolean
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
