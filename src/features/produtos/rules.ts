import type { Pagina } from '@/types/pagina'

import { ordenarAmbientes } from '@/features/produtos-cadastro'
import type { OrigemDoClique, ParametrosLoja, ProdutoResumo } from './types'

/**
 * Produtos por página da Loja. 24 divide por 2, 3, 4 e 6 (as colunas da grade do celular ao
 * computador), então a última linha de cada página fica sempre completa.
 */
export const PRODUTOS_POR_PAGINA = 24

/** Os ambientes que aparecem em pelo menos um dos produtos (filtros da seção do projeto). */
export function ambientesDosProdutos(produtos: ProdutoResumo[]): string[] {
  return ordenarAmbientes(produtos.flatMap((produto) => produto.ambientes))
}

/** Opções de um filtro: as em uso, mais a escolhida na URL (para ela não sumir do campo). */
export function opcoesDoFiltro(usados: readonly string[], escolhido: string | undefined): string[] {
  return escolhido && !usados.includes(escolhido) ? [escolhido, ...usados] : [...usados]
}

/**
 * Rótulo do card. Na seção do projeto, o ambiente (o do filtro escolhido, se o produto estiver
 * nele; senão o primeiro). Na Loja, "Categoria · Ambiente".
 */
export function rotuloDoProduto(
  produto: ProdutoResumo,
  modo: 'ambiente' | 'categoria-e-ambiente',
  ambienteEscolhido?: string,
): string {
  const ambiente =
    ambienteEscolhido && produto.ambientes.includes(ambienteEscolhido)
      ? ambienteEscolhido
      : produto.ambientes[0]
  const textoDoAmbiente = ambiente ?? ''
  if (modo === 'ambiente') return textoDoAmbiente || produto.categoria
  return [produto.categoria, textoDoAmbiente].filter(Boolean).join(' · ')
}

/**
 * Endereço do botão "Ver oferta". Passa pelo próprio site, que anota o clique e redireciona para o
 * link cadastrado (`/ir/produto/<id>`). `de` diz de onde veio: `loja` ou o id do projeto.
 */
export function hrefDaOferta(produtoId: string, origem: OrigemDoClique): string {
  const de = origem.pagina === 'loja' ? 'loja' : origem.projetoId
  return `/ir/produto/${produtoId}?de=${encodeURIComponent(de)}`
}

/** Campos da URL da Loja que filtram (a página não conta como filtro). */
const camposDeFiltro = ['q', 'categoria', 'ambiente'] as const

export function temFiltrosNaLoja(params: ParametrosLoja): boolean {
  return camposDeFiltro.some((campo) => params[campo] !== undefined)
}

export function contarFiltrosNaLoja(params: ParametrosLoja): number {
  return camposDeFiltro.filter((campo) => params[campo] !== undefined).length
}

/** Endereço da Loja só com o que foge do padrão (sem `pagina=1`). */
export function montarHrefLoja(params: Partial<ParametrosLoja>): string {
  const busca = new URLSearchParams()
  for (const campo of camposDeFiltro) {
    const valor = params[campo]
    if (valor !== undefined) busca.set(campo, valor)
  }
  if (params.pagina && params.pagina > 1) busca.set('pagina', String(params.pagina))
  const texto = busca.toString()
  return texto ? `/loja?${texto}` : '/loja'
}

/** "44 produtos encontrados"; com mais de uma página, "Mostrando 25–48 de 60 produtos". */
export function descreverProdutos({
  total,
  pagina,
  porPagina,
}: Pick<Pagina<unknown>, 'total' | 'pagina' | 'porPagina'>): string {
  if (total <= porPagina) {
    return total === 1 ? '1 produto encontrado' : `${total} produtos encontrados`
  }
  const inicio = (pagina - 1) * porPagina + 1
  const fim = Math.min(pagina * porPagina, total)
  return `Mostrando ${inicio}–${fim} de ${total} produtos`
}

/** Robôs (buscadores, prévias de link do WhatsApp/redes) não contam como clique de verdade. */
const ROBOS =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|headless/i

export function ehRobo(userAgent: string | null): boolean {
  return !userAgent || ROBOS.test(userAgent)
}
