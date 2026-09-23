import { z } from 'zod'

import {
  FAMILIA_CAPACIDADE,
  camposDeCaracteristicas,
  categoriasDoCadastro,
  estilosDoCadastro,
  etapasDoCadastro,
  perfisDeTerrenoDoCadastro,
} from './catalogo'
import {
  ARQUIVOS_DE_ENTREGA,
  ARQUIVOS_DE_PDF,
  LIMITES,
  ehLinkDeVideo,
  ehLinkHttps,
  erroDeAnexo,
  erroDeImagem,
  formatarTamanho,
  lerNumero,
  lerPrecoEmCentavos,
  somarTamanhos,
  temSimbolosProibidos,
} from './rules'
import type { DadosValidaveis, ErrosDaEtapa, EtapaId, PayloadProjeto } from './types'

// A conferência do formulário mora aqui, uma vez só. Roda no navegador para dar retorno rápido e
// de novo no servidor antes de gravar (`actions.ts`): o navegador nunca é fronteira de segurança
// (skill `seguranca` §1). Cada schema devolve uma mensagem por campo, em português.

const SEM_SIMBOLOS = 'Não use os símbolos < e >.'
const semSimbolos = (texto: string) => !temSimbolosProibidos(texto)
const maximo = (limite: number) => `Use no máximo ${limite} caracteres.`
const MENSAGEM_HTTPS = 'Use um link que comece com https://'

/** Texto de uma linha: sem espaços nas pontas, com limite e sem `<` e `>`. */
const textoObrigatorio = (limite: number, vazio: string) =>
  z.string().trim().min(1, vazio).max(limite, maximo(limite)).refine(semSimbolos, SEM_SIMBOLOS)

/** Um valor da lista, ou vazio (campo opcional). */
const escolhaOpcional = (lista: readonly { valor: string }[]) => {
  const validos = new Set(lista.map((item) => item.valor))
  return z
    .string()
    .refine((valor) => valor === '' || validos.has(valor), 'Escolha uma opção da lista.')
}

/** Número digitado na faixa do campo. `obrigatorio: false` aceita vazio (rascunho). */
const campoNumerico = (campo: { decimal: boolean; min: number; max: number }, obrigatorio = true) =>
  z
    .string()
    .trim()
    .superRefine((texto, ctx) => {
      if (texto === '') {
        if (obrigatorio) ctx.addIssue({ code: 'custom', message: 'Preencha este campo.' })
        return
      }
      const numero = lerNumero(texto)
      if (numero === null) {
        ctx.addIssue({ code: 'custom', message: 'Informe um número válido.' })
      } else if (!campo.decimal && !Number.isInteger(numero)) {
        ctx.addIssue({ code: 'custom', message: 'Use um número inteiro.' })
      } else if (numero < campo.min || numero > campo.max) {
        ctx.addIssue({
          code: 'custom',
          message: `Use um valor entre ${campo.min} e ${campo.max}.`,
        })
      }
    })

/** "Família indicada" (aba 1): capacidade de pessoas, opcional. */
const campoFamiliaCapacidade = { decimal: false, ...FAMILIA_CAPACIDADE }

/** Preço em reais digitado; maior que zero. */
const precoObrigatorio = z
  .string()
  .trim()
  .superRefine((texto, ctx) => {
    if (texto === '') {
      ctx.addIssue({ code: 'custom', message: 'Informe o preço.' })
      return
    }
    const centavos = lerPrecoEmCentavos(texto)
    if (centavos === null) {
      ctx.addIssue({ code: 'custom', message: 'Informe um valor em reais, como 399,90.' })
    } else if (centavos <= 0) {
      ctx.addIssue({ code: 'custom', message: 'O preço precisa ser maior que zero.' })
    }
  })

const precoOpcional = z
  .string()
  .trim()
  .superRefine((texto, ctx) => {
    if (texto === '') return
    const centavos = lerPrecoEmCentavos(texto)
    if (centavos === null) {
      ctx.addIssue({ code: 'custom', message: 'Informe um valor em reais, como 299,90.' })
    } else if (centavos <= 0) {
      ctx.addIssue({ code: 'custom', message: 'O preço precisa ser maior que zero.' })
    }
  })

