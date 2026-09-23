import { z } from 'zod'

// Tudo que vem da URL ou do navegador é entrada não confiável (skill `seguranca` §8.1).

import { LIMITES_BIBLIOTECA, NOME_MAXIMO, SELECAO_MAXIMA, temSimbolosProibidos } from './rules'

const SEM_SIMBOLOS = 'Não use os símbolos < e >.'

const PAGINA_MAXIMA = 1000
const BUSCA_TAMANHO_MAXIMO = 100

const schemaParametros = z.object({
  q: z
    .string()
    .transform((valor) => valor.trim().slice(0, BUSCA_TAMANHO_MAXIMO) || undefined)
    .optional()
    .catch(undefined),
  pagina: z.coerce.number().int().min(1).max(PAGINA_MAXIMA).catch(1),
})

/** Lê os `searchParams` do Next e devolve o estado da listagem, sempre válido (nunca lança). */
export function lerParametrosAdminBiblioteca(
  brutos: Record<string, string | string[] | undefined>,
) {
  const primeiros = Object.fromEntries(
    Object.entries(brutos).map(([nome, valor]) => [nome, Array.isArray(valor) ? valor[0] : valor]),
  )
  return schemaParametros.parse(primeiros)
}

/** Ids de uma ação em massa: uuids, sem repetição, de 1 a `SELECAO_MAXIMA`. */
export const schemaIds = z
  .array(z.uuid())
  .min(1)
  .max(SELECAO_MAXIMA)
  .transform((ids) => [...new Set(ids)])

const schemaArquivo = z.object({
  id: z.uuid(),
  nomeArquivo: z.string().min(1).max(255),
  tamanho: z.number().int().positive(),
  tipo: z.string().max(100),
})

export type DadosDoArquivo = z.infer<typeof schemaArquivo>

export const schemaLoteDeArquivos = z.array(schemaArquivo).min(1).max(LIMITES_BIBLIOTECA.loteMax)

/** Novo nome de exibição de um arquivo já existente na biblioteca. */
export const schemaRenomear = z.object({
  id: z.uuid(),
  nomeOriginal: z
    .string()
    .trim()
    .min(1, 'Dê um nome ao arquivo.')
    .max(NOME_MAXIMO, `Use no máximo ${NOME_MAXIMO} caracteres.`)
    .refine((texto) => !temSimbolosProibidos(texto), SEM_SIMBOLOS),
})

export type DadosDeRenomear = z.infer<typeof schemaRenomear>
