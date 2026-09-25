import type { CategoriaDoCadastro, EstiloDoCadastro } from '@/features/cadastro-projeto'

import type { OrdenacaoProjetos } from './catalogo'

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
  /** Mesmo vocabulário do cadastro (`estilosDoCadastro`); `undefined` quando o projeto não tem estilo cadastrado. */
  estilo?: EstiloDoCadastro
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
  /** Cadastro: campo "Preço normal", só quando maior que `precoCentavos` (há desconto ativo). */
  precoOriginalCentavos?: number
}

export type ItemGaleria = {
  id: string
  imagem: ImagemRef
}

/** Uma linha da lista "Informações da planta" (painel ao lado da imagem, na galeria de pavimentos). */
export type ItemInformacaoPavimento = {
  id: string
  nome: string
  metragemM2: number | null
  numeroBolinha: number | null
}

/** Um pavimento da galeria "Planta Humanizada". */
export type PavimentoPublico = {
  id: string
  nome: string
  imagem: ImagemRef
  itens: ItemInformacaoPavimento[]
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
  /** Cadastro: campo "Estilo arquitetônico" (aba 1), como cadastrado. */
  estilo: string
  /** Cadastro: campo "Categoria" (aba 1), como cadastrado. */
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
  /** Categoria como cadastrada (texto puro), usada só para exibir no breadcrumb. */
  categoriaRotulo: string
  /** Checkout externo (Hotmart ou outra plataforma). Só `https:` é aceito (ver `checkoutSeguro`). */
  checkoutUrl: string
  /** Frase curta do topo da página. */
  resumo: string
  sobre: ConteudoSobre
  galeria: ItemGaleria[]
  /** Pavimentos da aba "Planta Humanizada" do cadastro, na ordem de exibição. Lista vazia = a
   *  seção não aparece na página. Nome diferente de `pavimentos` (herdado de `Projeto`: o número
   *  de pavimentos do imóvel) para não colidir com ele. */
  plantaHumanizada: PavimentoPublico[]
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

/**
 * Categorias em destaque na home ("Explore por categoria"): um subconjunto fixo e curado de
 * `categoriasDoCadastro`, cada uma com ícone. `mais` é "E muito mais": leva à listagem completa,
 * sem filtro. Não confundir com `CategoriaDoCadastro` (o vocabulário completo, usado no filtro).
 */
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

/**
 * Estado da listagem como chega pela URL (`/projetos?categoria=sobrados&pagina=2`), já validado.
 * Os nomes são os mesmos da URL; `q` é o texto digitado (nome ou código).
 */
export type ParametrosListagem = {
  q?: string
  /** Mesmo vocabulário do cadastro (`categoriasDoCadastro`): chega pelo card da home ou pelo filtro. */
  categoria?: CategoriaDoCadastro
  estilo?: EstiloDoCadastro
  /** Estes cinco são "N ou mais". */
  quartos?: number
  suites?: number
  suiteMaster?: number
  banheiros?: number
  lavabo?: number
  vagas?: number
  pavimentos?: number
  /** Faixa de área construída, em m²; os limites reais vêm de `listarLimitesDeFiltro`. */
  areaMin?: number
  areaMax?: number
  /** Faixa de preço, em reais (não centavos: é o que o cliente digita). */
  precoMin?: number
  precoMax?: number
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
  categoria?: CategoriaDoCadastro
  estilo?: EstiloDoCadastro
  quartosMin?: number
  suitesMin?: number
  suiteMasterMin?: number
  banheirosMin?: number
  lavaboMin?: number
  vagasMin?: number
  pavimentosMin?: number
  areaMinM2?: number
  areaMaxM2?: number
  precoMinCentavos?: number
  precoMaxCentavos?: number
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

/**
 * O que existe de verdade entre os projetos publicados, pra nenhum filtro oferecer uma opção que
 * não leva a lugar nenhum: menor/maior preço e área (balizam os campos "De/Até"), quais categorias
 * e estilos foram usados por algum projeto, e o maior valor de cada "N ou mais" (quem tem só uma
 * casa de 2 quartos não vê a opção "5 ou mais"). Zero/lista vazia quando não há projeto publicado.
 */
export type LimitesDeFiltro = {
  precoMinCentavos: number
  precoMaxCentavos: number
  areaMinM2: number
  areaMaxM2: number
  /** Mesmo vocabulário do cadastro (`categoriasDoCadastro`/`estilosDoCadastro`). */
  categorias: string[]
  estilos: string[]
  /** Soma quartos + suítes, como o filtro "Quartos" (`quartos_total` no banco). */
  quartosMax: number
  suitesMax: number
  suiteMasterMax: number
  banheirosMax: number
  lavaboMax: number
  vagasMax: number
  pavimentosMax: number
}
