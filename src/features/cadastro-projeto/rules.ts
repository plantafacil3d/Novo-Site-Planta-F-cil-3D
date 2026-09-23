import { extensaoDe, formatarTamanho } from '@/services/upload/arquivos'
import type { AcessoDoArquivo } from '@/types/envio'

import { etapasDoCadastro } from './catalogo'
import type {
  ArquivoCompletoDoBanco,
  ArquivoDoPayload,
  ArquivoEscolhido,
  CadastroCompletoDoBanco,
  CadastroGravavel,
  ComplementarGravavel,
  ComplementarProjeto,
  DadosProjeto,
  DadosValidaveis,
  EstadoParaPublicar,
  EtapaId,
  ErrosDaEtapa,
  ImagemProjeto,
  MetaArquivo,
  PapelDoArquivo,
  PayloadProjeto,
  SimNao,
  SituacaoDaEtapa,
} from './types'

const MB = 1024 * 1024

/** Limites do formulário. Cada um existe só aqui; telas e schemas leem daqui. */
export const LIMITES = {
  tituloMax: 120,
  codigoYoutubeMax: 30,
  resumoMin: 80,
  resumoMax: 500,
  descricaoMax: 4000,
  ambientesMax: 150,
  indicadoParaMax: 150,
  aplicacoesMax: 150,
  perfilTerrenoMax: 150,
  familiaIndicadaMax: 150,
  tagsMax: 10,
  tagTamanhoMax: 30,
  linkMax: 500,
  plantaNomeMax: 60,
  itemMax: 100,
  itensMax: 100,
  complementarTituloMax: 80,
  complementarDescricaoMin: 10,
  complementarDescricaoMax: 300,
  imagemMaxBytes: 2 * MB,
  /** Vale para cada PDF de complementar e para a soma dos arquivos de entrega do projeto. */
  anexoMaxBytes: 20 * MB,
  /** Quantos arquivos entram numa chamada de `prepararEnvioEmLote`/`confirmarEnvioEmLote`. */
  loteDeArquivosMax: 12,
} as const

/** Tipos aceitos por extensão. Navegadores nem sempre informam o MIME de ZIP e RAR: vazio também passa. */
const TIPOS_POR_EXTENSAO: Record<string, readonly string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  pdf: ['application/pdf'],
  zip: ['application/zip', 'application/x-zip-compressed', 'application/x-zip'],
  rar: ['application/vnd.rar', 'application/x-rar-compressed', 'application/x-rar'],
}

export const ARQUIVOS_DE_IMAGEM = {
  extensoes: ['jpg', 'jpeg', 'png', 'webp'],
  accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
} as const

export const ARQUIVOS_DE_PDF = { extensoes: ['pdf'], accept: '.pdf,application/pdf' } as const

export const ARQUIVOS_DE_ENTREGA = {
  extensoes: ['pdf', 'zip', 'rar'],
  accept: '.pdf,.zip,.rar,application/pdf,application/zip,application/vnd.rar',
} as const

type MetadadosDeArquivo = MetaArquivo

// ── Texto ────────────────────────────────────────────────────────────────────────────────────────

/** Os símbolos `<` e `>` não são aceitos em nenhum campo de texto. */
export const semSimbolos = (texto: string) => texto.replace(/[<>]/g, '')

export const temSimbolosProibidos = (texto: string) => /[<>]/.test(texto)

/** "Sobrado Pequeno & Moderno!" → "sobrado-pequeno-moderno" (sem acento, só letras, números e hífen). */
export function gerarSlug(titulo: string): string {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '')
}

/**
 * Acrescenta um texto a uma lista (tags, itens incluídos): sem espaços nas pontas, sem `<` e `>`,
 * sem repetir (maiúsculas e minúsculas contam igual) e até o limite. Texto vazio é ignorado.
 * Devolve a lista nova e, se não deu para acrescentar, o motivo.
 */
export function adicionarTexto(
  lista: readonly string[],
  texto: string,
  mensagens: { limite?: number; repetido: string; cheio: string },
): { lista: string[]; erro: string | null } {
  const limpo = semSimbolos(texto).trim()
  if (limpo === '') return { lista: [...lista], erro: null }
  if (lista.some((item) => item.toLowerCase() === limpo.toLowerCase())) {
    return { lista: [...lista], erro: mensagens.repetido }
  }
  if (mensagens.limite !== undefined && lista.length >= mensagens.limite) {
    return { lista: [...lista], erro: mensagens.cheio }
  }
  return { lista: [...lista, limpo], erro: null }
}

