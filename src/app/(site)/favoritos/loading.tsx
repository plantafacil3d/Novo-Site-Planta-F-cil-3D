import { Skeleton } from '@/components/ui/Skeleton'

export default function FavoritosLoading() {
  return (
    <div role="status" className="mx-auto max-w-content px-4 py-8">
      <span className="sr-only">Carregando favoritos…</span>
      <div aria-hidden="true" className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-11 w-24" />
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, indice) => (
            <li key={indice} className="overflow-hidden rounded-lg border border-border bg-surface">
              <Skeleton className="aspect-4/3 rounded-none" />
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
