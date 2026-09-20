// Vocabulário da listagem: valores aceitos na URL e no banco, com o texto exibido ao cliente.
// Cada lista é a única fonte do seu tipo: acrescentar um item aqui já o libera nos filtros.

export const tiposDeProjeto = [
  { valor: 'sobrado', rotulo: 'Sobrado' },
  { valor: 'casa-terrea', rotulo: 'Casa térrea' },
  { valor: 'casa-de-campo', rotulo: 'Casa de campo' },
] as const

export type TipoProjeto = (typeof tiposDeProjeto)[number]['valor']

export const estilosArquitetonicos = [
  { valor: 'moderno', rotulo: 'Moderno' },
  { valor: 'contemporaneo', rotulo: 'Contemporâneo' },
  { valor: 'minimalista', rotulo: 'Minimalista' },
  { valor: 'classico', rotulo: 'Clássico' },
  { valor: 'rustico', rotulo: 'Rústico' },
] as const

export type EstiloArquitetonico = (typeof estilosArquitetonicos)[number]['valor']

export const ordenacoesDeProjetos = [
  { valor: 'relevancia', rotulo: 'Mais relevantes' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
  { valor: 'maior-area', rotulo: 'Maior área' },
  { valor: 'menor-area', rotulo: 'Menor área' },
] as const

export type OrdenacaoProjetos = (typeof ordenacoesDeProjetos)[number]['valor']

/** A área é sempre um número inteiro, então as faixas não se sobrepõem. Sem `maxM2` = sem limite. */
export const faixasDeArea = [
  { valor: 'ate-100', rotulo: 'Até 100 m²', minM2: 0, maxM2: 100 },
  { valor: '101-150', rotulo: '101 a 150 m²', minM2: 101, maxM2: 150 },
  { valor: '151-250', rotulo: '151 a 250 m²', minM2: 151, maxM2: 250 },
  { valor: 'acima-250', rotulo: 'Mais de 250 m²', minM2: 251, maxM2: undefined },
] as const

export type FaixaArea = (typeof faixasDeArea)[number]['valor']

/** Opções dos filtros "N ou mais" (quartos, suítes e vagas). */
export const opcoesDeQuantidade = {
  quartos: [1, 2, 3, 4, 5],
  suites: [1, 2, 3, 4],
  vagas: [1, 2, 3, 4],
} as const
