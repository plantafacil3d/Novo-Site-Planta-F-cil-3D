import { redirect } from 'next/navigation'

import { Pagination } from '@/components/navigation/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import {
  FormularioEnvioBiblioteca,
  POR_PAGINA_BIBLIOTECA,
  TabelaBibliotecaAdmin,
  descreverListagem,
  listarBibliotecaAdmin,
  montarHrefAdminBiblioteca,
  type ParametrosAdminBiblioteca,
} from '@/features/biblioteca-exemplos'
import { totalDePaginas } from '@/features/projetos'

type BibliotecaAdminViewProps = {
  params: ParametrosAdminBiblioteca
}

/** Tela "Biblioteca" do painel: envio de arquivos, busca, tabela e paginação. */
export async function BibliotecaAdminView({ params }: BibliotecaAdminViewProps) {
  const resultado = await listarBibliotecaAdmin(params)
  const paginas = totalDePaginas(resultado.total, POR_PAGINA_BIBLIOTECA)

  // Link antigo ou digitado à mão para uma página que não existe (mais); leva à última.
  if (resultado.total > 0 && params.pagina > paginas) {
    redirect(montarHrefAdminBiblioteca({ ...params, pagina: paginas }))
  }

  // Muda a cada busca ou página: a seleção da tabela recomeça vazia.
  const chave = montarHrefAdminBiblioteca(params)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl">Biblioteca</h1>
        <p className="mt-2 text-fg-muted">
          Envie aqui os arquivos de exemplo uma única vez e depois marque, em cada projeto, quais
          deles ficam disponíveis para download.
        </p>
      </div>

      <FormularioEnvioBiblioteca />

      <SearchBar
        key={chave}
        action="/admin/biblioteca"
        label="Buscar arquivos por nome"
        placeholder="Buscar por nome do arquivo"
        defaultValue={params.q}
      />

      {resultado.total === 0 ? (
        <EmptyState
          icon="layers"
          title="Nenhum arquivo encontrado"
          description={
            params.q
              ? 'Tente buscar por outro nome.'
              : 'Os arquivos enviados para a biblioteca vão aparecer aqui.'
          }
          action={params.q ? { label: 'Limpar busca', href: '/admin/biblioteca' } : undefined}
        />
      ) : (
        <>
          <p className="text-sm text-fg-muted">
            {descreverListagem(resultado.total, params.pagina, POR_PAGINA_BIBLIOTECA)}
          </p>
          <TabelaBibliotecaAdmin key={chave} linhas={resultado.itens} />
          <Pagination
            pagina={params.pagina}
            totalPaginas={paginas}
            hrefPagina={(pagina) => montarHrefAdminBiblioteca({ ...params, pagina })}
          />
        </>
      )}
    </div>
  )
}
