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