/** Só dígitos (campos inteiros). */
export const filtrarInteiro = (texto: string) => texto.replace(/\D/g, '').slice(0, 5)

/** Dígitos e uma vírgula (medidas em metros); o ponto vira vírgula. */
export function filtrarDecimal(texto: string): string {
  const limpo = texto.replace(/\./g, ',').replace(/[^\d,]/g, '')
  const [inteiro = '', ...resto] = limpo.split(',')
  return (resto.length > 0 ? `${inteiro},${resto.join('')}` : inteiro).slice(0, 8)
}

/** Dígitos, ponto e vírgula (preço em reais, como "1.299,90"). */
export const filtrarPreco = (texto: string) => texto.replace(/[^\d.,]/g, '').slice(0, 12)

/** Letras, números e hífen, sempre maiúsculo (código manual do projeto, ligado ao vídeo do YouTube). */
export const filtrarCodigoManual = (texto: string) =>
  texto
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, LIMITES.codigoYoutubeMax)

// ── Números ──────────────────────────────────────────────────────────────────────────────────────

/**
 * Lê o preço digitado em reais ("399,90", "1.299,90") e devolve centavos inteiros.
 * Vazio ou texto que não é preço devolve `null`.
 */
export function lerPrecoEmCentavos(texto: string): number | null {
  const limpo = texto.replace(/R\$|\s/g, '')
  if (limpo === '') return null
  const normal = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(normal)) return null
  return Math.round(Number(normal) * 100)
}

/** Lê um número digitado (aceita vírgula). Vazio ou inválido devolve `null`. */
export function lerNumero(texto: string): number | null {
  const limpo = texto.trim().replace(',', '.')
  if (limpo === '') return null
  const numero = Number(limpo)
  return Number.isFinite(numero) ? numero : null
}

// ── Arquivos ─────────────────────────────────────────────────────────────────────────────────────

// `formatarTamanho`/`extensaoDe` moram em `services/upload/arquivos`: também servem a biblioteca de
// arquivos de exemplo (reexportadas abaixo para quem já importava daqui).
export { extensaoDe, formatarTamanho }

function tipoCombinaComExtensao(extensao: string, tipo: string): boolean {
  const aceitos = TIPOS_POR_EXTENSAO[extensao]
  if (!aceitos) return false
  const minusculo = tipo.toLowerCase()
  return minusculo === '' || minusculo === 'application/octet-stream' || aceitos.includes(minusculo)
}

/** Motivo de a imagem não servir (JPG, PNG ou WEBP, até 2 MB), ou `null` se estiver certa. */
export function erroDeImagem({ nomeArquivo, tamanho, tipo }: MetadadosDeArquivo): string | null {
  const extensao = extensaoDe(nomeArquivo)
  const permitida = (ARQUIVOS_DE_IMAGEM.extensoes as readonly string[]).includes(extensao)
  // Imagem exige o MIME certo: tipo vazio ou genérico não passa (diferente de ZIP e RAR).
  const tipoConfere = TIPOS_POR_EXTENSAO[extensao]?.includes(tipo.toLowerCase()) ?? false
  if (!permitida || !tipoConfere) return 'Use uma imagem JPG, PNG ou WEBP.'
  if (tamanho <= 0) return 'O arquivo está vazio.'
  if (tamanho > LIMITES.imagemMaxBytes) return 'A imagem passa de 2 MB.'
  return null
}

/** Motivo de o arquivo não servir para a entrega, dado o conjunto de extensões aceitas. */
export function erroDeAnexo(
  { nomeArquivo, tamanho, tipo }: MetadadosDeArquivo,
  aceitas: readonly string[],
): string | null {
  const extensao = extensaoDe(nomeArquivo)
  if (!aceitas.includes(extensao) || !tipoCombinaComExtensao(extensao, tipo)) {
    return aceitas.length === 1 ? 'Use um arquivo PDF.' : 'Use um arquivo PDF, ZIP ou RAR.'
  }
  if (tamanho <= 0) return 'O arquivo está vazio.'
  if (tamanho > LIMITES.anexoMaxBytes) return 'O arquivo passa de 20 MB.'
  return null
}

export const somarTamanhos = (arquivos: readonly { tamanho: number }[]) =>
  arquivos.reduce((total, arquivo) => total + arquivo.tamanho, 0)

