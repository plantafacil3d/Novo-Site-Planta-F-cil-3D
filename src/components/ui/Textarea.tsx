import type { ComponentProps } from 'react'

import { cn } from './cn'

type TextareaProps = ComponentProps<'textarea'> & { invalid?: boolean }

/** Campo de texto longo. Sempre acompanhe de um <label> (use o `Field`). */
export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-28 w-full resize-y rounded-md border bg-surface px-3 py-3 text-base text-fg transition-colors duration-150 ease-standard placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50',
        invalid ? 'border-danger' : 'border-border',
        className,
      )}
      {...props}
    />
  )
}
