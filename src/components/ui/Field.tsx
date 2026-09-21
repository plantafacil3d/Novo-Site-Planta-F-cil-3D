import type { ReactNode } from 'react'

import { cn } from './cn'

type FieldProps = {
  /** Texto do rótulo. */
  label: string
  /** `id` do campo dentro do `Field`; liga o rótulo, a dica e o erro a ele. */
  htmlFor: string
  /** Ajuda curta abaixo do campo; some quando há erro. */
  hint?: string
  /** Mensagem de erro do campo; ligue o campo a ela com `aria-describedby={`${htmlFor}-erro`}`. */
  error?: string
  className?: string
  children: ReactNode
}

/** Rótulo + campo + dica ou erro. Envolve `Input`, `Select` ou `Textarea`. */
export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-erro`} className="text-sm text-danger-fg">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-fg-muted">{hint}</p>
      )}
    </div>
  )
}
