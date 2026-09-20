import { redirect } from 'next/navigation'

import { Pagination } from '@/components/navigation/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { Button } from '@/components/ui/Button'
import {
  PROJETOS_ADMIN_POR_PAGINA,
  TabelaProjetosAdmin,
  descreverListagem,
  formatarData,
  listarProjetosAdmin,
  montarHrefAdminProjetos,
  type ParametrosAdminProjetos,
} from '@/features/admin'
import { formatarPreco, tiposDeProjeto, totalDePaginas } from '@/features/projetos'

const rotulosDeTipo = Object.fromEntries(tiposDeProjeto.map((tipo) => [tipo.valor, tipo.rotulo]))

/** Aba Projetos do painel: título, "Cadastrar Projeto" (só visual), busca, tabela e paginação. */
export async function ProjetosAdminView({ params }: { params: ParametrosAdminProjetos }) {
  const resultado = await listarProjetosAdmin(params)
  const paginas = totalDePaginas(resultado.total, PROJETOS_ADMIN_POR_PAGINA)

  // Link antigo ou digitado à mão para uma página que não existe (mais); leva à última.
  if (resultado.total > 0 && params.pagina > paginas) {
    redirect(montarHrefAdminProjetos({ ...params, pagina: paginas }))
  }

  const linhas = resultado.itens.map((projeto) => ({
    ...projeto,
    precoFormatado: formatarPreco(projeto.precoCentavos),
    tipoRotulo: rotulosDeTipo[projeto.tipo] ?? projeto.tipo,
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
        {/* Só visual por enquanto: o formulário de cadastro vem quando o escopo estiver aprovado. */}
        <Button iconLeft="plus" disabled title="Em breve">
          Cadastrar Projeto
        </Button>
      </div>

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
          <p className="text-sm text-fg-muted">
            {descreverListagem(resultado.total, params.pagina, PROJETOS_ADMIN_POR_PAGINA)}
          </p>
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
