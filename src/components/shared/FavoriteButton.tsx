'use client'

import { useState } from 'react'

import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

type FavoriteButtonProps = {
  /** `icon`: ex.: "Favoritar Casa Térrea Moderna" (nome acessível). `button`: texto visível, ex.: "Adicionar aos favoritos". */
  label: string
  /** `icon`: coração redondo sobre a imagem do card. `button`: botão largo com texto. */
  variant?: 'icon' | 'button'
}

/**
 * Coração de favoritar. Por enquanto só alterna o estado local: a persistência
 * (conta do usuário) ainda não existe.
 */
export function FavoriteButton({ label, variant = 'icon' }: FavoriteButtonProps) {
  const [active, setActive] = useState(false)
  const toggle = () => setActive((value) => !value)

  if (variant === 'button') {
    return (
      <Button
        variant="secondary"
        iconLeft="heart"
        aria-pressed={active}
        onClick={toggle}
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
      onClick={toggle}
      className="group/favorite inline-flex size-11 items-center justify-center"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-surface/90 text-fg shadow-sm transition-colors duration-150 ease-standard group-hover/favorite:text-primary">
        <Icon name="heart" className={cn('size-4', active && 'fill-primary text-primary')} />
      </span>
    </button>
  )
}
