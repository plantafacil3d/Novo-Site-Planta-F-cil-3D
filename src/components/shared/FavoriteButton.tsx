'use client'

import { useState } from 'react'

import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

type FavoriteButtonProps = {
  /** Ex.: "Favoritar Casa Térrea Moderna". */
  label: string
}

/**
 * Coração de favoritar. Por enquanto só alterna o estado local: a persistência
 * (conta do usuário) ainda não existe.
 */
export function FavoriteButton({ label }: FavoriteButtonProps) {
  const [active, setActive] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={() => setActive((value) => !value)}
      className="group/favorite inline-flex size-11 items-center justify-center"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-surface/90 text-fg shadow-sm transition-colors duration-150 ease-standard group-hover/favorite:text-primary">
        <Icon name="heart" className={cn('size-4', active && 'fill-primary text-primary')} />
      </span>
    </button>
  )
}
