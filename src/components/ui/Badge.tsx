import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from './cn'

const badgeStyles = cva('inline-flex items-center rounded-sm px-2.5 py-1 font-semibold', {
  variants: {
    variant: {
      solid: 'bg-primary text-fg-inverse',
      /** Pílula branca sobre a foto, mais arredondada (e, no `sm`, um pouco mais alta) que os
       *  outros selos (ex.: "Você está vendo" no card da variação do projeto). */
      surface: 'rounded-md bg-surface text-fg',
      accent: 'bg-accent text-fg',
      success: 'bg-badge-success-bg text-badge-success-fg',
      draft: 'border border-draft-border bg-badge-draft-bg text-badge-draft-fg',
      discount: 'bg-badge-discount-bg text-badge-discount-fg',
      neutral: 'border border-border bg-subtle text-fg-muted',
    },
    size: {
      sm: 'text-xs',
      /** Texto maior e em negrito (ex.: medida do terreno "12×30m" no card da variação). */
      md: 'text-sm leading-tight font-bold',
    },
  },
  // A entrelinha vem depois do tamanho de letra: se viesse antes, o `cn` a descartaria.
  compoundVariants: [{ variant: 'surface', size: 'sm', class: 'leading-normal' }],
  defaultVariants: { variant: 'solid', size: 'sm' },
})

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeStyles>

/** Selo curto sobre imagens (Mais vendido, Lançamento). Sempre com texto. */
export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ variant, size }), className)} {...props} />
}
