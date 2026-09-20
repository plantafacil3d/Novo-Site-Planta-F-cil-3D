import { redirect } from 'next/navigation'

import { Pagination } from '@/components/navigation/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  ProjetosDestaque,
  descreverResultados,
  listarProjetos,
  montarHrefListagem,
  temFiltros,
  totalDePaginas,
  type ParametrosListagem,
} from '@/features/projetos'

/** Busca uma página do catálogo e mostra: quantidade, grade de cards e paginação (ou o estado vazio). */
export async function ResultadosProjetos({ params }: { params: ParametrosListagem }) {
  const resultado = await listarProjetos(params)
  const paginas = totalDePaginas(resultado.total, resultado.porPagina)

  // Link antigo ou digitado à mão para uma página que não existe (mais); leva à última.
  if (resultado.total > 0 && params.pagina > paginas) {
    redirect(montarHrefListagem({ ...params, pagina: paginas }))
  }

  if (resultado.total === 0) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado"
        description="Tente remover algum filtro ou buscar por outro nome ou código."
        action={temFiltros(params) ? { label: 'Limpar filtros', href: '/projetos' } : undefined}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-fg-muted">{descreverResultados(resultado)}</p>
      <ProjetosDestaque projetos={resultado.itens} className="lg:grid-cols-2 xl:grid-cols-3" />
      <Pagination
        pagina={params.pagina}
        totalPaginas={paginas}
        hrefPagina={(pagina) => montarHrefListagem({ ...params, pagina })}
      />
    </div>
  )
}
