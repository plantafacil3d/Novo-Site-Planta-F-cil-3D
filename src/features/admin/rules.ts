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
