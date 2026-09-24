import { z } from 'zod'

import { categoriasDoCadastro, estilosDoCadastro } from '@/features/cadastro-projeto'

import { ordenacoesDeProjetos } from './catalogo'
import type { ParametrosListagem } from './types'

// Tudo que vem da URL é entrada não confiável (skill `seguranca` §8.1): cada campo é validado e,
// se estiver fora do esperado, vira "sem filtro" em vez de erro. Nunca lança exceção.

/** Maior página aceita; evita pedir a página 999999999. */
const PAGINA_MAXIMA = 1000
const BUSCA_TAMANHO_MAXIMO = 100
/** Mesmo teto do cadastro (`area_construida_m2 <= 5000`, skill `seguranca` §8.1). */
const AREA_MAXIMA_M2 = 5000
/** Teto generoso, só pra barrar um valor absurdo digitado na URL. */
const PRECO_MAXIMO_REAIS = 1_000_000

const valoresDe = <T extends string>(lista: readonly { valor: T }[]) =>
  lista.map((item) => item.valor) as [T, ...T[]]

const texto = z
  .string()
  .transform((valor) => valor.trim().slice(0, BUSCA_TAMANHO_MAXIMO) || undefined)
  .optional()
  .catch(undefined)

const inteiro = (minimo: number, maximo: number) =>
  z.coerce.number().int().min(minimo).max(maximo).optional().catch(undefined)

const metros = z.coerce.number().min(1).max(500).optional().catch(undefined)
const areaM2 = z.coerce.number().min(0).max(AREA_MAXIMA_M2).optional().catch(undefined)
const reais = z.coerce.number().min(0).max(PRECO_MAXIMO_REAIS).optional().catch(undefined)

const marcado = z
  .literal('1')
  .transform(() => true)
  .optional()
  .catch(undefined)

const schema = z.object({
  q: texto,
  categoria: z.enum(valoresDe(categoriasDoCadastro)).optional().catch(undefined),
  estilo: z.enum(valoresDe(estilosDoCadastro)).optional().catch(undefined),
  quartos: inteiro(1, 20),
  suites: inteiro(1, 20),
  suiteMaster: inteiro(1, 20),
  banheiros: inteiro(1, 30),
  lavabo: inteiro(1, 10),
  vagas: inteiro(1, 20),
  pavimentos: inteiro(1, 5),
  areaMin: areaM2,
  areaMax: areaM2,
  precoMin: reais,
  precoMax: reais,
  largura: metros,
  profundidade: metros,
  piscina: marcado,
  gourmet: marcado,
  ordem: z.enum(valoresDe(ordenacoesDeProjetos)).catch('relevancia'),
  pagina: z.coerce.number().int().min(1).max(PAGINA_MAXIMA).catch(1),
})

type ParametrosBrutos = Record<string, string | string[] | undefined>

/** Lê os `searchParams` do Next e devolve o estado da listagem, sempre válido. */
export function lerParametrosListagem(brutos: ParametrosBrutos): ParametrosListagem {
  const primeiros = Object.fromEntries(
    Object.entries(brutos).map(([nome, valor]) => [nome, Array.isArray(valor) ? valor[0] : valor]),
  )
  return schema.parse(primeiros)
}
