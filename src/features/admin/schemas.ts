import { z } from 'zod'

import { estilosArquitetonicos, tiposDeProjeto } from '@/features/projetos'

import { diferenciaisDeProjeto, gerarSlug, lerPrecoEmCentavos, selosDeProjeto } from './rules'
import type { DadosCadastroProjeto } from './types'

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

// ── Cadastro do projeto (etapas 1 e 2) ─────────────────────────────────────────────────────────────
// O formulário envia tudo como texto; aqui cada campo vira o tipo certo ou uma mensagem de erro.

const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Texto livre: sem espaços nas pontas; em branco vira `undefined`. */
const textoOpcional = (maximo: number) =>
  z
    .string()
    .trim()
    .max(maximo, `Use no máximo ${maximo} caracteres.`)
    .transform((valor) => valor || undefined)

/** Uma das opções da lista, ou em branco (`undefined`). */
const escolhaOpcional = <const T extends readonly [string, ...string[]]>(valores: T) =>
  z.union([z.literal(''), z.enum(valores)]).transform((valor) => (valor === '' ? undefined : valor))

/** Número digitado (aceita vírgula); em branco vira `undefined`. */
const numeroOpcional = (minimo: number, maximo: number, inteiro = false) =>
  z.string().transform((texto, ctx) => {
    const limpo = texto.trim().replace(',', '.')
    if (limpo === '') return undefined
    const numero = Number(limpo)
    if (!Number.isFinite(numero) || (inteiro && !Number.isInteger(numero))) {
      ctx.addIssue({
        code: 'custom',
        message: inteiro ? 'Informe um número inteiro.' : 'Informe um número.',
      })
      return z.NEVER
    }
    if (numero < minimo || numero > maximo) {
      ctx.addIssue({ code: 'custom', message: `Use um valor entre ${minimo} e ${maximo}.` })
      return z.NEVER
    }
    return numero
  })

const valores = <T extends readonly { valor: string }[]>(lista: T) =>
  lista.map((item) => item.valor) as unknown as [T[number]['valor'], ...T[number]['valor'][]]

const urlHttps = z
  .string()
  .trim()
  .max(500, 'Use no máximo 500 caracteres.')
  .transform((valor) => valor || undefined)
  .refine((valor) => {
    if (!valor) return true
    try {
      return new URL(valor).protocol === 'https:'
    } catch {
      return false
    }
  }, 'Informe um link que comece com https://')

const schemaCadastroProjeto = z
  .object({
    titulo: z.string().trim().min(1, 'Informe o título.').max(200, 'Use no máximo 200 caracteres.'),
    slug: z.string().trim().toLowerCase().max(100, 'Use no máximo 100 caracteres.'),
    tipo: z.enum(valores(tiposDeProjeto), 'Escolha o tipo do projeto.'),
    estilo: escolhaOpcional(valores(estilosArquitetonicos)),
    selo: escolhaOpcional(valores(selosDeProjeto)),
    preco: z.string().transform((texto, ctx) => {
      const centavos = lerPrecoEmCentavos(texto)
      if (centavos === null) {
        ctx.addIssue({ code: 'custom', message: 'Informe um valor em reais, como 399,90.' })
        return z.NEVER
      }
      return centavos
    }),
    checkoutUrl: urlHttps,
    resumo: textoOpcional(300),
    descricao: textoOpcional(1500),
    larguraM: numeroOpcional(1, 100),
    profundidadeM: numeroOpcional(1, 100),
    areaConstruidaM2: numeroOpcional(1, 5000, true),
    quartos: numeroOpcional(0, 20, true),
    suites: numeroOpcional(0, 20, true),
    banheiros: numeroOpcional(0, 30, true),
    vagas: numeroOpcional(0, 20, true),
    pavimentos: numeroOpcional(1, 5, true),
    piscina: z.boolean(),
    closet: z.boolean(),
    areaGourmet: z.boolean(),
    diferencialTipo: escolhaOpcional(valores(diferenciaisDeProjeto)),
    diferencialRotulo: textoOpcional(80),
  })
  .transform((dados) => ({ ...dados, slug: dados.slug || gerarSlug(dados.titulo) }))
  .superRefine((dados, ctx) => {
    if (!SLUG_VALIDO.test(dados.slug)) {
      ctx.addIssue({
        code: 'custom',
        path: ['slug'],
        message: 'Use só letras minúsculas, números e hífens (ex.: casa-terrea-moderna).',
      })
    }
    if (dados.diferencialTipo && !dados.diferencialRotulo) {
      ctx.addIssue({
        code: 'custom',
        path: ['diferencialRotulo'],
        message: 'Escreva o texto do diferencial (ex.: Piscina opcional).',
      })
    }
  })

export type ResultadoLeituraCadastro =
  { ok: true; dados: DadosCadastroProjeto } | { ok: false; erros: Record<string, string> }

function texto(formulario: FormData, nome: string): string {
  const valor = formulario.get(nome)
  return typeof valor === 'string' ? valor : ''
}

/** Valida o formulário de cadastro. Nunca lança: devolve os dados prontos ou um erro por campo. */
export function lerCadastroProjeto(formulario: FormData): ResultadoLeituraCadastro {
  const lido = schemaCadastroProjeto.safeParse({
    titulo: texto(formulario, 'titulo'),
    slug: texto(formulario, 'slug'),
    tipo: texto(formulario, 'tipo'),
    estilo: texto(formulario, 'estilo'),
    selo: texto(formulario, 'selo'),
    preco: texto(formulario, 'preco'),
    checkoutUrl: texto(formulario, 'checkoutUrl'),
    resumo: texto(formulario, 'resumo'),
    descricao: texto(formulario, 'descricao'),
    larguraM: texto(formulario, 'larguraM'),
    profundidadeM: texto(formulario, 'profundidadeM'),
    areaConstruidaM2: texto(formulario, 'areaConstruidaM2'),
    quartos: texto(formulario, 'quartos'),
    suites: texto(formulario, 'suites'),
    banheiros: texto(formulario, 'banheiros'),
    vagas: texto(formulario, 'vagas'),
    pavimentos: texto(formulario, 'pavimentos'),
    piscina: formulario.get('piscina') === 'on',
    closet: formulario.get('closet') === 'on',
    areaGourmet: formulario.get('areaGourmet') === 'on',
    diferencialTipo: texto(formulario, 'diferencialTipo'),
    diferencialRotulo: texto(formulario, 'diferencialRotulo'),
  })
  if (lido.success) {
    const { preco, ...resto } = lido.data
    return { ok: true, dados: { ...resto, precoCentavos: preco } }
  }

  const erros: Record<string, string> = {}
  for (const problema of lido.error.issues) {
    const campo = String(problema.path[0] ?? 'formulario')
    erros[campo] ??= problema.message
  }
  return { ok: false, erros }
}

/** Id de um projeto vindo da URL ou de uma ação. */
export const schemaId = z.uuid()

/** Ids de uma ação em massa: uuids, sem repetição, de 1 a `SELECAO_MAXIMA`. */
export const schemaIds = z
  .array(z.uuid())
  .min(1)
  .max(SELECAO_MAXIMA)
  .transform((ids) => [...new Set(ids)])
