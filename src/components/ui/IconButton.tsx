import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from './cn'
import { Icon, type IconName } from './Icon'

const iconButtonStyles = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      tone: {
        surface: 'bg-surface text-fg shadow-md hover:bg-subtle',
        inverse: 'bg-inverse/70 text-fg-inverse hover:bg-inverse',
      },
      size: {
        md: 'size-11',
        lg: 'size-16',
      },
    },
    defaultVariants: { tone: 'surface', size: 'md' },
  },
)

type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> &
  VariantProps<typeof iconButtonStyles> & {
    icon: IconName
    /** Nome acessível: o botão não tem texto visível (ex.: "Próxima foto"). */
    label: string
  }

/** Botão redondo só com ícone (setas, fechar, play). O `label` é obrigatório. */
export function IconButton({ icon, label, tone, size, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(iconButtonStyles({ tone, size }), className)}
      {...props}
    >
      <Icon name={icon} className={size === 'lg' ? 'size-7' : 'size-5'} />
    </button>
  )
}
