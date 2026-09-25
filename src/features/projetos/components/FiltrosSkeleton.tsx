import { Skeleton } from '@/components/ui/Skeleton'

/** Espaço reservado do formulário de filtros, do tamanho aproximado dele, para a tela não pular ao carregar. */
export function FiltrosSkeleton() {
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4"
    >
      <span className="sr-only">Carregando filtros…</span>
      {Array.from({ length: 6 }, (_, indice) => (
        <div key={indice} aria-hidden="true" className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}
