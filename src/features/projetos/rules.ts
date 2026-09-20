import type { Categoria, CategoriaGaleria, Complementar, Projeto, ProjetoDetalhe } from './types'

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
