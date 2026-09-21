import { etapasDoCadastro } from './catalogo'
import type { DadosProjeto, EtapaId, ErrosDaEtapa, SituacaoDaEtapa } from './types'

const MB = 1024 * 1024

/** Limites do formulário. Cada um existe só aqui; telas e schemas leem daqui. */
export const LIMITES = {
  tituloMax: 120,
  resumoMin: 80,
  resumoMax: 500,
  descricaoMax: 4000,
  tagsMax: 10,
  tagTamanhoMax: 30,
  linkMax: 500,
  plantaNomeMax: 60,
  itemMax: 100,
  complementarTituloMax: 80,
  complementarDescricaoMin: 10,
  complementarDescricaoMax: 300,
  imagemMaxBytes: 2 * MB,
  /** Vale para cada PDF de complementar e para a soma dos arquivos de entrega do projeto. */
  anexoMaxBytes: 20 * MB,
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

type MetadadosDeArquivo = { nomeArquivo: string; tamanho: number; tipo: string }

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

const numeroPtBr = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** 1536 → "1,5 KB"; 2411724 → "2,3 MB". */
export function formatarTamanho(bytes: number): string {
  if (bytes < MB) return `${numeroPtBr.format(bytes / 1024)} KB`
  return `${numeroPtBr.format(bytes / MB)} MB`
}

const extensaoDe = (nome: string) => nome.split('.').pop()?.toLowerCase() ?? ''

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
    precoNormal: '',
    precoPromocional: '',
    categoria: '',
    estilo: '',
    resumo: '',
    descricao: '',
    tags: [],
    videoUrl: '',
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
