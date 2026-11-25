import { Skeleton } from '@/components/ui/Skeleton'

export default function ProdutoFormLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
