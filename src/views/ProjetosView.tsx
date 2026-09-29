import { Suspense } from 'react'

import { CollapsiblePanel } from '@/components/shared/CollapsiblePanel'
import {
  FiltrosAplicados,
  FormularioDeFiltros,
  contarFiltros,
  listarFiltrosAplicados,
  listarLimitesDeFiltro,
  listarProjetos,
  montarHrefListagem,
  type ParametrosListagem,
} from '@/features/projetos'

import { ListagemEsqueleto, ProjetosCasca } from './projetos/ListagemEsqueleto'
import { ResultadosProjetos } from './projetos/ResultadosProjetos'

/** Busca os limites do filtro e a página de projetos em paralelo, mas só troca os esqueletos pela
 *  versão real quando os dois já chegaram — assim o filtro e a grade aparecem juntos, nunca um
 *  bem depois do outro (a busca dos limites é bem mais pesada: várias consultas ao banco). */
async function ListagemDeProjetos({ params }: { params: ParametrosListagem }) {
  const [limites, resultado] = await Promise.all([
    listarLimitesDeFiltro(),
    listarProjetos(params),
  ])

  return (
    <>
      <aside aria-label="Filtros" className="lg:col-span-3">
        <CollapsiblePanel label="Filtros" count={contarFiltros(params)}>
          <FormularioDeFiltros params={params} limites={limites} />
        </CollapsiblePanel>
      </aside>

      <div className="flex flex-col gap-6 lg:col-span-9">
        <FiltrosAplicados filtros={listarFiltrosAplicados(params)} />
        <ResultadosProjetos params={params} resultado={resultado} />
      </div>
    </>
  )
}

/** Página pública `/projetos`: filtros à esquerda (recolhidos no celular) e a lista paginada.
 *  A casca (trilha, título, texto) é a mesma do `loading.tsx` da rota, então só o miolo troca
 *  quando os dados chegam — sem o layout mudar de novo no meio do caminho. */
export function ProjetosView({ params }: { params: ParametrosListagem }) {
  // Muda a cada filtro, ordem ou página. Como `key`, faz o esqueleto aparecer de novo enquanto
  // a nova combinação carrega e o formulário (não controlado) refletir a URL depois de um filtro
  // aplicado ou removido.
  const chave = montarHrefListagem(params)

  return (
    <ProjetosCasca>
      <Suspense key={chave} fallback={<ListagemEsqueleto />}>
        <ListagemDeProjetos params={params} />
      </Suspense>
    </ProjetosCasca>
  )
}
