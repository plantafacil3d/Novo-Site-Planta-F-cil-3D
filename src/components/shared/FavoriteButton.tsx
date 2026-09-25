'use client'

import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

type FavoriteButtonProps = {
  /** `icon`: ex.: "Favoritar Casa Térrea Moderna" (nome acessível). `button`: texto visível, ex.: "Adicionar aos favoritos". */
  label: string
  /** `icon`: coração redondo sobre a imagem do card. `button`: botão largo com texto. */
  variant?: 'icon' | 'button'
  /** Se o projeto já está favoritado. */
  active: boolean
  /** Enquanto a favoritação/desfavoritação está a caminho do servidor. */
  pending?: boolean
  onToggle: () => void
}

/**
 * Coração de favoritar, controlado: só sabe mostrar o estado e avisar o clique. Quem decide o que
 * "favoritar" significa (login, backend) é quem usa este componente (`features/favoritos`).
 */
export function FavoriteButton({ label, variant = 'icon', active, pending, onToggle }: FavoriteButtonProps) {
  if (variant === 'button') {
    return (
      <Button
        variant="secondary"
        iconLeft="heart"
        aria-pressed={active}
        loading={pending}
        onClick={onToggle}
        className="w-full aria-pressed:[&_svg]:fill-primary"
      >
        {label}
      </Button>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={pending}
      onClick={onToggle}
      className="group/favorite inline-flex size-11 items-center justify-center disabled:cursor-not-allowed"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-surface/90 text-fg shadow-sm transition-colors duration-150 ease-standard group-hover/favorite:text-primary">
        <Icon
          name={pending ? 'loader' : 'heart'}
          className={cn('size-4', pending && 'animate-spin', active && !pending && 'fill-primary text-primary')}
        />
      </span>
    </button>
  )
}
