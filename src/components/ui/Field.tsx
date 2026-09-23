import type { ReactNode } from 'react'

import { cn } from './cn'
import { Icon, type IconName } from './Icon'

type FieldProps = {
  /** Texto do rótulo. */
  label: string
  /** `id` do campo dentro do `Field`; liga o rótulo, a dica e o erro a ele. */
  htmlFor: string
  /** Ajuda curta abaixo do campo; some quando há erro. */
  hint?: string
  /** Mensagem de erro do campo; ligue o campo a ela com `aria-describedby={`${htmlFor}-erro`}`. */
  error?: string
  /** Contador de caracteres à direita, abaixo do campo (ex.: "35/120"). */
  counter?: string
  /** Ícone ao lado do rótulo, para identificar o campo de relance. */
  icon?: IconName
  className?: string
  children: ReactNode
}

/** Rótulo + campo + dica ou erro. Envolve `Input`, `Select` ou `Textarea`. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  counter,
  icon,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium">
        {icon && <Icon name={icon} className="size-4 text-fg-muted" />}
        {label}
      </label>
      {children}
      {(error || hint || counter) && (
        <div className="flex items-start justify-between gap-3">
          {error ? (
            <p id={`${htmlFor}-erro`} className="text-sm text-danger-fg">
              {error}
            </p>
          ) : (
            <p className="text-sm text-fg-muted">{hint}</p>
          )}
          {counter && <p className="ml-auto shrink-0 text-sm text-fg-muted">{counter}</p>}
        </div>
      )}
    </div>
  )
}
