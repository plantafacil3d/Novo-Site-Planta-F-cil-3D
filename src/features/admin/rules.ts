import type {
  NovoProjetoAdmin,
  ParametrosAdminProjetos,
  ProjetoAdmin,
  StatusProjeto,
} from './types'

export const PROJETOS_ADMIN_POR_PAGINA = 20

const TITULO_MAXIMO = 200

export const rotuloDeStatus: Record<StatusProjeto, string> = {
  publicado: 'Publicado',
  rascunho: 'Rascunho',
}

export const selosDeProjeto = [
  { valor: 'mais-vendido', rotulo: 'Mais vendido' },
  { valor: 'lancamento', rotulo: 'Lançamento' },
] as const

export const diferenciaisDeProjeto = [
  { valor: 'piscina', rotulo: 'Piscina' },
  { valor: 'varanda-gourmet', rotulo: 'Varanda gourmet' },
] as const

const SLUG_MAXIMO = 100

/** "Sobrado Pequeno & Moderno!" → "sobrado-pequeno-moderno" (sem acento, só letras, números e hífen). */
export function gerarSlug(titulo: string): string {
  return titulo
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAXIMO)
    .replace(/-+$/g, '')
}

/**
 * Lê o preço digitado em reais ("399,90", "1.299,90", "R$ 399") e devolve centavos inteiros.
 * Vazio vira 0 (rascunho sem preço); texto que não é preço devolve `null`.
 */
export function lerPrecoEmCentavos(texto: string): number | null {
  const limpo = texto.replace(/R\$|\s/g, '')
  if (limpo === '') return 0
  const normal = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(normal)) return null
  return Math.round(Number(normal) * 100)
}

/** 39990 → "399,90" para preencher o campo; 0 (sem preço) vira vazio. */
export function centavosParaCampo(centavos: number): string {
  return centavos > 0 ? (centavos / 100).toFixed(2).replace('.', ',') : ''
}

/** Endereço da listagem com busca e página na URL (página 1 e busca vazia não aparecem). */
export function montarHrefAdminProjetos({ q, pagina }: ParametrosAdminProjetos): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (pagina > 1) params.set('pagina', String(pagina))
  const texto = params.toString()
  return texto ? `/admin/projetos?${texto}` : '/admin/projetos'
}

/**
 * A cópia nasce como rascunho, com título "Cópia de …" e um slug próprio (o slug é único no banco).
 * `sufixo` é um trecho aleatório curto, para duas cópias do mesmo projeto não colidirem.
 */
export function montarCopia(original: ProjetoAdmin, sufixo: string): NovoProjetoAdmin {
  return {
    titulo: `Cópia de ${original.titulo}`.slice(0, TITULO_MAXIMO),
    slug: `${original.slug}-copia-${sufixo}`,
    tipo: original.tipo,
    precoCentavos: original.precoCentavos,
    status: 'rascunho',
  }
}

const data = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' })

/** "2026-09-20T17:58:18Z" → "20/09/2026" */
export function formatarData(iso: string): string {
  return data.format(new Date(iso))
}

/** "1 projeto" / "3 projetos" */
export function contarProjetos(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? 'projeto' : 'projetos'}`
}

/** "Mostrando 21–40 de 45 projetos"; com uma página só, "4 projetos". */
export function descreverListagem(total: number, pagina: number, porPagina: number): string {
  if (total <= porPagina) return contarProjetos(total)
  const inicio = (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, total)
  return `Mostrando ${inicio}–${fim} de ${contarProjetos(total)}`
}
