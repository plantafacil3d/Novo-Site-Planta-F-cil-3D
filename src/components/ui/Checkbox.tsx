import type { ComponentProps } from 'react'

import { cn } from './cn'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  /** Texto ao lado da caixa; a linha inteira é clicável. */
  label: string
}

/** Caixa de marcação com rótulo. A área de toque tem 44px de altura. */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex min-h-11 cursor-pointer items-center gap-3 text-sm', className)}>
      <input
        type="checkbox"
        className="size-5 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
        {...props}
      />
      {label}
    </label>
  )
}
