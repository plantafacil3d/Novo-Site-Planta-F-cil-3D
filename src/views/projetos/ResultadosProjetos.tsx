import { redirect } from 'next/navigation'

import { Pagination } from '@/components/navigation/Pagination'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  ProjetosDestaque,
  descreverResultados,
  montarHrefListagem,
  temFiltros,
  totalDePaginas,
  type ParametrosListagem,
  type Projeto,
} from '@/features/projetos'
import type { Pagina } from '@/types/pagina'

/**
 * Largura real da foto do card nesta grade (container de 1200px, margem de 16px, vão de 24px; filtros
 * ocupam 3 das 12 colunas a partir de `lg`): 1 coluna até 639px, 2 até 1023px, 2 ao lado dos filtros
 * até 1279px (cresce com a tela) e 3 depois.
 */
const SIZES_DOS_CARDS = [
  '(min-width: 1280px) 274px',
  '(min-width: 1200px) 422px',
  '(min-width: 1024px) calc(37.5vw - 28px)',
  '(min-width: 640px) calc((100vw - 3.5rem) / 2)',
  'calc(100vw - 2rem)',
].join(', ')

/** Mostra a contagem, a grade de cards e a paginação de uma página já buscada (ou o estado vazio). */
export function ResultadosProjetos({
  params,
  resultado,
}: {
  params: ParametrosListagem
  resultado: Pagina<Projeto>
}) {
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
      <ProjetosDestaque
        projetos={resultado.itens}
        className="lg:grid-cols-2 xl:grid-cols-3"
        imageSizes={SIZES_DOS_CARDS}
      />
      <Pagination
        pagina={params.pagina}
        totalPaginas={paginas}
        hrefPagina={(pagina) => montarHrefListagem({ ...params, pagina })}
      />
    </div>
  )
}
