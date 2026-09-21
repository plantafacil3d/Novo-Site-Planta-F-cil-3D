import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from './cn'
import { Icon, type IconName } from './Icon'

const alertStyles = cva('flex items-start gap-3 rounded-md border px-4 py-3 text-sm', {
  variants: {
    variant: {
      success:
        'border-notification-success-border bg-notification-success-bg text-notification-success-fg',
      error: 'border-notification-error-border bg-notification-error-bg text-notification-error-fg',
      warning:
        'border-notification-warning-border bg-notification-warning-bg text-notification-warning-fg',
      info: 'border-notification-info-border bg-notification-info-bg text-notification-info-fg',
    },
  },
  defaultVariants: { variant: 'info' },
})

const icones: Record<NonNullable<VariantProps<typeof alertStyles>['variant']>, IconName> = {
  success: 'circle-check',
  error: 'circle-alert',
  warning: 'circle-alert',
  info: 'info',
}

const iconeStyles = {
  success: 'text-notification-success-icon',
  error: 'text-notification-error-icon',
  warning: 'text-notification-warning-icon',
  info: 'text-notification-info-icon',
} as const

type AlertProps = VariantProps<typeof alertStyles> & Omit<ComponentProps<'div'>, 'title'>

/**
 * Aviso em faixa (sucesso, erro, atenção ou informação). `error` usa `role="alert"` (lido na hora);
 * as demais usam `role="status"`. Aceita `ref` e `tabIndex={-1}` para receber o foco quando aparece.
 */
export function Alert({ variant = 'info', className, children, ...props }: AlertProps) {
  const tipo = variant ?? 'info'
  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={cn(alertStyles({ variant: tipo }), className)}
      {...props}
    >
      <Icon name={icones[tipo]} className={cn('mt-0.5 size-5', iconeStyles[tipo])} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
