import { redirect } from 'next/navigation'

import { Pagination } from '@/components/navigation/Pagination'
import { SeletorPorPagina } from '@/components/navigation/SeletorPorPagina'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import {
  OPCOES_POR_PAGINA_ADMIN,
  TabelaProjetosAdmin,
  descreverListagem,
  formatarData,
  listarProjetosAdmin,
  montarHrefAdminProjetos,
  type ParametrosAdminProjetos,
} from '@/features/admin'
import { categoriasDoCadastro } from '@/features/cadastro-projeto'
import { formatarPreco, totalDePaginas } from '@/features/projetos'

const rotulosDeCategoria: Record<string, string> = Object.fromEntries(
  categoriasDoCadastro.map((categoria) => [categoria.valor, categoria.rotulo]),
)

/** Rascunho pode estar sem categoria ou preço: a tabela mostra um traço. */
const SEM_VALOR = '—'

type ProjetosAdminViewProps = {
  params: ParametrosAdminProjetos
  /** Veio de um "Salvar" na edição de projeto: mostra a confirmação de sucesso. */
  salvo?: boolean
}

/** Aba Projetos do painel: título, "Cadastrar Projeto", busca, tabela e paginação. */
export async function ProjetosAdminView({ params, salvo }: ProjetosAdminViewProps) {
  const resultado = await listarProjetosAdmin(params)
  const paginas = totalDePaginas(resultado.total, params.porPagina)

  // Link antigo ou digitado à mão para uma página que não existe (mais); leva à última.
  if (resultado.total > 0 && params.pagina > paginas) {
    redirect(montarHrefAdminProjetos({ ...params, pagina: paginas }))
  }

  const linhas = resultado.itens.map((projeto) => ({
    ...projeto,
    precoFormatado:
      projeto.precoCentavos === null ? SEM_VALOR : formatarPreco(projeto.precoCentavos),
    categoriaRotulo: projeto.categoria
      ? (rotulosDeCategoria[projeto.categoria] ?? projeto.categoria)
      : SEM_VALOR,
    criadoEmRotulo: formatarData(projeto.criadoEm),
  }))
  // Muda a cada busca ou página: a busca reflete a URL e a seleção da tabela recomeça vazia.
  const chave = montarHrefAdminProjetos(params)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">Projetos</h1>
          <p className="mt-2 text-fg-muted">Todos os projetos cadastrados no site.</p>
        </div>
        <Button iconLeft="plus" href="/admin/projetos/novo">
          Cadastrar Projeto
        </Button>
      </div>

      {salvo && <Alert variant="success">Projeto salvo com sucesso.</Alert>}

      <SearchBar
        key={chave}
        action="/admin/projetos"
        label="Buscar projetos por nome ou código"
        placeholder="Buscar por nome ou código (ex.: PF-001)"
        defaultValue={params.q}
      />

      {resultado.total === 0 ? (
        <EmptyState
          icon="folder"
          title="Nenhum projeto encontrado"
          description={
            params.q
              ? 'Tente buscar por outro nome ou código.'
              : 'Os projetos cadastrados vão aparecer aqui.'
          }
          action={params.q ? { label: 'Limpar busca', href: '/admin/projetos' } : undefined}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-fg-muted">
              {descreverListagem(resultado.total, params.pagina, params.porPagina)}
            </p>
            <SeletorPorPagina
              porPagina={params.porPagina}
              opcoes={OPCOES_POR_PAGINA_ADMIN.map((porPagina) => ({
                valor: porPagina,
                href: montarHrefAdminProjetos({ ...params, pagina: 1, porPagina }),
              }))}
            />
          </div>
          <TabelaProjetosAdmin key={chave} linhas={linhas} />
          <Pagination
            pagina={params.pagina}
            totalPaginas={paginas}
            hrefPagina={(pagina) => montarHrefAdminProjetos({ ...params, pagina })}
          />
        </>
      )}
    </div>
  )
}
