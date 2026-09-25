import { Suspense } from 'react'

import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { CollapsiblePanel } from '@/components/shared/CollapsiblePanel'
import {
  FiltrosAplicados,
  FiltrosSkeleton,
  FormularioDeFiltros,
  ProjetosSkeleton,
  contarFiltros,
  listarFiltrosAplicados,
  listarLimitesDeFiltro,
  montarHrefListagem,
  type ParametrosListagem,
} from '@/features/projetos'

import { ResultadosProjetos } from './projetos/ResultadosProjetos'

/** Só renderiza o formulário depois que os limites (menor/maior preço e área) chegarem do banco;
 *  numa `Suspense` própria, para buscar em paralelo com `ResultadosProjetos` em vez de antes dela. */
async function FiltrosComLimites({ params }: { params: ParametrosListagem }) {
  const limites = await listarLimitesDeFiltro()
  return <FormularioDeFiltros params={params} limites={limites} />
}

/** Página pública `/projetos`: filtros à esquerda (recolhidos no celular) e a lista paginada. */
export function ProjetosView({ params }: { params: ParametrosListagem }) {
  const filtrosAplicados = listarFiltrosAplicados(params)
  // Muda a cada filtro, ordem ou página. Como `key`, faz o painel fechar e o formulário refletir
  // a URL depois de aplicar ou remover um filtro, e faz o esqueleto aparecer enquanto carrega.
  const chave = montarHrefListagem(params)

  return (
    <div>
      <div className="mx-auto max-w-content px-4 pt-2">
        <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Projetos' }]} />
      </div>

      <div className="mx-auto max-w-content px-4 pt-4 pb-12 md:pb-16">
        <h1 className="text-3xl">Projetos prontos</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Plantas, fachadas e imagens 3D prontas para construir. Filtre por categoria, estilo,
          quartos, vagas e até pelo tamanho do seu terreno.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside aria-label="Filtros" className="lg:col-span-3">
            <CollapsiblePanel key={chave} label="Filtros" count={contarFiltros(params)}>
              <Suspense fallback={<FiltrosSkeleton />}>
                <FiltrosComLimites params={params} />
              </Suspense>
            </CollapsiblePanel>
          </aside>

          <div className="flex flex-col gap-6 lg:col-span-9">
            <FiltrosAplicados filtros={filtrosAplicados} />
            <Suspense key={chave} fallback={<ProjetosSkeleton />}>
              <ResultadosProjetos params={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
