import type { Categoria, Complementar, Projeto } from './types'

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

export function hrefProjeto(projeto: Pick<Projeto, 'slug'>): string {
  return `/projetos/${projeto.slug}`
}

export function hrefComplementar(complementar: Pick<Complementar, 'slug'>): string {
  return `/complementares/${complementar.slug}`
}

export function hrefCategoria(categoria: Pick<Categoria, 'slug'>): string {
  return categoria.slug === 'mais' ? '/projetos' : `/projetos?categoria=${categoria.slug}`
}