const linkOpcional = z.string().trim().max(LIMITES.linkMax, maximo(LIMITES.linkMax))

const linkHttpsOpcional = linkOpcional.refine(
  (link) => link === '' || ehLinkHttps(link),
  MENSAGEM_HTTPS,
)

const CODIGO_YOUTUBE_REGEX = new RegExp(`^[A-Z0-9-]{1,${LIMITES.codigoYoutubeMax}}$`)

/** Código manual do projeto (liga ao vídeo do YouTube): vazio ou até o limite, sempre maiúsculo. */
const codigoYoutubeOpcional = z
  .string()
  .trim()
  .transform((texto) => texto.toUpperCase())
  .refine(
    (texto) => texto === '' || CODIGO_YOUTUBE_REGEX.test(texto),
    `Use letras, números e hífen, até ${LIMITES.codigoYoutubeMax} caracteres.`,
  )

/** Metadados de um arquivo. Um `File` do navegador já se encaixa aqui. */
const dadosDoArquivo = { nomeArquivo: z.string(), tamanho: z.number(), tipo: z.string() }

// ── 1. Informações Gerais ────────────────────────────────────────────────────────────────────────

const schemaTitulo = z.object({
  titulo: textoObrigatorio(LIMITES.tituloMax, 'Informe o título do projeto.'),
})

const schemaInformacoes = schemaTitulo
  .extend({
    codigoYoutube: codigoYoutubeOpcional,
    precoNormal: precoObrigatorio,
    precoPromocional: precoOpcional,
    categoria: escolhaOpcional(categoriasDoCadastro),
    estilo: escolhaOpcional(estilosDoCadastro),
    resumo: z
      .string()
      .trim()
      .min(LIMITES.resumoMin, `Escreva pelo menos ${LIMITES.resumoMin} caracteres.`)
      .max(LIMITES.resumoMax, maximo(LIMITES.resumoMax))
      .refine(semSimbolos, SEM_SIMBOLOS),
    descricao: z
      .string()
      .trim()
      .max(LIMITES.descricaoMax, maximo(LIMITES.descricaoMax))
      .refine(semSimbolos, SEM_SIMBOLOS),
    ambientes: z
      .string()
      .trim()
      .max(LIMITES.ambientesMax, maximo(LIMITES.ambientesMax))
      .refine(semSimbolos, SEM_SIMBOLOS),
    indicadoPara: z
      .string()
      .trim()
      .max(LIMITES.indicadoParaMax, maximo(LIMITES.indicadoParaMax))
      .refine(semSimbolos, SEM_SIMBOLOS),
    aplicacoes: z
      .string()
      .trim()
      .max(LIMITES.aplicacoesMax, maximo(LIMITES.aplicacoesMax))
      .refine(semSimbolos, SEM_SIMBOLOS),
    perfilTerreno: escolhaOpcional(perfisDeTerrenoDoCadastro),
    familiaCapacidade: campoNumerico(campoFamiliaCapacidade, false),
    tags: z
      .array(textoObrigatorio(LIMITES.tagTamanhoMax, 'Tag vazia.'))
      .max(LIMITES.tagsMax, `Use no máximo ${LIMITES.tagsMax} tags.`),
    videoUrl: linkOpcional.refine(
      (link) => link === '' || ehLinkDeVideo(link),
      'Use um link do YouTube ou do Vimeo, começando com https://',
    ),
    checkoutUrl: linkHttpsOpcional,
  })
  .superRefine((dados, ctx) => {
    const normal = lerPrecoEmCentavos(dados.precoNormal)
    const promocional = lerPrecoEmCentavos(dados.precoPromocional)
    if (normal !== null && promocional !== null && promocional >= normal) {
      ctx.addIssue({
        code: 'custom',
        path: ['precoPromocional'],
        message: 'O preço promocional precisa ser menor que o preço normal.',
      })
    }
  })

