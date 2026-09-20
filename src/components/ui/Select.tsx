import type { ComponentProps } from 'react'

import { cn } from './cn'
import { Icon } from './Icon'

type SelectProps = ComponentProps<'select'> & { invalid?: boolean }

/** Lista de opções nativa (funciona sem JavaScript e no celular). Sempre acompanhe de um <label>. */
export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          'min-h-11 w-full appearance-none rounded-md border bg-surface pr-10 pl-3 text-base text-fg transition-colors duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-50',
          invalid ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted"
      />
    </div>
  )
}
