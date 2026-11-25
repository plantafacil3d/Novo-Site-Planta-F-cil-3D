import { origensDeProduto } from './catalogo'
import type { ProdutoLigado } from './types'

// Regras puras do cadastro de produtos (sem React nem infraestrutura). Também usadas pelo site
// público (feature `produtos`), que importa daqui os rótulos e a etiqueta do cache.

/**
 * Etiqueta do cache das páginas que mostram produtos (Loja e seção do projeto). O cadastro a
 * renova depois de salvar; o site a usa nas consultas guardadas em cache.
 */
export const TAG_PRODUTOS = 'catalogo-produtos'

export const LIMITES_PRODUTO = {
  nomeMax: 120,
  linkMax: 2000,
  /** Produtos ligados a um projeto (aba Produtos). */
  porProjetoMax: 60,
  /** Projetos escolhidos de uma vez no "Aparece nos projetos". */
  projetosMax: 200,
  /** Resultados de cada busca ao vivo (produtos ou projetos). */
  buscaMax: 8,
  buscaMin: 2,
  buscaTextoMax: 100,
  /** Foto: até 2 MB (o bucket público aceita no máximo isso), já reduzida no navegador. */
  fotoBytesMax: 2 * 1024 * 1024,
  /** Lado maior da foto depois de reduzida. O card mostra no máximo ~370 px (tela 2x). */
  fotoLadoMax: 1000,
  fotoQualidade: 0.82,
  /** Produtos por página na tabela do painel. */
  porPaginaAdmin: 20,
  /** Nome de uma categoria ou ambiente. */
  opcaoNomeMax: 40,
  /** Teto de categorias (ou de ambientes) cadastrados. */
  opcoesMax: 200,
  /** Ambientes marcados em um produto (o banco aceita até 20). */
  ambientesPorProdutoMax: 20,
} as const

export function rotuloDaOrigem(valor: string): string {
  return origensDeProduto.find((item) => item.valor === valor)?.rotulo ?? valor
}

const compararNomes = (a: string, b: string) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })

/** Nomes (categorias ou ambientes) em ordem alfabética, sem repetição. */
export function ordenarNomes(nomes: Iterable<string>): string[] {
  return [...new Set(nomes)].sort(compararNomes)
}

/** Ambientes em ordem alfabética, sem repetição. */
export const ordenarAmbientes = ordenarNomes

/** O nome já está na lista? Sem diferenciar maiúsculas nem acentos ("sala" = "Sala"). */
export function nomeJaExiste(nome: string, lista: readonly { nome: string }[]): boolean {
  const alvo = nome.trim()
  return lista.some((item) => compararNomes(item.nome, alvo) === 0)
}

/** "Sala, Cozinha" — ou "—" sem nenhum. */
export function listarAmbientes(ambientes: readonly string[]): string {
  return ambientes.length > 0 ? ambientes.join(', ') : '—'
}

/** "1 projeto" / "3 projetos" */
export function contarProjetos(quantidade: number): string {
  return `${quantidade} ${quantidade === 1 ? 'projeto' : 'projetos'}`
}

/** Aviso ao editar: o produto é um só, então mudar aqui muda em todos os projetos. */
export function avisoDeProdutoCompartilhado(projetos: number): string | null {
  return projetos > 1 ? `Este produto aparece em ${contarProjetos(projetos)}.` : null
}

/** "Mostrando 21–40 de 55 produtos" / "3 produtos". */
export function descreverListagemAdmin(total: number, pagina: number, porPagina: number): string {
  const contar = (n: number) => `${n} ${n === 1 ? 'produto' : 'produtos'}`
  if (total <= porPagina) return contar(total)
  const inicio = (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, total)
  return `Mostrando ${inicio}–${fim} de ${contar(total)}`
}

/** Endereço da tabela do painel com busca e página na URL. */
export function montarHrefAdminProdutos({ q, pagina }: { q?: string; pagina: number }): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (pagina > 1) params.set('pagina', String(pagina))
  const texto = params.toString()
  return texto ? `/admin/produtos?${texto}` : '/admin/produtos'
}

/** O link como será gravado: só sem espaços nas pontas (o resto fica exatamente como digitado). */
export function normalizarLink(link: string): string {
  return link.trim()
}

/** Caminho da foto no Storage, gerado pelo servidor (nunca vem do navegador). */
export function caminhoDaFoto(id: string, extensao: string): string {
  return `produtos/${id}.${extensao}`
}

const CAMINHO_DA_FOTO = /^produtos\/[0-9a-f-]{36}\.(webp|jpg|png)$/

/** O caminho tem a forma que o próprio servidor gera? (Confere o que volta do navegador.) */
export function ehCaminhoDeFoto(caminho: string): boolean {
  return CAMINHO_DA_FOTO.test(caminho)
}

/** Reordena a lista da aba Produtos: o item arrastado vai para a posição do item de destino. */
export function moverProduto(
  lista: readonly ProdutoLigado[],
  idOrigem: string,
  idDestino: string,
): ProdutoLigado[] {
  const de = lista.findIndex((item) => item.id === idOrigem)
  const para = lista.findIndex((item) => item.id === idDestino)
  if (de === -1 || para === -1 || de === para) return [...lista]
  const nova = [...lista]
  const [movido] = nova.splice(de, 1)
  nova.splice(para, 0, movido as ProdutoLigado)
  return nova
}