// ── 2. Imagens ───────────────────────────────────────────────────────────────────────────────────

/** Primeira imagem da lista com problema, no formato "arquivo.png: motivo". */
function primeiroErroDeImagem(imagens: readonly z.infer<z.ZodObject<typeof dadosDoArquivo>>[]) {
  for (const imagem of imagens) {
    const erro = erroDeImagem(imagem)
    if (erro) return `${imagem.nomeArquivo}: ${erro}`
  }
  return null
}

const schemaImagens = z.object({
  imagemPrincipal: z
    .object(dadosDoArquivo)
    .nullable()
    .superRefine((imagem, ctx) => {
      const erro = imagem ? primeiroErroDeImagem([imagem]) : 'Envie a imagem principal.'
      if (erro) ctx.addIssue({ code: 'custom', message: erro })
    }),
  imagens: z
    .array(z.object(dadosDoArquivo))
    .min(1, 'Envie pelo menos uma imagem do projeto.')
    .superRefine((imagens, ctx) => {
      const erro = primeiroErroDeImagem(imagens)
      if (erro) ctx.addIssue({ code: 'custom', message: erro })
    }),
  plantas: z
    .array(
      z.object({
        ...dadosDoArquivo,
        nome: textoObrigatorio(LIMITES.plantaNomeMax, 'Dê um nome à planta (ex.: Térreo).'),
      }),
    )
    .min(1, 'Envie pelo menos uma planta.')
    .superRefine((plantas, ctx) => {
      const erro = primeiroErroDeImagem(plantas)
      if (erro) ctx.addIssue({ code: 'custom', message: erro })
    }),
})

// ── 3. Características ───────────────────────────────────────────────────────────────────────────

const simOuNao = z.enum(['sim', 'nao'], 'Escolha Sim ou Não.')

const schemaCaracteristicas = z.object({
  ...Object.fromEntries(
    camposDeCaracteristicas.map((campo) => [campo.chave, campoNumerico(campo)]),
  ),
  piscina: simOuNao,
  areaGourmet: simOuNao,
})

// ── 4. Itens incluídos ───────────────────────────────────────────────────────────────────────────

const schemaItens = z.object({
  itens: z
    .array(textoObrigatorio(LIMITES.itemMax, 'Item vazio.'))
    .min(1, 'Adicione pelo menos um item.')
    .max(LIMITES.itensMax, `Use no máximo ${LIMITES.itensMax} itens.`)
    .refine(
      (itens) => new Set(itens.map((item) => item.toLowerCase())).size === itens.length,
      'Há itens repetidos na lista.',
    ),
})

// ── 5. Arquivos de exemplo (opcional, sem regra: só escolher os que já existem) ──────────────────

const schemaExemplos = z.object({ arquivosExemplo: z.array(z.string()) })

// ── 6. Complementares ────────────────────────────────────────────────────────────────────────────

const schemaComplementar = z
  .object({
    titulo: textoObrigatorio(LIMITES.complementarTituloMax, 'Informe o título.'),
    valor: precoObrigatorio,
    descricao: z
      .string()
      .trim()
      .min(
        LIMITES.complementarDescricaoMin,
        `Escreva pelo menos ${LIMITES.complementarDescricaoMin} caracteres.`,
      )
      .max(LIMITES.complementarDescricaoMax, maximo(LIMITES.complementarDescricaoMax))
      .refine(semSimbolos, SEM_SIMBOLOS),
    entrega: z.enum(['link', 'pdf'], 'Escolha como o cliente recebe.'),
    link: linkOpcional,
    pdf: z.object(dadosDoArquivo).nullable(),
  })
  .superRefine((complementar, ctx) => {
    if (complementar.entrega === 'link') {
      if (complementar.link === '') {
        ctx.addIssue({ code: 'custom', path: ['link'], message: 'Informe o link.' })
      } else if (!ehLinkHttps(complementar.link)) {
        ctx.addIssue({ code: 'custom', path: ['link'], message: MENSAGEM_HTTPS })
      }
    }
    if (complementar.entrega === 'pdf') {
      const erro = complementar.pdf
        ? erroDeAnexo(complementar.pdf, ARQUIVOS_DE_PDF.extensoes)
        : 'Envie o arquivo PDF.'
      if (erro) ctx.addIssue({ code: 'custom', path: ['pdf'], message: erro })
    }
  })

