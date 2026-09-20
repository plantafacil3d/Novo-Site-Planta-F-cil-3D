import { Skeleton } from '@/components/ui/Skeleton'

/** Tabela em branco (20 linhas) para a tela não pular enquanto a lista carrega. */
export function ProjetosAdminSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">Carregando projetos…</span>
      <Skeleton className="h-11 w-full" />
      {Array.from({ length: 10 }, (_, indice) => (
        <Skeleton key={indice} className="h-10 w-full" />
      ))}
    </div>
  )
}
