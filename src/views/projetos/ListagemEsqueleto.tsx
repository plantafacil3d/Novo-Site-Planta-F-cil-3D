import type { ReactNode } from 'react'

import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { FiltrosSkeleton, ProjetosSkeleton } from '@/features/projetos'

/**
 * Casca da página `/projetos` (trilha, título, texto e a grade de duas colunas): igual nos dois
 * momentos em que aparece (o `loading.tsx` da rota e o `Suspense` de dentro da página), para trocar
 * só o miolo pelo conteúdo real, sem o layout mudar de novo no meio do caminho.
 */
export function ProjetosCasca({ children }: { children: ReactNode }) {
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

        <div className="mt-8 grid gap-8 lg:grid-cols-12">{children}</div>
      </div>
    </div>
  )
}

/** Esqueleto do filtro e da grade, do tamanho das duas colunas, para a tela não pular ao trocar
 *  pelo conteúdo real. Usado tanto no `loading.tsx` quanto no `Suspense` da página. */
export function ListagemEsqueleto() {
  return (
    <>
      <aside aria-label="Filtros" className="lg:col-span-3">
        <FiltrosSkeleton />
      </aside>
      <div className="lg:col-span-9">
        <ProjetosSkeleton />
      </div>
    </>
  )
}