const schemaComplementares = z.object({ complementares: z.array(schemaComplementar) })

// ── 7. Entrega do projeto ────────────────────────────────────────────────────────────────────────

const schemaEntrega = z
  .object({
    entregaArquivos: z.array(z.object(dadosDoArquivo)),
    entregaLink: linkOpcional,
  })
  .superRefine((dados, ctx) => {
    if (dados.entregaLink !== '' && !ehLinkHttps(dados.entregaLink)) {
      ctx.addIssue({ code: 'custom', path: ['entregaLink'], message: MENSAGEM_HTTPS })
    }

    const problema = dados.entregaArquivos.find((arquivo) =>
      erroDeAnexo(arquivo, ARQUIVOS_DE_ENTREGA.extensoes),
    )
    const total = somarTamanhos(dados.entregaArquivos)
    let mensagem: string | null = null
    if (problema) {
      mensagem = `${problema.nomeArquivo}: ${erroDeAnexo(problema, ARQUIVOS_DE_ENTREGA.extensoes)}`
    } else if (total > LIMITES.anexoMaxBytes) {
      mensagem = `Os arquivos somam ${formatarTamanho(total)}. O limite é 20 MB no total.`
    } else if (dados.entregaArquivos.length === 0 && dados.entregaLink === '') {
      mensagem = 'Envie um arquivo ou informe um link externo (pode ser os dois).'
    }
    if (mensagem) ctx.addIssue({ code: 'custom', path: ['entregaArquivos'], message: mensagem })
  })

// ── Leitura dos resultados ───────────────────────────────────────────────────────────────────────

/** Primeira mensagem de cada campo; a chave é o caminho (`plantas.0.nome`). */
function coletarErros(resultado: ReturnType<z.ZodType['safeParse']>): ErrosDaEtapa {
  if (resultado.success) return {}
  const erros: ErrosDaEtapa = {}
  for (const problema of resultado.error.issues) {
    erros[problema.path.map(String).join('.')] ??= problema.message
  }
  return erros
}

const schemasPorEtapa: Record<EtapaId, z.ZodType> = {
  informacoes: schemaInformacoes,
  imagens: schemaImagens,
  caracteristicas: schemaCaracteristicas,
  itens: schemaItens,
  exemplos: schemaExemplos,
  complementares: schemaComplementares,
  entrega: schemaEntrega,
}

/** Erros de cada aba. Aba sem erros = objeto vazio. Nunca lança. */
export function validarEtapas(dados: DadosValidaveis): Record<EtapaId, ErrosDaEtapa> {
  const resultado = {} as Record<EtapaId, ErrosDaEtapa>
  for (const { id } of etapasDoCadastro) {
    resultado[id] = coletarErros(schemasPorEtapa[id].safeParse(dados))
  }
  return resultado
}

/** "Salvar rascunho" exige só o título. */
export function validarRascunho(dados: Pick<DadosValidaveis, 'titulo'>): ErrosDaEtapa {
  return coletarErros(schemaTitulo.safeParse(dados))
}

// ── O que chega ao servidor ──────────────────────────────────────────────────────────────────────

// Uma ação do servidor é um endpoint público: o corpo chega como `unknown` e é conferido inteiro
// antes de qualquer gravação. Aqui só vale formato e limite; o que é obrigatório para publicar
// continua nos schemas das abas (`validarEtapas`), que rodam por cima quando o modo é "completo".

const arquivoDoPayload = z.object({
  id: z.uuid(),
  nomeArquivo: z.string().min(1).max(255),
  tamanho: z.number().int().min(0),
  tipo: z.string().max(100),
  salvo: z.boolean(),
})

