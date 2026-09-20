import type { ComponentProps } from 'react'

import { cn } from './cn'

type InputProps = ComponentProps<'input'> & { invalid?: boolean }

/** Campo de texto. Sempre acompanhe de um <label> (visível ou `sr-only`). */
export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-11 w-full rounded-md border bg-surface px-3 text-base text-fg transition-colors duration-150 ease-standard placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    />
  )
}
