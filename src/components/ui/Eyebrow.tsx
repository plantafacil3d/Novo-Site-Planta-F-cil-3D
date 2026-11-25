import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from './cn'

const eyebrowStyles = cva('text-xs uppercase', {
  variants: {
    tone: {
      /** Verde vivo, para fundo escuro (hero e banners). */
      onDark: 'font-semibold tracking-eyebrow text-accent',
      /** Verde discreto e letras mais juntas, para fundo claro (títulos de seção). */
      onLight: 'font-bold tracking-eyebrow-light text-accent-muted',
    },
  },
  defaultVariants: { tone: 'onDark' },
})

type EyebrowProps = ComponentProps<'p'> & VariantProps<typeof eyebrowStyles>

/** Rótulo em caixa alta acima de títulos. */
export function Eyebrow({ tone, className, ...props }: EyebrowProps) {
  return <p className={cn(eyebrowStyles({ tone }), className)} {...props} />
}
