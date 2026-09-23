import { Skeleton } from '@/components/ui/Skeleton'

/** "Em branco" do topo da página de um projeto: galeria de um lado, dados e compra do outro. */
export function ProjetoDetalheSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Carregando projeto…</span>
      <div aria-hidden="true" className="grid gap-8 lg:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Skeleton className="aspect-4/3 w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-5">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
