import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from './cn'
import { Icon, type IconName } from './Icon'

const iconeEmBlocoStyles = cva('inline-flex shrink-0 items-center justify-center text-fg-inverse', {
  variants: {
    tone: {
      amber: 'bg-tile-amber',
      blue: 'bg-tile-blue',
      green: 'bg-tile-green',
      violet: 'bg-tile-violet',
      slate: 'bg-tile-slate',
      red: 'bg-tile-red',
      orange: 'bg-tile-orange',
      pink: 'bg-tile-pink',
      cyan: 'bg-tile-cyan',
      teal: 'bg-tile-teal',
    },
    size: {
      /** 42px, ícone 20px (selos em cartão, escolha de ícone no cadastro). */
      md: 'size-10.5 rounded-md [&>svg]:size-5',
      /** 64px, ícone 28px, com sombra suave (cartões de projetos complementares). */
      lg: 'size-16 rounded-lg shadow-soft [&>svg]:size-7',
    },
  },
  defaultVariants: { tone: 'green', size: 'md' },
})

export type TomDoIconeEmBloco = NonNullable<VariantProps<typeof iconeEmBlocoStyles>['tone']>

type IconeEmBlocoProps = VariantProps<typeof iconeEmBlocoStyles> & {
  icon: IconName
  className?: string
}

/** Ícone branco num quadrado arredondado colorido. Decorativo: o texto ao lado diz o que é. */
export function IconeEmBloco({ icon, tone, size, className }: IconeEmBlocoProps) {
  return (
    <span aria-hidden="true" className={cn(iconeEmBlocoStyles({ tone, size }), className)}>
      <Icon name={icon} />
    </span>
  )
}
