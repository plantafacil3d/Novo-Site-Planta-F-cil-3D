import type { ComponentProps } from 'react'

import { cn } from './cn'

/** Rótulo em caixa alta acima de títulos (hero e banners). Cor `accent`, pensada para fundo escuro. */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-xs font-semibold tracking-[0.12em] text-accent uppercase', className)}
      {...props}
    />
  )
}
