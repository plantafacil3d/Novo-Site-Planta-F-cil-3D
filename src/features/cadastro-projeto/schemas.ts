import { z } from 'zod'

import { LIMITES_PRODUTO } from '@/features/produtos-cadastro'

import {
  FAMILIA_CAPACIDADE,
  PROVA_SOCIAL,
  camposDeCaracteristicas,
  categoriasDoCadastro,
  estilosDoCadastro,
  etapasDaObra,
  iconesDeComplementar,
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

/** "Código do projeto" já preenchido (a busca das variações automáticas exige um código válido). */
export const schemaCodigoDoProjeto = z.string().trim().toUpperCase().regex(CODIGO_YOUTUBE_REGEX)

/** Texto da busca de projetos na aba "Variações". */
export const schemaBuscaDeVariacoes = z
  .string()
  .trim()
  .min(LIMITES.buscaDeVariacoesMin)
  .max(LIMITES.buscaDeVariacoesTextoMax)

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
})

// ── 2.1 Planta humanizada (opcional: 0 pavimentos é válido) ───────────────────────────────────────

const schemaItemDaPlanta = z.object({
  nome: textoObrigatorio(LIMITES.itemDaPlantaNomeMax, 'Dê um nome ao item.'),
  metragem: z
    .string()
    .trim()
    .refine(
      (texto) => texto === '' || /^\d{1,4}(,\d{1,2})?$/.test(texto),
      'Use um número, como 24,36.',
    ),
  numeroBolinha: z
    .string()
    .trim()
    .refine((texto) => {
      if (texto === '') return true
      const numero = Number(texto)
      return /^\d{1,3}$/.test(texto) && numero >= 1 && numero <= LIMITES.numeroBolinhaMax
    }, `Use um número entre 1 e ${LIMITES.numeroBolinhaMax}.`),
})

const schemaPavimento = z.object({
  // Pode ficar vazio: sem nome customizado, a tela mostra o padrão pela posição.
  nome: z
    .string()
    .trim()
    .max(LIMITES.pavimentoNomeMax, maximo(LIMITES.pavimentoNomeMax))
    .refine(semSimbolos, SEM_SIMBOLOS),
  imagem: z
    .object(dadosDoArquivo)
    .nullable()
    .superRefine((imagem, ctx) => {
      const erro = imagem ? primeiroErroDeImagem([imagem]) : 'Envie a imagem deste pavimento.'
      if (erro) ctx.addIssue({ code: 'custom', message: erro })
    }),
  itens: z
    .array(schemaItemDaPlanta)
    .max(LIMITES.itensDaPlantaMax, `Use no máximo ${LIMITES.itensDaPlantaMax} itens.`),
})