// ── Links ────────────────────────────────────────────────────────────────────────────────────────

const HOSPEDAGENS_DE_VIDEO = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com',
])

function lerHttps(texto: string): URL | null {
  try {
    const url = new URL(texto)
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

/** Link seguro (só `https:`); bloqueia `javascript:` e afins. */
export const ehLinkHttps = (texto: string) => lerHttps(texto) !== null

/** Link de vídeo ou tour virtual: só YouTube ou Vimeo, por `https:`. */
export function ehLinkDeVideo(texto: string): boolean {
  const url = lerHttps(texto)
  return url !== null && HOSPEDAGENS_DE_VIDEO.has(url.hostname.toLowerCase())
}

// ── Formulário ───────────────────────────────────────────────────────────────────────────────────

/** O formulário nasce vazio: nenhum campo vem com dado de exemplo. */
export function dadosVazios(): DadosProjeto {
  return {
    titulo: '',
    codigoYoutube: '',
    precoNormal: '',
    precoPromocional: '',
    categoria: '',
    estilo: '',
    resumo: '',
    descricao: '',
    ambientes: '',
    indicadoPara: '',
    aplicacoes: '',
    perfilTerreno: '',
    familiaIndicada: '',
    tags: [],
    videoUrl: '',
    checkoutUrl: '',
    imagemPrincipal: null,
    imagens: [],
    plantas: [],
    larguraTerreno: '',
    profundidadeTerreno: '',
    areaConstruida: '',
    quartos: '',
    suites: '',
    suiteMaster: '',
    banheiros: '',
    lavabo: '',
    vagas: '',
    pavimentos: '',
    piscina: '',
    areaGourmet: '',
    itens: [],
    arquivosExemplo: [],
    complementares: [],
    entregaArquivos: [],
    entregaLink: '',
  }
}

/** A aba tem algo preenchido? Só interessa às opcionais, que sem conteúdo não mostram check. */
function temConteudo(etapa: EtapaId, dados: DadosProjeto): boolean {
  if (etapa === 'exemplos') return dados.arquivosExemplo.length > 0
  if (etapa === 'complementares') return dados.complementares.length > 0
  return true
}

/** Marcador da aba no menu, a partir dos erros dela. */
export function situacaoDaEtapa(
  etapa: EtapaId,
  erros: ErrosDaEtapa,
  dados: DadosProjeto,
): SituacaoDaEtapa {
  if (Object.keys(erros).length > 0) return 'pending'
  const opcional = etapasDoCadastro.find((item) => item.id === etapa)?.opcional
  return opcional && !temConteudo(etapa, dados) ? 'optional' : 'complete'
}

/** "Informações Gerais e Imagens" / "A, B e C". */
export function listarEmTexto(nomes: readonly string[]): string {
  if (nomes.length <= 1) return nomes.join('')
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

/** Id do elemento HTML de um campo, a partir da chave do erro (`plantas.0.nome` → `campo-plantas-0-nome`). */
export const idDoCampo = (chave: string) => `campo-${chave.replaceAll('.', '-')}`

// ── Arquivos por papel ───────────────────────────────────────────────────────────────────────────

const ehImagem = (papel: PapelDoArquivo) =>
  papel === 'principal' || papel === 'galeria' || papel === 'planta'

/** Imagens e plantas aparecem no site (público). Entrega e PDFs dos complementares são conteúdo pago (privado). */
export const acessoDoPapel = (papel: PapelDoArquivo): AcessoDoArquivo =>
  ehImagem(papel) ? 'publico' : 'privado'

const TIPO_DE_CONTEUDO: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  zip: 'application/zip',
  rar: 'application/vnd.rar',
}

/** Tipo que o Storage recebe, escolhido pela extensão (o do navegador nem sempre vem certo). */
export const tipoDeConteudoDaExtensao = (extensao: string): string | undefined =>
  TIPO_DE_CONTEUDO[extensao]

/** Motivo de o arquivo não servir para o papel dele, ou `null` se estiver certo. */
export function erroDoArquivoDoPapel(papel: PapelDoArquivo, arquivo: MetaArquivo): string | null {
  if (ehImagem(papel)) return erroDeImagem(arquivo)
  const aceitas = papel === 'entrega' ? ARQUIVOS_DE_ENTREGA.extensoes : ARQUIVOS_DE_PDF.extensoes
  return erroDeAnexo(arquivo, aceitas)
}

/** Caminho controlado pelo app: nunca vem do nome que o navegador enviou. */
export const caminhoDoArquivo = (
  projetoId: string,
  papel: PapelDoArquivo,
  id: string,
  extensao: string,
) => `${projetoId}/${papel}/${id}.${extensao}`

// `formatoConfere` (conferência binária real do conteúdo) mora em `services/upload/assinaturas`:
// também serve a biblioteca de arquivos de exemplo, então foi promovida para lá (reexportada abaixo
// para quem já importava daqui).
export { formatoConfere } from '@/services/upload/assinaturas'

// ── Arquivos do formulário ───────────────────────────────────────────────────────────────────────

/** De onde sai a lista de arquivos: vale para os dados do formulário e para o que vai ao servidor. */
type FontesDeArquivo<A extends MetaArquivo & { id: string }> = {
  imagemPrincipal: A | null
  imagens: A[]
  plantas: (A & { nome: string })[]
  entregaArquivos: A[]
  complementares: { id: string; pdf: A | null }[]
}

export type ArquivoDoFormulario<A> = {
  papel: PapelDoArquivo
  arquivo: A
  /** Posição dentro da própria lista (imagens, plantas...). */
  ordem: number
  complementarId: string | null
  /** Nome que o cliente vê (só as plantas). */
  rotulo: string | null
}

/** Todos os arquivos do projeto, cada um com o papel, a posição e o vínculo. */
export function listarArquivosDoFormulario<A extends MetaArquivo & { id: string }>(
  dados: FontesDeArquivo<A>,
): ArquivoDoFormulario<A>[] {
  const lista: ArquivoDoFormulario<A>[] = []
  const incluir = (
    papel: PapelDoArquivo,
    arquivo: A,
    ordem: number,
    extra?: { complementarId?: string; rotulo?: string },
  ) =>
    lista.push({
      papel,
      arquivo,
      ordem,
      complementarId: extra?.complementarId ?? null,
      rotulo: extra?.rotulo ?? null,
    })

  if (dados.imagemPrincipal) incluir('principal', dados.imagemPrincipal, 0)
  dados.imagens.forEach((imagem, indice) => incluir('galeria', imagem, indice))
  dados.plantas.forEach((planta, indice) =>
    incluir('planta', planta, indice, { rotulo: planta.nome }),
  )
  dados.entregaArquivos.forEach((anexo, indice) => incluir('entrega', anexo, indice))
  dados.complementares.forEach((complementar) => {
    if (complementar.pdf) {
      incluir('complementar_pdf', complementar.pdf, 0, { complementarId: complementar.id })
    }
  })
  return lista
}

const paraArquivoDoPayload = (
  arquivo: ArquivoEscolhido,
  salvos: ReadonlySet<string>,
): ArquivoDoPayload => ({
  id: arquivo.id,
  nomeArquivo: arquivo.nomeArquivo,
  tamanho: arquivo.tamanho,
  tipo: arquivo.tipo,
  // Sem o `File` é porque veio do banco; com ele, só conta se já foi enviado nesta sessão.
  salvo: !arquivo.arquivo || salvos.has(arquivo.id),
})

/** O que o formulário manda ao servidor: os mesmos dados, sem o `File` e sem a prévia. */
export function montarPayload(dados: DadosProjeto, salvos: ReadonlySet<string>): PayloadProjeto {
  const doPayload = (arquivo: ArquivoEscolhido) => paraArquivoDoPayload(arquivo, salvos)
  return {
    ...dados,
    imagemPrincipal: dados.imagemPrincipal ? doPayload(dados.imagemPrincipal) : null,
    imagens: dados.imagens.map(doPayload),
    plantas: dados.plantas.map((planta) => ({ ...doPayload(planta), nome: planta.nome })),
    entregaArquivos: dados.entregaArquivos.map(doPayload),
    complementares: dados.complementares.map((complementar) => ({
      ...complementar,
      pdf: complementar.pdf ? doPayload(complementar.pdf) : null,
    })),
  }
}

/** O que falta enviar ao Storage para o projeto poder ser publicado. */
export function arquivosQueFaltam(estado: EstadoParaPublicar): string[] {
  const tem = (papel: PapelDoArquivo) => estado.arquivos.some((arquivo) => arquivo.papel === papel)
  const faltas: string[] = []
  if (!tem('principal')) faltas.push('a imagem principal')
  if (!tem('galeria')) faltas.push('as imagens do projeto')
  if (!tem('planta')) faltas.push('as plantas')
  if (!tem('entrega') && !estado.entregaLink) faltas.push('os arquivos da entrega')
  const semPdf = estado.complementares.some(
    (complementar) =>
      complementar.entrega === 'pdf' &&
      !estado.arquivos.some(
        (arquivo) =>
          arquivo.papel === 'complementar_pdf' && arquivo.complementarId === complementar.id,
      ),
  )
  if (semPdf) faltas.push('o PDF de um complementar')
  return faltas
}

// ── Gravação ─────────────────────────────────────────────────────────────────────────────────────

const textoOuNulo = (texto: string) => {
  const limpo = texto.trim()
  return limpo === '' ? null : limpo
}

const simNaoParaBoolean = (valor: SimNao) => (valor === '' ? null : valor === 'sim')

/** Dados já conferidos, no formato do banco: preço em centavos, número de verdade, vazio como `null`. */
export function montarCadastro(dados: DadosValidaveis): CadastroGravavel {
  return {
    titulo: dados.titulo.trim(),
    codigoYoutube: textoOuNulo(dados.codigoYoutube.toUpperCase()),
    categoria: textoOuNulo(dados.categoria),
    estilo: textoOuNulo(dados.estilo),
    precoCentavos: lerPrecoEmCentavos(dados.precoNormal),
    precoPromocionalCentavos: lerPrecoEmCentavos(dados.precoPromocional),
    resumo: textoOuNulo(dados.resumo),
    descricao: textoOuNulo(dados.descricao),
    ambientes: textoOuNulo(dados.ambientes),
    indicadoPara: textoOuNulo(dados.indicadoPara),
    aplicacoes: textoOuNulo(dados.aplicacoes),
    perfilTerreno: textoOuNulo(dados.perfilTerreno),
    familiaIndicada: textoOuNulo(dados.familiaIndicada),
    tags: dados.tags.map((tag) => tag.trim()),
    videoUrl: textoOuNulo(dados.videoUrl),
    checkoutUrl: textoOuNulo(dados.checkoutUrl),
    larguraM: lerNumero(dados.larguraTerreno),
    profundidadeM: lerNumero(dados.profundidadeTerreno),
    areaConstruidaM2: lerNumero(dados.areaConstruida),
    quartos: lerNumero(dados.quartos),
    suites: lerNumero(dados.suites),
    suiteMaster: lerNumero(dados.suiteMaster),
    banheiros: lerNumero(dados.banheiros),
    lavabo: lerNumero(dados.lavabo),
    vagas: lerNumero(dados.vagas),
    pavimentos: lerNumero(dados.pavimentos),
    piscina: simNaoParaBoolean(dados.piscina),
    areaGourmet: simNaoParaBoolean(dados.areaGourmet),
    itens: dados.itens.map((item) => item.trim()),
    entregaLink: textoOuNulo(dados.entregaLink),
  }
}

export function montarComplementares(dados: DadosValidaveis): ComplementarGravavel[] {
  return dados.complementares.map((complementar, indice) => ({
    id: complementar.id,
    titulo: textoOuNulo(complementar.titulo),
    valorCentavos: lerPrecoEmCentavos(complementar.valor),
    descricao: textoOuNulo(complementar.descricao),
    entrega: complementar.entrega === '' ? null : complementar.entrega,
    link: complementar.entrega === 'link' ? textoOuNulo(complementar.link) : null,
    ordem: indice,
  }))
}

// ── Edição (banco → formulário) ─────────────────────────────────────────────────────────────────

/** Inverso de `lerPrecoEmCentavos`: 129990 → "1299,90". */
const centavosParaTexto = (centavos: number | null) =>
  centavos === null ? '' : (centavos / 100).toFixed(2).replace('.', ',')

/** Inverso de `lerNumero`. */
const numeroParaTexto = (numero: number | null) =>
  numero === null ? '' : String(numero).replace('.', ',')

/** Inverso de `simNaoParaBoolean`. */
const booleanParaSimNao = (valor: boolean | null): SimNao =>
  valor === null ? '' : valor ? 'sim' : 'nao'

/** Arquivo já gravado, no formato que os campos do formulário esperam: sem `File` (dado de exibição). */
function paraArquivoEscolhido(arquivo: ArquivoCompletoDoBanco): ArquivoEscolhido {
  return {
    id: arquivo.id,
    nomeArquivo: arquivo.nomeOriginal,
    tamanho: arquivo.tamanhoBytes,
    tipo: arquivo.tipoMime,
  }
}

function paraImagem(arquivo: ArquivoCompletoDoBanco, url: string): ImagemProjeto {
  return { ...paraArquivoEscolhido(arquivo), url }
}

/**
 * Dados gravados de um projeto, no formato do formulário (`DadosProjeto`), para abrir a tela de
 * edição. Inverso de `montarCadastro`/`montarComplementares`. `urlDoArquivo` resolve a URL de
 * exibição de cada imagem — só as imagens precisam: PDF e outros anexos só mostram nome e tamanho
 * (ver `ListaDeAnexos`), por isso a função continua pura e testável sem Storage de verdade.
 */
export function paraDadosProjeto(
  cadastro: CadastroCompletoDoBanco,
  urlDoArquivo: (arquivo: ArquivoCompletoDoBanco) => string,
): DadosProjeto {
  const porOrdem = (a: ArquivoCompletoDoBanco, b: ArquivoCompletoDoBanco) => a.ordem - b.ordem
  const doPapel = (papel: PapelDoArquivo) =>
    cadastro.arquivos.filter((arquivo) => arquivo.papel === papel).sort(porOrdem)
  const pdfDoComplementar = (complementarId: string) =>
    cadastro.arquivos.find(
      (arquivo) =>
        arquivo.papel === 'complementar_pdf' && arquivo.complementarId === complementarId,
    )

  const principal = doPapel('principal')[0]

  const complementares: ComplementarProjeto[] = cadastro.complementares
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((complementar) => {
      const pdf = pdfDoComplementar(complementar.id)
      return {
        id: complementar.id,
        titulo: complementar.titulo ?? '',
        valor: centavosParaTexto(complementar.valorCentavos),
        descricao: complementar.descricao ?? '',
        entrega: complementar.entrega ?? '',
        link: complementar.link ?? '',
        pdf: pdf ? paraArquivoEscolhido(pdf) : null,
      }
    })

  return {
    titulo: cadastro.titulo,
    codigoYoutube: cadastro.codigoYoutube ?? '',
    precoNormal: centavosParaTexto(cadastro.precoCentavos),
    precoPromocional: centavosParaTexto(cadastro.precoPromocionalCentavos),
    categoria: cadastro.categoria ?? '',
    estilo: cadastro.estilo ?? '',
    resumo: cadastro.resumo ?? '',
    descricao: cadastro.descricao ?? '',
    ambientes: cadastro.ambientes ?? '',
    indicadoPara: cadastro.indicadoPara ?? '',
    aplicacoes: cadastro.aplicacoes ?? '',
    perfilTerreno: cadastro.perfilTerreno ?? '',
    familiaIndicada: cadastro.familiaIndicada ?? '',
    tags: [...cadastro.tags],
    videoUrl: cadastro.videoUrl ?? '',
    checkoutUrl: cadastro.checkoutUrl ?? '',
    imagemPrincipal: principal ? paraImagem(principal, urlDoArquivo(principal)) : null,
    imagens: doPapel('galeria').map((arquivo) => paraImagem(arquivo, urlDoArquivo(arquivo))),
    plantas: doPapel('planta').map((arquivo) => ({
      ...paraImagem(arquivo, urlDoArquivo(arquivo)),
      nome: arquivo.rotulo ?? '',
    })),
    larguraTerreno: numeroParaTexto(cadastro.larguraM),
    profundidadeTerreno: numeroParaTexto(cadastro.profundidadeM),
    areaConstruida: numeroParaTexto(cadastro.areaConstruidaM2),
    quartos: numeroParaTexto(cadastro.quartos),
    suites: numeroParaTexto(cadastro.suites),
    suiteMaster: numeroParaTexto(cadastro.suiteMaster),
    banheiros: numeroParaTexto(cadastro.banheiros),
    lavabo: numeroParaTexto(cadastro.lavabo),
    vagas: numeroParaTexto(cadastro.vagas),
    pavimentos: numeroParaTexto(cadastro.pavimentos),
    piscina: booleanParaSimNao(cadastro.piscina),
    areaGourmet: booleanParaSimNao(cadastro.areaGourmet),
    itens: [...cadastro.itens],
    arquivosExemplo: [...cadastro.arquivosExemplo],
    complementares,
    entregaArquivos: doPapel('entrega').map(paraArquivoEscolhido),
    entregaLink: cadastro.entregaLink ?? '',
  }
}
