import 'server-only'

import { lookup } from 'node:dns/promises'
import { BlockList, isIP } from 'node:net'

import type { FotoDaPrevia, LeitorDePrevia, PreviaDoLink } from './LeitorDePrevia'

// O servidor vai buscar um endereço digitado no painel: cuidado com SSRF (skill `seguranca`).
// Só http(s) nas portas padrão, nenhum endereço interno (conferido a cada redirecionamento),
// tempo e tamanho limitados. Nada da resposta é executado: só lemos texto de duas etiquetas.

const TEMPO_MAXIMO_MS = 8000
const REDIRECIONAMENTOS_MAX = 5
const PAGINA_BYTES_MAX = 1.5 * 1024 * 1024
const FOTO_BYTES_MAX = 5 * 1024 * 1024
const TIPOS_DE_FOTO = ['image/webp', 'image/jpeg', 'image/png'] as const
/** Identificação genérica, como a de qualquer leitor de prévias (sem dados do site ou do usuário). */
const AGENTE = 'Mozilla/5.0 (compatible; LinkPreview/1.0)'

const enderecosInternos = new BlockList()
for (const [rede, prefixo] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const) {
  enderecosInternos.addSubnet(rede, prefixo, 'ipv4')
}
for (const [rede, prefixo] of [
  ['::', 128],
  ['::1', 128],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  enderecosInternos.addSubnet(rede, prefixo, 'ipv6')
}

function ehInterno(ip: string): boolean {
  // IPv4 escrito como IPv6 (::ffff:10.0.0.1): confere a parte IPv4.
  const mapeado = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip)
  if (mapeado?.[1]) return enderecosInternos.check(mapeado[1], 'ipv4')
  return enderecosInternos.check(ip, isIP(ip) === 6 ? 'ipv6' : 'ipv4')
}

/** O endereço é http(s), na porta padrão, e aponta só para a internet pública? */
async function enderecoPermitido(url: URL): Promise<boolean> {
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false
  if (url.port !== '' || url.username !== '' || url.password !== '') return false
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (isIP(host)) return !ehInterno(host)
  try {
    const enderecos = await lookup(host, { all: true, verbatim: true })
    return enderecos.length > 0 && enderecos.every((endereco) => !ehInterno(endereco.address))
  } catch {
    return false
  }
}

/** Segue os redirecionamentos um a um, conferindo cada destino. `null` se algum não for permitido. */
async function buscar(inicio: string, aceitar: string, sinal: AbortSignal) {
  let url = new URL(inicio)
  for (let salto = 0; salto <= REDIRECIONAMENTOS_MAX; salto++) {
    if (!(await enderecoPermitido(url))) return null
    const resposta = await fetch(url, {
      redirect: 'manual',
      signal: sinal,
      headers: { 'user-agent': AGENTE, accept: aceitar },
    })
    const destino = resposta.headers.get('location')
    if (resposta.status >= 300 && resposta.status < 400 && destino) {
      await resposta.body?.cancel()
      url = new URL(destino, url)
      continue
    }
    if (!resposta.ok) {
      await resposta.body?.cancel()
      return null
    }
    return { resposta, url }
  }
  return null
}

/** Lê o corpo até `limite` bytes. `null` se passar do limite. */
async function lerAte(resposta: Response, limite: number): Promise<Uint8Array | null> {
  const declarado = Number(resposta.headers.get('content-length'))
  if (declarado > limite) {
    await resposta.body?.cancel()
    return null
  }
  const leitor = resposta.body?.getReader()
  if (!leitor) return null
  const partes: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await leitor.read()
    if (done) break
    total += value.byteLength
    if (total > limite) {
      await leitor.cancel()
      return null
    }
    partes.push(value)
  }
  const tudo = new Uint8Array(total)
  let posicao = 0
  for (const parte of partes) {
    tudo.set(parte, posicao)
    posicao += parte.byteLength
  }
  return tudo
}

/** Lê a página só até onde dá; uma página grande demais ainda traz as etiquetas no começo. */
async function lerComecoDaPagina(resposta: Response): Promise<string> {
  const leitor = resposta.body?.getReader()
  if (!leitor) return ''
  const decodificador = new TextDecoder()
  let texto = ''
  let total = 0
  for (;;) {
    const { done, value } = await leitor.read()
    if (done) break
    total += value.byteLength
    texto += decodificador.decode(value, { stream: true })
    if (total >= PAGINA_BYTES_MAX || /<\/head>/i.test(texto)) {
      await leitor.cancel()
      break
    }
  }
  return texto
}

