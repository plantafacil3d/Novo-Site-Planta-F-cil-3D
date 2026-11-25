import { redirect } from 'next/navigation'

import { Pagination } from '@/components/navigation/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { listarProdutosAdmin } from '@/features/produtos'
import {
  LIMITES_PRODUTO,
  TabelaProdutosAdmin,
  descreverListagemAdmin,
  montarHrefAdminProdutos,
  type ParametrosAdminProdutos,
} from '@/features/produtos-cadastro'
import { totalDePaginas } from '@/features/projetos'

/** Tela "Produtos" do painel: cadastro geral dos produtos recomendados (Loja e projetos). */
export async function ProdutosAdminView({
  params,
  salvo,
}: {
  params: ParametrosAdminProdutos
  /** Voltou do cadastro depois de salvar (`?salvo=1`). */
  salvo?: boolean
}) {
  const resultado = await listarProdutosAdmin(params)
  const porPagina = LIMITES_PRODUTO.porPaginaAdmin
  const paginas = totalDePaginas(resultado.total, porPagina)

  // Link antigo ou digitado à mão para uma página que não existe (mais); leva à última.
  if (resultado.total > 0 && params.pagina > paginas) {
    redirect(montarHrefAdminProdutos({ ...params, pagina: paginas }))
  }

  const chave = montarHrefAdminProdutos(params)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">Produtos</h1>
          <p className="mt-2 text-fg-muted">Produtos recomendados na Loja e nos projetos.</p>
        </div>
        <Button iconLeft="plus" href="/admin/produtos/novo">
          Cadastrar produto
        </Button>
      </div>

      {salvo && <Alert variant="success">Produto salvo com sucesso.</Alert>}

      <SearchBar
        key={`busca:${chave}`}
        action="/admin/produtos"
        label="Buscar produtos por nome"
        placeholder="Buscar por nome do produto"
        defaultValue={params.q}
      />

      {resultado.total > 0 && (
        <p className="text-sm text-fg-muted">
          {descreverListagemAdmin(resultado.total, params.pagina, porPagina)}
        </p>
      )}

      <TabelaProdutosAdmin key={`tabela:${chave}`} linhas={resultado.itens} />

      {resultado.total === 0 ? (
        <EmptyState
          icon="sofa"
          title="Nenhum produto encontrado"
          description={
            params.q ? 'Tente buscar por outro nome.' : 'Os produtos cadastrados vão aparecer aqui.'
          }
          action={params.q ? { label: 'Limpar busca', href: '/admin/produtos' } : undefined}
        />
      ) : (
        <Pagination
          pagina={params.pagina}
          totalPaginas={paginas}
          hrefPagina={(pagina) => montarHrefAdminProdutos({ ...params, pagina })}
        />
      )}
    </div>
  )
}