const schemaPlantaHumanizada = z.object({
  plantaHumanizada: z
    .array(schemaPavimento)
    .max(LIMITES.pavimentosMax, `Use no máximo ${LIMITES.pavimentosMax} pavimentos.`),
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

// ── 6.1 Variações do projeto ─────────────────────────────────────────────────────────────────────

const MENSAGEM_VARIACOES_MAX = `Ligue no máximo ${LIMITES.variacoesMax} projetos à mão.`

const schemaVariacoes = z.object({
  variacoesManuais: z.array(z.unknown()).max(LIMITES.variacoesMax, MENSAGEM_VARIACOES_MAX),
})

// ── 6.2 Produtos ─────────────────────────────────────────────────────────────────────────────────

const MENSAGEM_PRODUTOS_MAX = `Ligue no máximo ${LIMITES_PRODUTO.porProjetoMax} produtos ao projeto.`

const schemaDecoracao = z.object({
  produtosLigados: z.array(z.unknown()).max(LIMITES_PRODUTO.porProjetoMax, MENSAGEM_PRODUTOS_MAX),
})

// ── 5.1 Prévias do projeto (opcional: 0 fotos é válido; cada foto enviada confere como a galeria) ──

const schemaPrevias = z.object({
  imagensPrevia: z.array(z.object(dadosDoArquivo)).superRefine((imagens, ctx) => {
    const erro = primeiroErroDeImagem(imagens)
    if (erro) ctx.addIssue({ code: 'custom', message: erro })
  }),
})

// ── 5.2 Marketing (opcional: sem prints e sem comentários é válido) ──────────────────────────────

const notaDoComentario = z
  .number('Escolha de 1 a 5 estrelas.')
  .int('Escolha de 1 a 5 estrelas.')
  .min(1, 'Escolha de 1 a 5 estrelas.')
  .max(5, 'Escolha de 1 a 5 estrelas.')

const schemaComentario = z.object({
  nota: notaDoComentario,
  texto: textoObrigatorio(LIMITES.comentarioTextoMax, 'Escreva o comentário.'),
  nome: textoObrigatorio(LIMITES.comentarioNomeMax, 'Informe o nome.'),
  cidade: textoObrigatorio(LIMITES.comentarioCidadeMax, 'Informe a cidade e o estado.'),
})

/** Legenda de uma foto de obra: os dois campos são opcionais. Vale na aba e no servidor. */
const schemaLegendaDaObra = z.object({
  etapa: escolhaOpcional(etapasDaObra),
  cidade: z
    .string()
    .trim()
    .max(LIMITES.obraCidadeMax, maximo(LIMITES.obraCidadeMax))
    .refine(semSimbolos, SEM_SIMBOLOS),
})

const MENSAGEM_OBRAS_MAX = `Use no máximo ${LIMITES.obrasMax} fotos.`

/** Uma legenda por foto, pelo id dela; o teto só impede um pedido absurdo. */
const legendasDaObra = z
  .record(z.string().max(60), schemaLegendaDaObra)
  .refine((legendas) => Object.keys(legendas).length <= 50, 'Legendas demais.')

/** Faixa de prova social: os dois campos são opcionais; a nota tem no máximo uma casa decimal e só
 *  vale com a quantidade de clientes. Vale na aba e no servidor. */
const camposDaProvaSocial = {
  provaSocialClientes: campoNumerico({ decimal: false, ...PROVA_SOCIAL.clientes }, false),
  provaSocialNota: campoNumerico({ decimal: true, ...PROVA_SOCIAL.nota }, false).refine(
    (texto) => !/[.,]\d{2,}/.test(texto),
    'Use só uma casa decimal (ex.: 4,9).',
  ),
}

const conferirProvaSocial = (
  dados: { provaSocialClientes: string; provaSocialNota: string },
  ctx: z.RefinementCtx,
) => {
  if (dados.provaSocialNota.trim() !== '' && dados.provaSocialClientes.trim() === '') {
    ctx.addIssue({
      code: 'custom',
      path: ['provaSocialClientes'],
      message: 'Informe a quantidade de clientes.',
    })
  }
}

const schemaMarketing = z
  .object({
    imagensDepoimento: z.array(z.object(dadosDoArquivo)).superRefine((imagens, ctx) => {
      const erro = primeiroErroDeImagem(imagens)
      if (erro) ctx.addIssue({ code: 'custom', message: erro })
    }),
    comentariosClientes: z
      .array(schemaComentario)
      .max(LIMITES.comentariosMax, `Use no máximo ${LIMITES.comentariosMax} comentários.`),
    imagensObra: z
      .array(z.object(dadosDoArquivo))
      .max(LIMITES.obrasMax, MENSAGEM_OBRAS_MAX)
      .superRefine((imagens, ctx) => {
        const erro = primeiroErroDeImagem(imagens)
        if (erro) ctx.addIssue({ code: 'custom', message: erro })
      }),
    legendasObra: legendasDaObra,
    ...camposDaProvaSocial,
  })
  .superRefine(conferirProvaSocial)

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
    checkoutUrl: linkHttpsOpcional,
    icone: escolhaOpcional(iconesDeComplementar),
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

/** Primeira mensagem de cada campo; a chave é o caminho (`plantaHumanizada.0.imagem`). */
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
  plantaHumanizada: schemaPlantaHumanizada,
  caracteristicas: schemaCaracteristicas,
  itens: schemaItens,
  exemplos: schemaExemplos,
  previas: schemaPrevias,
  marketing: schemaMarketing,
  complementares: schemaComplementares,
  variacoes: schemaVariacoes,
  decoracao: schemaDecoracao,
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
    // Sem limite na prática; o teto só impede um pedido absurdo (a tela não impõe nenhum).
    imagensPrevia: z.array(arquivoDoPayload).max(200),
    imagensDepoimento: z.array(arquivoDoPayload).max(200),
    // No rascunho um comentário pode estar pela metade; a página pública só mostra os completos.
    comentariosClientes: z
      .array(
        z.object({
          id: z.string().max(60),
          nota: notaDoComentario,
          texto: textoLivre(LIMITES.comentarioTextoMax),
          nome: textoLivre(LIMITES.comentarioNomeMax),
          cidade: textoLivre(LIMITES.comentarioCidadeMax),
        }),
      )
      .max(LIMITES.comentariosMax, `Use no máximo ${LIMITES.comentariosMax} comentários.`),
    imagensObra: z.array(arquivoDoPayload).max(LIMITES.obrasMax, MENSAGEM_OBRAS_MAX),
    legendasObra: legendasDaObra,
    ...camposDaProvaSocial,
    plantaHumanizada: z
      .array(
        z.object({
          id: z.uuid(),
          nome: textoLivre(LIMITES.pavimentoNomeMax),
          imagem: arquivoDoPayload.nullable(),
          itens: z
            .array(
              z.object({
                id: z.uuid(),
                nome: textoLivre(LIMITES.itemDaPlantaNomeMax),
                metragem: z.string().trim().max(10),
                numeroBolinha: z.string().trim().max(3),
              }),
            )
            .max(LIMITES.itensDaPlantaMax),
        }),
      )
      .max(LIMITES.pavimentosMax),
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
        checkoutUrl: linkHttpsOpcional,
        icone: escolhaOpcional(iconesDeComplementar),
        pdf: arquivoDoPayload.nullable(),
      }),
    ),
    // Ids sem repetição. Ligar o projeto a ele mesmo é barrado na ação (que sabe o id) e no banco.
    variacoesManuais: z
      .array(z.uuid())
      .max(LIMITES.variacoesMax, MENSAGEM_VARIACOES_MAX)
      .refine((ids) => new Set(ids).size === ids.length, 'Há um projeto repetido nas variações.'),
    // Ids sem repetição, na ordem da seção "Decore como no projeto".
    produtosLigados: z
      .array(z.uuid())
      .max(LIMITES_PRODUTO.porProjetoMax, MENSAGEM_PRODUTOS_MAX)
      .refine((ids) => new Set(ids).size === ids.length, 'Há um produto repetido na aba Produtos.'),
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