function decodificarEntidades(texto: string): string {
  const nomeadas: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  }
  return texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (inteiro, codigo: string) => {
    if (codigo[0] === '#') {
      const numero =
        codigo[1] === 'x' || codigo[1] === 'X'
          ? parseInt(codigo.slice(2), 16)
          : parseInt(codigo.slice(1), 10)
      return Number.isFinite(numero) && numero > 0 && numero < 0x110000
        ? String.fromCodePoint(numero)
        : inteiro
    }
    return nomeadas[codigo.toLowerCase()] ?? inteiro
  })
}

/** Valores das etiquetas `<meta>` da página, por nome (`og:title`, `twitter:image`...). */
function lerEtiquetas(html: string): Map<string, string> {
  const etiquetas = new Map<string, string>()
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const atributos = new Map<string, string>()
    for (const [, nome, , valor] of tag.matchAll(/([a-z:-]+)\s*=\s*(["'])([\s\S]*?)\2/gi)) {
      if (nome && valor !== undefined) atributos.set(nome.toLowerCase(), valor)
    }
    const chave = (atributos.get('property') ?? atributos.get('name'))?.toLowerCase()
    const conteudo = atributos.get('content')
    if (chave && conteudo && !etiquetas.has(chave)) {
      etiquetas.set(chave, decodificarEntidades(conteudo).trim())
    }
  }
  return etiquetas
}

function tituloDaPagina(html: string): string | null {
  const titulo = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]
  return titulo ? decodificarEntidades(titulo).replace(/\s+/g, ' ').trim() || null : null
}

/**
 * Algumas lojas indicam o tamanho da foto numa letra no fim do nome do arquivo (`...-P.webp` =
 * pequena, usada nas prévias). A versão grande (`-F`) costuma existir: tenta ela primeiro.
 */
function versaoMaior(endereco: URL): URL | null {
  if (!/-P\.(webp|jpe?g|png)$/i.test(endereco.pathname)) return null
  const maior = new URL(endereco)
  maior.pathname = endereco.pathname.replace(/-P(\.[a-z]+)$/i, '-F$1')
  return maior
}

async function baixarFoto(endereco: URL, sinal: AbortSignal): Promise<FotoDaPrevia | null> {
  const achado = await buscar(endereco.href, TIPOS_DE_FOTO.join(','), sinal)
  if (!achado) return null
  const tipo = (achado.resposta.headers.get('content-type') ?? '').split(';')[0]?.trim() ?? ''
  if (!(TIPOS_DE_FOTO as readonly string[]).includes(tipo)) {
    await achado.resposta.body?.cancel()
    return null
  }
  const bytes = await lerAte(achado.resposta, FOTO_BYTES_MAX)
  return bytes ? { base64: Buffer.from(bytes).toString('base64'), tipo } : null
}

export class HttpLeitorDePrevia implements LeitorDePrevia {
  async ler(link: string): Promise<PreviaDoLink | null> {
    const sinal = AbortSignal.timeout(TEMPO_MAXIMO_MS)
    try {
      const pagina = await buscar(link, 'text/html,application/xhtml+xml', sinal)
      if (!pagina) return null
      if (!/html/i.test(pagina.resposta.headers.get('content-type') ?? '')) {
        await pagina.resposta.body?.cancel()
        return null
      }
      const html = await lerComecoDaPagina(pagina.resposta)
      const etiquetas = lerEtiquetas(html)

      const titulo =
        etiquetas.get('og:title') ?? etiquetas.get('twitter:title') ?? tituloDaPagina(html)
      const enderecoDaFoto = etiquetas.get('og:image') ?? etiquetas.get('twitter:image')

      let foto: FotoDaPrevia | null = null
      if (enderecoDaFoto) {
        const endereco = new URL(enderecoDaFoto, pagina.url)
        const maior = versaoMaior(endereco)
        foto = (maior && (await baixarFoto(maior, sinal))) || (await baixarFoto(endereco, sinal))
      }
      if (!titulo && !foto) return null
      return { titulo: titulo ?? null, foto }
    } catch (erro) {
      console.error('Não foi possível ler a prévia do link:', erro)
      return null
    }
  }
}
