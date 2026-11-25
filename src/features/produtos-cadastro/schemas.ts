import { z } from 'zod'

import { origensDeProduto, tiposDeOpcao } from './catalogo'
import { LIMITES_PRODUTO, ehCaminhoDeFoto, normalizarLink } from './rules'
import type { ParametrosAdminProdutos } from './types'

// Tudo que vem do navegador é entrada não confiável (skill `seguranca` §8 e §9.1). Server Actions
// conferem com estes schemas; o formulário usa os mesmos para mostrar o erro no campo.

const valoresDe = <T extends string>(lista: readonly { valor: T }[]) =>
  lista.map((item) => item.valor) as [T, ...T[]]

/** Nome de uma categoria ou ambiente (o banco confere as mesmas regras). */
export const schemaNomeDaOpcao = z
  .string()
  .transform((texto) => texto.trim().replace(/\s+/g, ' '))
  .pipe(
    z
      .string()
      .min(1, 'Digite um nome.')
      .max(
        LIMITES_PRODUTO.opcaoNomeMax,
        `Use no máximo ${LIMITES_PRODUTO.opcaoNomeMax} caracteres.`,
      )
      .refine((texto) => !/[<>]/.test(texto), 'Não use os símbolos < e >.'),
  )

/** Nova categoria ou novo ambiente. */
export const schemaNovaOpcao = z.object({
  tipo: z.enum(valoresDe(tiposDeOpcao)),
  nome: schemaNomeDaOpcao,
})

/** Link http(s) de verdade (bloqueia `javascript:` e afins), até o limite de tamanho. */
export const schemaLink = z
  .string()
  .transform(normalizarLink)
  .pipe(
    z
      .string()
      .min(1, 'Cole o link do produto.')
      .max(LIMITES_PRODUTO.linkMax, 'Link longo demais.')
      .refine((texto) => {
        if (/\s/.test(texto)) return false
        try {
          const url = new URL(texto)
          return url.protocol === 'https:' || url.protocol === 'http:'
        } catch {
          return false
        }
      }, 'Use um link completo, começando com https://'),
  )

/** Campos do produto (sem a foto e sem os projetos). */
export const schemaCamposDoProduto = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Dê um nome ao produto.')
    .max(LIMITES_PRODUTO.nomeMax, `Use no máximo ${LIMITES_PRODUTO.nomeMax} caracteres.`)
    .refine((texto) => !/[<>]/.test(texto), 'Não use os símbolos < e >.'),
  link: schemaLink,
  // Nomes das opções cadastradas no painel; a ação confere se ainda existem.
  categoria: z
    .string('Escolha a categoria.')
    .trim()
    .min(1, 'Escolha a categoria.')
    .max(LIMITES_PRODUTO.opcaoNomeMax),
  // Opcional: o produto pode não ter ambiente nenhum.
  ambientes: z
    .array(z.string().trim().min(1).max(LIMITES_PRODUTO.opcaoNomeMax))
    .max(LIMITES_PRODUTO.ambientesPorProdutoMax, 'Marque no máximo 20 ambientes.')
    .transform((lista) => [...new Set(lista)]),
  origem: z.enum(valoresDe(origensDeProduto), 'Escolha a origem.'),
  ativo: z.boolean(),
  emTodosProjetos: z.boolean(),
})

const ids = (maximo: number) =>
  z
    .array(z.uuid())
    .max(maximo)
    .transform((lista) => [...new Set(lista.map((id) => id.toLowerCase()))])

/**
 * O que o formulário envia para salvar. `projetoIds` ausente = não mexer nas ligações (e é ignorado
 * com `emTodosProjetos`: o banco liga o produto a todos os projetos).
 */
export const schemaSalvarProduto = schemaCamposDoProduto.extend({
  id: z.uuid().nullable(),
  fotoCaminho: z.string().refine(ehCaminhoDeFoto, 'Escolha a foto do produto.'),
  projetoIds: ids(LIMITES_PRODUTO.projetosMax).optional(),
})

export type DadosParaSalvar = z.infer<typeof schemaSalvarProduto>

/** Metadados da foto escolhida, antes do envio. */
export const schemaFoto = z.object({
  nomeArquivo: z.string().min(1).max(255),
  tamanho: z.number().int().positive().max(LIMITES_PRODUTO.fotoBytesMax, 'A foto passou de 2 MB.'),
  tipo: z.enum(['image/webp', 'image/jpeg', 'image/png'], 'Use uma foto JPG, PNG ou WEBP.'),
})

/** Texto das buscas ao vivo (produtos e projetos). */
export const schemaBusca = z
  .string()
  .trim()
  .min(LIMITES_PRODUTO.buscaMin)
  .max(LIMITES_PRODUTO.buscaTextoMax)

/** Ids dos produtos de um projeto, na ordem da aba Produtos. */
export const schemaProdutosDoProjeto = ids(LIMITES_PRODUTO.porProjetoMax)

const schemaParametros = z.object({
  q: z
    .string()
    .transform((valor) => valor.trim().slice(0, LIMITES_PRODUTO.buscaTextoMax) || undefined)
    .optional()
    .catch(undefined),
  pagina: z.coerce.number().int().min(1).max(1000).catch(1),
})

/** Lê os `searchParams` da tabela do painel (nunca lança). */
export function lerParametrosAdminProdutos(
  brutos: Record<string, string | string[] | undefined>,
): ParametrosAdminProdutos {
  const primeiros = Object.fromEntries(
    Object.entries(brutos).map(([nome, valor]) => [nome, Array.isArray(valor) ? valor[0] : valor]),
  )
  return schemaParametros.parse(primeiros)
}
