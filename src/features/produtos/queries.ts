import 'server-only'

import { revalidateTag, unstable_cache } from 'next/cache'
import { after } from 'next/server'

import { exigirAdmin } from '@/features/admin'
import {
  LIMITES_PRODUTO,
  TAG_PRODUTOS,
  type ParametrosAdminProdutos,
} from '@/features/produtos-cadastro'
import { produtoRepository } from '@/repositories/produtos'
import { produtoAdminRepository } from '@/repositories/produtos-admin'

import { PRODUTOS_POR_PAGINA, ehRobo } from './rules'
import { lerPedidoDeOferta } from './schemas'
import type { ConsultaLoja, ParametrosLoja } from './types'

// Loaders para Server Components: o conteúdo público é renderizado no servidor (SEO).

// Rede de segurança: se alguém mexer no banco direto (fora do painel), o site se atualiza sozinho.
const SEGUNDOS_DE_CACHE = 600

const buscarProdutosEmCache = unstable_cache(
  (consulta: ConsultaLoja) => produtoRepository.buscar(consulta),
  ['loja-produtos'],
  { tags: [TAG_PRODUTOS], revalidate: SEGUNDOS_DE_CACHE },
)

const listarFiltrosEmCache = unstable_cache(
  () => produtoRepository.listarFiltrosUsados(),
  ['loja-filtros'],
  { tags: [TAG_PRODUTOS], revalidate: SEGUNDOS_DE_CACHE },
)

// A página de cada projeto é estática: guardar a seção com esta etiqueta faz um só `revalidateTag`
// renovar todas as páginas que mostram produtos (mesma estratégia dos relacionados).
const listarDoProjetoEmCache = unstable_cache(
  (projetoId: string) => produtoRepository.listarDoProjeto(projetoId),
  ['produtos-do-projeto'],
  { tags: [TAG_PRODUTOS], revalidate: SEGUNDOS_DE_CACHE },
)

/** Chamar depois de criar, editar ou excluir produtos, ou de mudar as ligações com projetos. */
export function invalidarProdutos() {
  revalidateTag(TAG_PRODUTOS, { expire: 0 })
}

/** Uma página da Loja para os parâmetros da URL (já validados por `lerParametrosLoja`). */
export function listarProdutosDaLoja(params: ParametrosLoja) {
  return buscarProdutosEmCache({
    busca: params.q,
    categoria: params.categoria,
    ambiente: params.ambiente,
    pagina: params.pagina,
    porPagina: PRODUTOS_POR_PAGINA,
  })
}

/** Categorias e ambientes com produtos ativos (opções dos filtros da Loja). */
export function listarFiltrosDaLoja() {
  return listarFiltrosEmCache()
}

/** Seção "Decore como no projeto". Lista vazia = a seção não aparece. */
export function listarProdutosDoProjeto(projetoId: string) {
  return listarDoProjetoEmCache(projetoId)
}

/**
 * Rota `/ir/produto/<id>?de=...`: anota o clique e devolve o link da oferta, exatamente como
 * cadastrado. Produto inexistente ou inativo (ou pedido inválido) volta para a Loja (`null`).
 * Se anotar falhar, a pessoa segue para a oferta mesmo assim: o clique é secundário.
 */
export async function abrirOferta(
  id: unknown,
  de: unknown,
  userAgent: string | null,
): Promise<string | null> {
  const pedido = lerPedidoDeOferta(id, de)
  if (!pedido) return null

  const link = await produtoRepository.buscarLinkDaOferta(pedido.produtoId)
  if (!link) return null

  if (!ehRobo(userAgent)) {
    // Anota DEPOIS de mandar a pessoa à loja: ela não espera a gravação do clique.
    after(async () => {
      try {
        await produtoRepository.registrarClique(pedido.produtoId, pedido.origem)
      } catch (erro) {
        console.error('Clique em "Ver oferta" não foi anotado:', erro)
      }
    })
  }
  return link
}

// ── Painel ───────────────────────────────────────────────────────────────────────────────────────

/** Tabela do menu Produtos. Confere o administrador aqui (skill `seguranca` §5). */
export async function listarProdutosAdmin(params: ParametrosAdminProdutos) {
  await exigirAdmin()
  return produtoAdminRepository.listar({
    busca: params.q,
    pagina: params.pagina,
    porPagina: LIMITES_PRODUTO.porPaginaAdmin,
  })
}

/** Produtos ligados a um projeto, para a aba Produtos ao abrir o projeto para editar. */
export async function listarProdutosDoProjetoParaEditar(projetoId: string) {
  await exigirAdmin()
  return produtoAdminRepository.listarDoProjeto(projetoId)
}

/** Produto para a página de edição do menu Produtos. `null` se não existe. */
export async function buscarProdutoParaEditar(id: string) {
  await exigirAdmin()
  return produtoAdminRepository.buscarParaEditar(id)
}
