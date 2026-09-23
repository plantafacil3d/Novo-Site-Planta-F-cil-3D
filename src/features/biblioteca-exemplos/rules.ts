import { extensaoDe, formatarTamanho } from '@/services/upload/arquivos'

import type { ParametrosAdminBiblioteca } from './types'

// UI não importa `services/` direto (skill `arquitetura` §1); componentes usam estas duas via a
// feature, aqui reexportadas.
export { extensaoDe, formatarTamanho }

const MB = 1024 * 1024

/** Limites do upload. Cada um existe só aqui; a tela e o servidor leem daqui. */
export const LIMITES_BIBLIOTECA = {
  tamanhoMaxBytes: 20 * MB,
  /** Quantos arquivos entram numa chamada de `prepararEnvioBiblioteca`/`confirmarEnvioBiblioteca`. */
  loteMax: 12,
} as const

export const ARQUIVOS_DA_BIBLIOTECA = {
  extensoes: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'dwg'],
  accept: '.jpg,.jpeg,.png,.webp,.pdf,.dwg',
} as const

/** Tipos aceitos por extensão. DWG não tem um MIME padronizado entre navegadores (varia entre vazio
 *  e uns tantos valores não oficiais): vazio e `octet-stream` também passam aqui, igual já acontece
 *  para ZIP/RAR no cadastro de projeto — quem decide de verdade é a assinatura binária do conteúdo
 *  (`formatoConfere`, conferida no servidor depois do envio). */
const TIPOS_POR_EXTENSAO: Record<string, readonly string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  pdf: ['application/pdf'],
  dwg: [
    'application/acad',
    'application/x-acad',
    'application/autocad_dwg',
    'image/vnd.dwg',
    'application/dwg',
    'application/x-dwg',
  ],
}

function tipoCombinaComExtensao(extensao: string, tipo: string): boolean {
  const aceitos = TIPOS_POR_EXTENSAO[extensao]
  if (!aceitos) return false
  const minusculo = tipo.toLowerCase()
  return minusculo === '' || minusculo === 'application/octet-stream' || aceitos.includes(minusculo)
}

export type MetadadosDeArquivo = { nomeArquivo: string; tamanho: number; tipo: string }

/** Motivo de o arquivo não servir para a biblioteca (imagem, PDF ou DWG, até 20 MB), ou `null`. */
export function erroDoArquivoDaBiblioteca({
  nomeArquivo,
  tamanho,
  tipo,
}: MetadadosDeArquivo): string | null {
  const extensao = extensaoDe(nomeArquivo)
  if (
    !(ARQUIVOS_DA_BIBLIOTECA.extensoes as readonly string[]).includes(extensao) ||
    !tipoCombinaComExtensao(extensao, tipo)
  ) {
    return 'Use uma imagem (JPG, PNG, WEBP), um PDF ou um DWG.'
  }
  if (tamanho <= 0) return 'O arquivo está vazio.'
  if (tamanho > LIMITES_BIBLIOTECA.tamanhoMaxBytes) return 'O arquivo passa de 20 MB.'
  return null
}

/** Caminho controlado pelo app: nunca o nome que o navegador enviou. Sem `projetoId`: o arquivo não
 *  pertence a um projeto, pertence ao acervo. */
export const caminhoDaBiblioteca = (id: string, extensao: string) => `biblioteca/${id}.${extensao}`

/** Mesma regra de `cadastro-projeto/rules.ts`: texto livre não pode ter `<`/`>` (evita quebrar HTML
 *  ao exibir o nome depois). */
export const temSimbolosProibidos = (texto: string) => /[<>]/.test(texto)

/** Nome de exibição do arquivo: até 255 caracteres, sem `<`/`>`. Mesmo teto usado no envio
 *  (`schemaArquivo.nomeArquivo`), para o nome renomeado nunca ficar maior que o original aceitaria. */
export const NOME_MAXIMO = 255

/** DWG não tem um MIME padronizado: o bucket aceita `application/octet-stream` só para essa
 *  extensão (ver a migration), e é isso que o Storage recebe — nunca o MIME que o navegador informou. */
const TIPO_DE_CONTEUDO: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  dwg: 'application/octet-stream',
}

/** Tipo que o Storage recebe, escolhido pela extensão (o do navegador nem sempre vem certo). */
export const tipoDeConteudoDaExtensao = (extensao: string): string | undefined =>
  TIPO_DE_CONTEUDO[extensao]

export const POR_PAGINA_BIBLIOTECA = 20
/** Teto de itens buscados de uma vez para popular os checkboxes da aba "Arquivos de Exemplo" do
 *  cadastro de projeto: uma lista paginada dentro de uma aba de formulário seria pior UX que um teto
 *  generoso aqui. */
export const SELECAO_MAXIMA_PARA_FORMULARIO = 200
/** Teto de uma ação em massa (excluir vários arquivos de uma vez). */
export const SELECAO_MAXIMA = 50

/** Endereço da listagem com busca e página na URL (página 1 e busca vazia não aparecem). */
export function montarHrefAdminBiblioteca({ q, pagina }: ParametrosAdminBiblioteca): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (pagina > 1) params.set('pagina', String(pagina))
  const texto = params.toString()
  return texto ? `/admin/biblioteca?${texto}` : '/admin/biblioteca'
}

/** "1 arquivo" / "3 arquivos" */
export function contarArquivos(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? 'arquivo' : 'arquivos'}`
}

/** "Mostrando 21–40 de 45 arquivos"; com uma página só, "4 arquivos". */
export function descreverListagem(total: number, pagina: number, porPagina: number): string {
  if (total <= porPagina) return contarArquivos(total)
  const inicio = (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, total)
  return `Mostrando ${inicio}–${fim} de ${contarArquivos(total)}`
}

const data = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' })

/** "2026-09-20T17:58:18Z" → "20/09/2026" */
export function formatarData(iso: string): string {
  return data.format(new Date(iso))
}
