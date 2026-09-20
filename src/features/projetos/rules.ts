import type { Pagina } from '@/types/pagina'

import { estilosArquitetonicos, faixasDeArea, tiposDeProjeto } from './catalogo'
import type {
  Categoria,
  CategoriaGaleria,
  Complementar,
  ConsultaProjetos,
  ParametrosListagem,
  Projeto,
  ProjetoDetalhe,
} from './types'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 39900 → "R$ 399,00" */
export function formatarPreco(centavos: number): string {
  return moeda.format(centavos / 100)
}

/** 7 x 20 → "7x20m" */
export function formatarMedidas(larguraM: number, profundidadeM: number): string {
  return `${larguraM}x${profundidadeM}m`
}

function contar(quantidade: number, singular: string, plural: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`
}

export type DescricaoProjeto = {
  medidas: string
  suites: string
  quartos: string
  vagas: string
  pavimentos: string
  diferencial: string
}

/** Textos das especificações do card, com singular/plural corretos. */
export function descreverProjeto(projeto: Projeto): DescricaoProjeto {
  return {
    medidas: formatarMedidas(projeto.larguraM, projeto.profundidadeM),
    suites: contar(projeto.suites, 'Suíte', 'Suítes'),
    quartos: contar(projeto.quartos, 'Quarto', 'Quartos'),
    vagas: contar(projeto.vagas, 'Vaga', 'Vagas'),
    pavimentos: contar(projeto.pavimentos, 'Pavimento', 'Pavimentos'),
    diferencial: projeto.diferencial.rotulo,
  }
}

const decimais = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 7 → "7,00 m" */
export function formatarMetros(metros: number): string {
  return `${decimais.format(metros)} m`
}

/** 158 → "158,00 m²" */
export function formatarArea(metrosQuadrados: number): string {
  return `${decimais.format(metrosQuadrados)} m²`
}

export function simNao(valor: boolean): string {
  return valor ? 'Sim' : 'Não'
}

/** `quartos` do projeto são os que sobram além das suítes; o total é a soma dos dois. */
export function totalDeQuartos(projeto: Pick<Projeto, 'suites' | 'quartos'>): number {
  return projeto.suites + projeto.quartos
}

export type ResumoRapido = {
  suites: string
  /** Só existe quando há quarto além das suítes (ex.: "+1 Quarto"). */
  quartoExtra?: string
  banheiros: string
  vagas: string
}

/** Textos das especificações rápidas do topo da página. */
export function resumirProjeto(projeto: ProjetoDetalhe): ResumoRapido {
  return {
    suites: contar(projeto.suites, 'Suíte', 'Suítes'),
    quartoExtra:
      projeto.quartos > 0 ? `+${contar(projeto.quartos, 'Quarto', 'Quartos')}` : undefined,
    banheiros: contar(projeto.banheiros, 'Banheiro', 'Banheiros'),
    vagas: contar(projeto.vagas, 'Vaga', 'Vagas'),
  }
}

/** Descrição curta para Google e redes sociais (meta description). */
export function resumirParaBusca(projeto: ProjetoDetalhe): string {
  const area = formatarArea(projeto.areaConstruidaM2)
  const suites = contar(projeto.suites, 'suíte', 'suítes')
  const vagas = contar(projeto.vagas, 'vaga', 'vagas')
  const preco = formatarPreco(projeto.precoCentavos)
  return `Projeto pronto ${projeto.titulo}: ${area} de área construída, ${suites} e ${vagas}. Plantas, fachadas e imagens 3D por ${preco}.`
}

/** Abas da galeria, na ordem em que aparecem. */
export const categoriasGaleria: { id: CategoriaGaleria; rotulo: string }[] = [
  { id: 'fachadas', rotulo: 'Fachadas' },
  { id: 'ambientes', rotulo: 'Ambientes' },
  { id: 'plantas', rotulo: 'Plantas' },
  { id: 'implantacao', rotulo: 'Implantação' },
  { id: 'detalhes', rotulo: 'Detalhes' },
  { id: 'imagens-3d', rotulo: 'Imagens 3D' },
]

/**
 * Só deixa passar link de checkout `https:`; qualquer outra coisa (ex.: `javascript:`) vira `null`
 * e o botão de compra fica indisponível.
 */
export function checkoutSeguro(url: string): string | null {
  try {
    return new URL(url).protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

export function hrefProjeto(projeto: Pick<Projeto, 'slug'>): string {
  return `/projetos/${projeto.slug}`
}

export function hrefComplementar(complementar: Pick<Complementar, 'slug'>): string {
  return `/complementares/${complementar.slug}`
}

export function hrefCategoria(categoria: Pick<Categoria, 'slug'>): string {
  return categoria.slug === 'mais' ? '/projetos' : `/projetos?categoria=${categoria.slug}`
}

/** Projetos por página nas grades de cards (12 fecha certo em 1, 2, 3 e 4 colunas). */
export const PROJETOS_POR_PAGINA = 12

/** Teto por página, imposto em `montarConsulta`: ninguém consegue pedir a lista inteira (`seguranca` §8.1). */
const POR_PAGINA_MAXIMO = 48

export function totalDePaginas(total: number, porPagina = PROJETOS_POR_PAGINA): number {
  return Math.max(1, Math.ceil(total / porPagina))
}

/** "Mostrando 13–24 de 36 projetos"; com uma página só, "5 projetos encontrados". */
export function descreverResultados({
  total,
  pagina,
  porPagina,
}: Pick<Pagina<unknown>, 'total' | 'pagina' | 'porPagina'>): string {
  if (total <= porPagina) return contar(total, 'projeto encontrado', 'projetos encontrados')
  const inicio = (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, total)
  return `Mostrando ${inicio}–${fim} de ${total} projetos`
}

/** Campos da URL que filtram a lista (ordem e página não contam como filtro). */
const camposDeFiltro = [
  'q',
  'categoria',
  'tipo',
  'estilo',
  'quartos',
  'suites',
  'vagas',
  'area',
  'largura',
  'profundidade',
  'piscina',
  'gourmet',
] as const

type CampoDeFiltro = (typeof camposDeFiltro)[number]

export function temFiltros(params: ParametrosListagem): boolean {
  return camposDeFiltro.some((campo) => params[campo] !== undefined)
}

export function contarFiltros(params: ParametrosListagem): number {
  return camposDeFiltro.filter((campo) => params[campo] !== undefined).length
}

/** Endereço da listagem só com o que foge do padrão (sem `pagina=1` nem `ordem=relevancia`). */
export function montarHrefListagem(params: Partial<ParametrosListagem>): string {
  const busca = new URLSearchParams()
  for (const campo of camposDeFiltro) {
    const valor = params[campo]
    if (valor === undefined || valor === false) continue
    busca.set(campo, valor === true ? '1' : String(valor))
  }
  if (params.ordem && params.ordem !== 'relevancia') busca.set('ordem', params.ordem)
  if (params.pagina && params.pagina > 1) busca.set('pagina', String(params.pagina))

  const texto = busca.toString()
  return texto ? `/projetos?${texto}` : '/projetos'
}

/** Traduz o que veio da URL para a consulta que o repository entende. */
export function montarConsulta(
  params: ParametrosListagem,
  porPagina = PROJETOS_POR_PAGINA,
): ConsultaProjetos {
  const faixa = faixasDeArea.find((item) => item.valor === params.area)

  return {
    filtros: {
      busca: params.q,
      categoria: params.categoria,
      tipo: params.tipo,
      estilo: params.estilo,
      quartosMin: params.quartos,
      suitesMin: params.suites,
      vagasMin: params.vagas,
      areaMinM2: faixa?.minM2,
      areaMaxM2: faixa?.maxM2,
      terrenoLarguraM: params.largura,
      terrenoProfundidadeM: params.profundidade,
      piscina: params.piscina,
      areaGourmet: params.gourmet,
    },
    ordenacao: params.ordem,
    pagina: params.pagina,
    porPagina: Math.min(Math.max(1, Math.floor(porPagina)), POR_PAGINA_MAXIMO),
  }
}

export type FiltroAplicado = {
  campo: CampoDeFiltro
  rotulo: string
  /** Endereço da listagem sem este filtro (e de volta à página 1). */
  href: string
}

const numero = new Intl.NumberFormat('pt-BR')

function rotuloDe<T extends string>(
  lista: readonly { valor: T; rotulo: string }[],
  valor: T | undefined,
): string | undefined {
  return lista.find((item) => item.valor === valor)?.rotulo
}

/** Filtros ativos em forma de texto, cada um com o link que o remove. */
export function listarFiltrosAplicados(
  params: ParametrosListagem,
  categorias: Categoria[],
): FiltroAplicado[] {
  const rotulos: Record<CampoDeFiltro, string | undefined> = {
    q: params.q === undefined ? undefined : `Busca: ${params.q}`,
    categoria: categorias.find((categoria) => categoria.slug === params.categoria)?.rotulo,
    tipo: rotuloDe(tiposDeProjeto, params.tipo),
    estilo: rotuloDe(estilosArquitetonicos, params.estilo),
    quartos: params.quartos === undefined ? undefined : `${params.quartos} ou mais quartos`,
    suites: params.suites === undefined ? undefined : `${params.suites} ou mais suítes`,
    vagas: params.vagas === undefined ? undefined : `${params.vagas} ou mais vagas`,
    area: rotuloDe(faixasDeArea, params.area),
    largura:
      params.largura === undefined
        ? undefined
        : `Terreno com ${numero.format(params.largura)} m de frente`,
    profundidade:
      params.profundidade === undefined
        ? undefined
        : `Terreno com ${numero.format(params.profundidade)} m de fundo`,
    piscina: params.piscina ? 'Com piscina' : undefined,
    gourmet: params.gourmet ? 'Com área gourmet' : undefined,
  }

  return camposDeFiltro.flatMap((campo) => {
    const rotulo = rotulos[campo]
    if (!rotulo) return []
    return [
      { campo, rotulo, href: montarHrefListagem({ ...params, [campo]: undefined, pagina: 1 }) },
    ]
  })
}
