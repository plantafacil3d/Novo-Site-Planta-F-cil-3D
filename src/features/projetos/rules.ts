import { categoriasDoCadastro, estilosDoCadastro } from '@/features/cadastro-projeto'
import type { Pagina } from '@/types/pagina'

import type {
  Categoria,
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

export type PrecoExibido = {
  /** Preço que vale, já formatado. */
  atual: string
  /** Preço riscado; só existe quando há desconto ativo. */
  original?: string
  /** Selo do desconto (ex.: "60% OFF"); só existe junto de `original`. */
  desconto?: string
}

/** Preço pronto para exibir: com `precoOriginalCentavos`, monta o riscado e o "% OFF"; sem ele, só o atual. */
export function exibirPreco(projeto: Pick<Projeto, 'precoCentavos' | 'precoOriginalCentavos'>): PrecoExibido {
  const atual = formatarPreco(projeto.precoCentavos)
  const original = projeto.precoOriginalCentavos
  if (!original) return { atual }

  const percentual = Math.round((1 - projeto.precoCentavos / original) * 100)
  return { atual, original: formatarPreco(original), desconto: `${percentual}% OFF` }
}

/** 7 x 20 → "7x20m" */
export function formatarMedidas(larguraM: number, profundidadeM: number): string {
  return `${larguraM}x${profundidadeM}m`
}

function contar(quantidade: number, singular: string, plural: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`
}

export type DescricaoProjeto = {
  terreno: string
  areaConstruida: string
  /** Soma de quartos, suítes e suíte master. */
  quartos: string
  /** Soma de banheiros sociais e lavabos. */
  banheiros: string
  vagas: string
  piscina: string
}

/** Textos das especificações do card, com singular/plural corretos. */
export function descreverProjeto(projeto: Projeto): DescricaoProjeto {
  return {
    terreno: formatarMedidas(projeto.larguraM, projeto.profundidadeM),
    areaConstruida: formatarArea(projeto.areaConstruidaM2),
    quartos: contar(projeto.quartos + projeto.suites + projeto.suiteMaster, 'Quarto', 'Quartos'),
    banheiros: contar(projeto.banheiros + projeto.lavabo, 'Banheiro', 'Banheiros'),
    vagas: contar(projeto.vagas, 'Vaga', 'Vagas'),
    piscina: simNao(projeto.piscina),
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

/** Cadastro: "Família indicada" (capacidade de pessoas). 5 → "Até 5 pessoas" */
export function formatarFamiliaIndicada(capacidade: number): string {
  return `Até ${contar(capacidade, 'pessoa', 'pessoas')}`
}

/** `quartos` do projeto são os que sobram além das suítes; o total é a soma dos dois. */
export function totalDeQuartos(projeto: Pick<Projeto, 'suites' | 'quartos'>): number {
  return projeto.suites + projeto.quartos
}

/** Especificações técnicas exibidas na página do projeto (`EspecificacoesTecnicas` e `GlossarioEspecificacoes`). */
export type ChaveEspecificacao =
  | 'larguraTerreno'
  | 'profundidadeTerreno'
  | 'areaConstruida'
  | 'quartos'
  | 'suites'
  | 'banheiros'
  | 'vagas'
  | 'pavimentos'
  | 'piscina'
  | 'areaGourmet'

type CamposDeEspecificacao = Pick<
  Projeto,
  'suites' | 'quartos' | 'banheiros' | 'vagas' | 'areaGourmet'
>

/**
 * Quais especificações aparecem para este projeto. No Cadastro, 0 significa "o projeto não tem"
 * (ver `EtapaCaracteristicas`), então esses campos somem — exceto Piscina, que sempre aparece
 * como Sim/Não. Única fonte desta regra: `EspecificacoesTecnicas` e `GlossarioEspecificacoes`
 * mostram sempre o mesmo conjunto de itens, cada um a seu jeito (valor e explicação).
 */
export function listarChavesDeEspecificacao(projeto: CamposDeEspecificacao): ChaveEspecificacao[] {
  const chaves: (ChaveEspecificacao | false)[] = [
    'larguraTerreno',
    'profundidadeTerreno',
    'areaConstruida',
    totalDeQuartos(projeto) > 0 && 'quartos',
    projeto.suites > 0 && 'suites',
    projeto.banheiros > 0 && 'banheiros',
    projeto.vagas > 0 && 'vagas',
    'pavimentos',
    'piscina',
    projeto.areaGourmet && 'areaGourmet',
  ]
  return chaves.filter((chave): chave is ChaveEspecificacao => chave !== false)
}

/** Descrição curta para Google e redes sociais (meta description). */
export function resumirParaBusca(projeto: ProjetoDetalhe): string {
  const area = formatarArea(projeto.areaConstruidaM2)
  const suites = contar(projeto.suites, 'suíte', 'suítes')
  const vagas = contar(projeto.vagas, 'vaga', 'vagas')
  const preco = formatarPreco(projeto.precoCentavos)
  return `Projeto pronto ${projeto.titulo}: ${area} de área construída, ${suites} e ${vagas}. Plantas, fachadas e imagens 3D por ${preco}.`
}

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
  'estilo',
  'quartos',
  'suites',
  'suiteMaster',
  'banheiros',
  'lavabo',
  'vagas',
  'pavimentos',
  'areaMin',
  'areaMax',
  'precoMin',
  'precoMax',
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
  return {
    filtros: {
      busca: params.q,
      categoria: params.categoria,
      estilo: params.estilo,
      quartosMin: params.quartos,
      suitesMin: params.suites,
      suiteMasterMin: params.suiteMaster,
      banheirosMin: params.banheiros,
      lavaboMin: params.lavabo,
      vagasMin: params.vagas,
      pavimentosMin: params.pavimentos,
      areaMinM2: params.areaMin,
      areaMaxM2: params.areaMax,
      precoMinCentavos:
        params.precoMin === undefined ? undefined : Math.round(params.precoMin * 100),
      precoMaxCentavos:
        params.precoMax === undefined ? undefined : Math.round(params.precoMax * 100),
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

/**
 * Opções de um select (Categoria, Estilo) restritas ao que existe em algum projeto publicado, na
 * ordem do catálogo. A opção já selecionada sempre aparece, mesmo sem projeto: senão o select
 * "perderia" visualmente o valor que ainda está na URL.
 */
export function filtrarCatalogoUsado<T extends { valor: string }>(
  catalogo: readonly T[],
  usados: readonly string[],
  selecionado: string | undefined,
): T[] {
  const validos = new Set(selecionado === undefined ? usados : [...usados, selecionado])
  return catalogo.filter((item) => validos.has(item.valor))
}

/**
 * Opções "N ou mais" (Quartos, Suítes...) que algum projeto publicado alcança, sem passar do maior
 * valor real. Mesma ressalva do valor selecionado da função acima.
 */
export function filtrarQuantidadesUsadas(
  opcoes: readonly number[],
  maximo: number,
  selecionado: number | undefined,
): number[] {
  return opcoes.filter((opcao) => opcao <= maximo || opcao === selecionado)
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
export function listarFiltrosAplicados(params: ParametrosListagem): FiltroAplicado[] {
  const rotulos: Record<CampoDeFiltro, string | undefined> = {
    q: params.q === undefined ? undefined : `Busca: ${params.q}`,
    categoria: rotuloDe(categoriasDoCadastro, params.categoria),
    estilo: rotuloDe(estilosDoCadastro, params.estilo),
    quartos: params.quartos === undefined ? undefined : `${params.quartos} ou mais quartos`,
    suites: params.suites === undefined ? undefined : `${params.suites} ou mais suítes`,
    suiteMaster:
      params.suiteMaster === undefined ? undefined : `${params.suiteMaster} ou mais suítes master`,
    banheiros: params.banheiros === undefined ? undefined : `${params.banheiros} ou mais banheiros`,
    lavabo: params.lavabo === undefined ? undefined : `${params.lavabo} ou mais lavabos`,
    vagas: params.vagas === undefined ? undefined : `${params.vagas} ou mais vagas`,
    pavimentos:
      params.pavimentos === undefined ? undefined : `${params.pavimentos} ou mais pavimentos`,
    areaMin:
      params.areaMin === undefined ? undefined : `Área a partir de ${formatarArea(params.areaMin)}`,
    areaMax: params.areaMax === undefined ? undefined : `Área até ${formatarArea(params.areaMax)}`,
    precoMin:
      params.precoMin === undefined
        ? undefined
        : `Preço a partir de ${formatarPreco(params.precoMin * 100)}`,
    precoMax:
      params.precoMax === undefined
        ? undefined
        : `Preço até ${formatarPreco(params.precoMax * 100)}`,
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