const textoLivre = (limite: number) =>
  z.string().trim().max(limite, maximo(limite)).refine(semSimbolos, SEM_SIMBOLOS)

const schemaPayload = z
  .object({
    titulo: textoObrigatorio(LIMITES.tituloMax, 'Informe o título do projeto.'),
    codigoYoutube: codigoYoutubeOpcional,
    precoNormal: precoOpcional,
    precoPromocional: precoOpcional,
    categoria: escolhaOpcional(categoriasDoCadastro),
    estilo: escolhaOpcional(estilosDoCadastro),
    resumo: textoLivre(LIMITES.resumoMax),
    descricao: textoLivre(LIMITES.descricaoMax),
    ambientes: textoLivre(LIMITES.ambientesMax),
    indicadoPara: textoLivre(LIMITES.indicadoParaMax),
    aplicacoes: textoLivre(LIMITES.aplicacoesMax),
    perfilTerreno: escolhaOpcional(perfisDeTerrenoDoCadastro),
    familiaCapacidade: campoNumerico(campoFamiliaCapacidade, false),
    tags: z
      .array(textoObrigatorio(LIMITES.tagTamanhoMax, 'Tag vazia.'))
      .max(LIMITES.tagsMax, `Use no máximo ${LIMITES.tagsMax} tags.`),
    videoUrl: linkOpcional.refine(
      (link) => link === '' || ehLinkDeVideo(link),
      'Use um link do YouTube ou do Vimeo, começando com https://',
    ),
    checkoutUrl: linkHttpsOpcional,
    imagemPrincipal: arquivoDoPayload.nullable(),
    imagens: z.array(arquivoDoPayload),
    plantas: z.array(arquivoDoPayload.extend({ nome: textoLivre(LIMITES.plantaNomeMax) })),
    ...Object.fromEntries(
      camposDeCaracteristicas.map((campo) => [campo.chave, campoNumerico(campo, false)]),
    ),
    piscina: z.enum(['', 'sim', 'nao'], 'Escolha Sim ou Não.'),
    areaGourmet: z.enum(['', 'sim', 'nao'], 'Escolha Sim ou Não.'),
    itens: z
      .array(textoObrigatorio(LIMITES.itemMax, 'Item vazio.'))
      .max(LIMITES.itensMax, `Use no máximo ${LIMITES.itensMax} itens.`),
    arquivosExemplo: z.array(z.uuid()).max(200),
    complementares: z.array(
      z.object({
        id: z.uuid(),
        titulo: textoLivre(LIMITES.complementarTituloMax),
        valor: precoOpcional,
        descricao: textoLivre(LIMITES.complementarDescricaoMax),
        entrega: z.enum(['', 'link', 'pdf'], 'Escolha como o cliente recebe.'),
        link: linkHttpsOpcional,
        pdf: arquivoDoPayload.nullable(),
      }),
    ),
    entregaArquivos: z.array(arquivoDoPayload),
    entregaLink: linkHttpsOpcional,
  })
  .superRefine((dados, ctx) => {
    const normal = lerPrecoEmCentavos(dados.precoNormal)
    const promocional = lerPrecoEmCentavos(dados.precoPromocional)
    if (normal !== null && promocional !== null && promocional >= normal) {
      ctx.addIssue({
        code: 'custom',
        path: ['precoPromocional'],
        message: 'O preço promocional precisa ser menor que o preço normal.',
      })
    }
  })

/** Confere o que chegou ao servidor. Devolve os dados tipados ou a primeira mensagem de erro. */
export function lerPayload(
  entrada: unknown,
): { ok: true; dados: PayloadProjeto } | { ok: false; mensagem: string } {
  const resultado = schemaPayload.safeParse(entrada)
  if (resultado.success) return { ok: true, dados: resultado.data as PayloadProjeto }
  return {
    ok: false,
    mensagem: resultado.error.issues[0]?.message ?? 'Os dados enviados são inválidos.',
  }
}
