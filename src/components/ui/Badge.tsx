import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from './cn'

const badgeStyles = cva('inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      solid: 'bg-primary text-fg-inverse',
      accent: 'bg-accent text-fg',
      success: 'bg-badge-success-bg text-badge-success-fg',
      draft: 'border border-draft-border bg-badge-draft-bg text-badge-draft-fg',
      discount: 'bg-badge-discount-bg text-badge-discount-fg',
      neutral: 'border border-border bg-subtle text-fg-muted',
    },
  },
  defaultVariants: { variant: 'solid' },
})

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeStyles>

/** Selo curto sobre imagens (Mais vendido, Lançamento). Sempre com texto. */
export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ variant }), className)} {...props} />
}
