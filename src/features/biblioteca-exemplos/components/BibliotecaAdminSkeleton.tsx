import { Skeleton } from '@/components/ui/Skeleton'

/** Tabela em branco (10 linhas) para a tela não pular enquanto a biblioteca carrega. */
export function BibliotecaAdminSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">Carregando biblioteca…</span>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-11 w-full" />
      {Array.from({ length: 10 }, (_, indice) => (
        <Skeleton key={indice} className="h-10 w-full" />
      ))}
    </div>
  )
}
