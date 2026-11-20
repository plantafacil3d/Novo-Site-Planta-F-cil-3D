import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from './cn'

const avatarStyles = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-fg-inverse select-none',
  {
    variants: {
      tone: {
        green: 'bg-avatar-green',
        blue: 'bg-avatar-blue',
        amber: 'bg-avatar-amber',
        /** Círculo "+" (mais pessoas) na faixa de prova social. */
        highlight: 'bg-highlight',
        instagram:
          'bg-linear-45 from-avatar-instagram-from via-avatar-instagram-via to-avatar-instagram-to',
      },
      size: {
        sm: 'size-7.5 text-xs',
        md: 'size-9 text-sm',
      },
    },
    defaultVariants: { tone: 'green', size: 'sm' },
  },
)

type AvatarProps = VariantProps<typeof avatarStyles> & {
  /** Até 2 letras (ex.: "MA"). */
  iniciais: string
  className?: string
}

/**
 * Círculo com as iniciais de uma pessoa. Decorativo (`aria-hidden`): o nome sempre aparece em texto ao
 * lado, então o leitor de tela não precisa ouvir as iniciais.
 */
export function Avatar({ iniciais, tone, size, className }: AvatarProps) {
  return (
    <span aria-hidden="true" className={cn(avatarStyles({ tone, size }), className)}>
      {iniciais}
    </span>
  )
}
