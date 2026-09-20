import { cn } from './cn'

/** Bloco cinza pulsante que ocupa o lugar do conteúdo enquanto ele carrega. Dê forma com `className`. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-border', className)} />
}
