import { z } from 'zod'

import { LIMITES_PRODUTO } from '@/features/produtos-cadastro'
import type { OrigemDoClique, ParametrosLoja } from './types'

// Tudo que vem da URL é entrada não confiável (skill `seguranca` §8.1): cada campo é validado e,
// se estiver fora do esperado, vira "sem filtro" em vez de erro. Nunca lança exceção.

const PAGINA_MAXIMA = 1000
const BUSCA_TAMANHO_MAXIMO = 100

/**
 * Categoria ou ambiente da URL: o nome da opção (ex.: "Área gourmet"). Fora do tamanho vira "sem
 * filtro". O banco compara por igualdade (consulta parametrizada), então nome que não existe só
 * dá zero resultados.
 */
const textoDoFiltro = z
  .string()
  .transform((valor) => valor.trim() || undefined)
  .pipe(z.string().max(LIMITES_PRODUTO.opcaoNomeMax).optional())
  .optional()
  .catch(undefined)

const schemaLoja = z.object({
  q: z
    .string()
    .transform((valor) => valor.trim().slice(0, BUSCA_TAMANHO_MAXIMO) || undefined)
    .optional()
    .catch(undefined),
  categoria: textoDoFiltro,
  ambiente: textoDoFiltro,
  pagina: z.coerce.number().int().min(1).max(PAGINA_MAXIMA).catch(1),
})

type ParametrosBrutos = Record<string, string | string[] | undefined>

/** Lê os `searchParams` do Next e devolve o estado da Loja, sempre válido. */
export function lerParametrosLoja(brutos: ParametrosBrutos): ParametrosLoja {
  const primeiros = Object.fromEntries(
    Object.entries(brutos).map(([nome, valor]) => [nome, Array.isArray(valor) ? valor[0] : valor]),
  )
  return schemaLoja.parse(primeiros)
}

const schemaClique = z.object({
  id: z.uuid(),
  de: z.union([z.literal('loja'), z.uuid()]),
})

/** Lê o pedido de `/ir/produto/<id>?de=...`. `null` se algo não confere. */
export function lerPedidoDeOferta(
  id: unknown,
  de: unknown,
): { produtoId: string; origem: OrigemDoClique } | null {
  const lido = schemaClique.safeParse({ id, de })
  if (!lido.success) return null
  const { id: produtoId, de: origem } = lido.data
  return {
    produtoId: produtoId.toLowerCase(),
    origem:
      origem === 'loja'
        ? { pagina: 'loja' }
        : { pagina: 'projeto', projetoId: origem.toLowerCase() },
  }
}
