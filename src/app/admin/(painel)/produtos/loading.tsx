import { Skeleton } from '@/components/ui/Skeleton'

export default function ProdutosAdminLoading() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Carregando produtos…</span>
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-11 w-40" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
