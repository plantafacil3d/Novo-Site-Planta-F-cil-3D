import { Skeleton } from '@/components/ui/Skeleton'

import { PRODUTOS_POR_PAGINA } from '../rules'

/** Faixa de filtros e grade de cards "em branco", do tamanho do conteúdo real da Loja. */
export function LojaSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Carregando produtos…</span>
      <Skeleton className="h-12 w-full lg:hidden" />
      <Skeleton className="hidden h-24 w-full rounded-lg lg:block" />
      <Skeleton className="h-4 w-48" />
      <ul
        aria-hidden="true"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {Array.from({ length: PRODUTOS_POR_PAGINA }, (_, indice) => (
          <li key={indice} className="overflow-hidden rounded-lg border border-border bg-surface">
            <Skeleton className="aspect-square rounded-none" />
            <div className="flex flex-col gap-2 p-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-11 w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
