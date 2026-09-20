import { Skeleton } from '@/components/ui/Skeleton'

import { PROJETOS_POR_PAGINA } from '../rules'

/** Grade de cards "em branco" com o tamanho de uma página, para a tela não pular ao carregar. */
export function ProjetosSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Carregando projetos…</span>
      <ul aria-hidden="true" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: PROJETOS_POR_PAGINA }, (_, indice) => (
          <li key={indice} className="overflow-hidden rounded-lg border border-border bg-surface">
            <Skeleton className="aspect-4/3 rounded-none" />
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-11 w-32" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
