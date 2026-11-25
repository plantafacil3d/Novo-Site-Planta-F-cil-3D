import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { Pagination } from '@/components/navigation/Pagination'
import { CollapsiblePanel } from '@/components/shared/CollapsiblePanel'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  AVISO_DE_AFILIADO,
  FormularioDeFiltrosLoja,
  GradeDeProdutos,
  LojaSkeleton,
  contarFiltrosNaLoja,
  descreverProdutos,
  listarFiltrosDaLoja,
  listarProdutosDaLoja,
  montarHrefLoja,
  temFiltrosNaLoja,
  type ParametrosLoja,
} from '@/features/produtos'
import { totalDePaginas } from '@/features/projetos'

import { LojaCasca } from './loja/LojaCasca'

/** Filtros e página de produtos chegam juntos (buscados em paralelo), como em `/projetos`. */
async function ListagemDaLoja({ params }: { params: ParametrosLoja }) {
  const [filtros, resultado] = await Promise.all([
    listarFiltrosDaLoja(),
    listarProdutosDaLoja(params),
  ])
  const paginas = totalDePaginas(resultado.total, resultado.porPagina)

  // Link antigo ou digitado à mão para uma página que não existe (mais); leva à última.
  if (resultado.total > 0 && params.pagina > paginas) {
    redirect(montarHrefLoja({ ...params, pagina: paginas }))
  }

  return (
    <div className="flex flex-col gap-6">
      <aside aria-label="Filtros">
        <CollapsiblePanel label="Filtros" count={contarFiltrosNaLoja(params)}>
          <FormularioDeFiltrosLoja params={params} filtros={filtros} />
        </CollapsiblePanel>
      </aside>

      {/* Âncora da paginação: trocar de página volta ao topo da lista. */}
      <section id="produtos" aria-label="Produtos" className="scroll-mt-4">
        {resultado.total === 0 ? (
          <EmptyState
            icon="sofa"
            title="Nenhum produto com esses filtros"
            description="Tente remover algum filtro ou buscar por outro nome."
            action={
              temFiltrosNaLoja(params) ? { label: 'Limpar filtros', href: '/loja' } : undefined
            }
          />
        ) : (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-fg-muted">{descreverProdutos(resultado)}</p>
            <GradeDeProdutos produtos={resultado.itens} />
            <Pagination
              pagina={params.pagina}
              totalPaginas={paginas}
              hrefPagina={(pagina) => `${montarHrefLoja({ ...params, pagina })}#produtos`}
            />
            <p className="text-sm text-fg-muted">{AVISO_DE_AFILIADO}</p>
          </div>
        )}
      </section>
    </div>
  )
}

/** Página pública `/loja`: filtros no topo (recolhidos no celular), grade de produtos e paginação. */
export function LojaView({ params }: { params: ParametrosLoja }) {
  // Muda a cada filtro ou página: o esqueleto volta enquanto carrega e o formulário (não
  // controlado) reflete a URL.
  const chave = montarHrefLoja(params)

  return (
    <LojaCasca>
      <Suspense key={chave} fallback={<LojaSkeleton />}>
        <ListagemDaLoja params={params} />
      </Suspense>
    </LojaCasca>
  )
}
