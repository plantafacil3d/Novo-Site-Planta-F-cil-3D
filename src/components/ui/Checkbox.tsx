import type { ComponentProps } from 'react'

import { cn } from './cn'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  /** Texto ao lado da caixa; a linha inteira é clicável. */
  label: string
  /** Esconde o texto (só leitores de tela o leem). Para caixas em tabelas, onde o contexto é a linha. */
  hideLabel?: boolean
}

/** Caixa de marcação com rótulo. A área de toque tem 44px de altura. */
export function Checkbox({ label, hideLabel, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-center gap-3 text-sm',
        hideLabel && 'min-w-11 justify-center',
        className,
      )}
    >
      <input
        type="checkbox"
        className="size-5 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
        {...props}
      />
      {hideLabel ? <span className="sr-only">{label}</span> : label}
    </label>
  )
}
