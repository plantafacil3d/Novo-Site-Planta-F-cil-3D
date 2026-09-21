import { z } from 'zod'

// Tudo que vem da URL ou de formulário é entrada não confiável (skill `seguranca` §8.1).

const PAGINA_MAXIMA = 1000
const BUSCA_TAMANHO_MAXIMO = 100
/** Uma página tem 20 linhas; o teto folgado só impede listas gigantes numa ação em massa. */
export const SELECAO_MAXIMA = 50

const schemaParametros = z.object({
  q: z
    .string()
    .transform((valor) => valor.trim().slice(0, BUSCA_TAMANHO_MAXIMO) || undefined)
    .optional()
    .catch(undefined),
  pagina: z.coerce.number().int().min(1).max(PAGINA_MAXIMA).catch(1),
})

/** Lê os `searchParams` do Next e devolve o estado da listagem, sempre válido (nunca lança). */
export function lerParametrosAdminProjetos(brutos: Record<string, string | string[] | undefined>) {
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
