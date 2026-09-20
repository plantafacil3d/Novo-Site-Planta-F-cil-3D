import { z } from 'zod'

import {
  estilosArquitetonicos,
  faixasDeArea,
  ordenacoesDeProjetos,
  tiposDeProjeto,
} from './catalogo'
import type { CategoriaFiltravel, ParametrosListagem } from './types'

// Tudo que vem da URL é entrada não confiável (skill `seguranca` §8.1): cada campo é validado e,
// se estiver fora do esperado, vira "sem filtro" em vez de erro. Nunca lança exceção.

/** Maior página aceita; evita pedir a página 999999999. */
const PAGINA_MAXIMA = 1000
const BUSCA_TAMANHO_MAXIMO = 100

/** Só estes nomes viram filtro; o cliente não escolhe coluna nem campo. */
const categoriasFiltraveis = [
  'sobrados',
  'casas-terreas',
  'casas-pequenas',
  'casas-de-campo',
  'modernas',
  'com-1-suite',
  'com-2-suites',
  'com-piscina',
] as const satisfies readonly CategoriaFiltravel[]

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

const marcado = z
  .literal('1')
  .transform(() => true)
  .optional()
  .catch(undefined)

const schema = z.object({
  q: texto,
  categoria: z.enum(categoriasFiltraveis).optional().catch(undefined),
  tipo: z.enum(valoresDe(tiposDeProjeto)).optional().catch(undefined),
  estilo: z.enum(valoresDe(estilosArquitetonicos)).optional().catch(undefined),
  quartos: inteiro(1, 20),
  suites: inteiro(1, 20),
  vagas: inteiro(1, 20),
  area: z.enum(valoresDe(faixasDeArea)).optional().catch(undefined),
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
