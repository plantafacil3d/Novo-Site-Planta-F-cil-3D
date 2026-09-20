import Link from 'next/link'

import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

type LogoProps = {
  nome: string
  tagline?: string
  /** `inverse` (padrão) para fundos escuros; `default` para fundos claros. */
  tone?: 'inverse' | 'default'
}

/** Marca do site. Provisória: trocar pelo arquivo oficial do logotipo. */
export function Logo({ nome, tagline, tone = 'inverse' }: LogoProps) {
  const inverse = tone === 'inverse'

  return (
    <Link
      href="/"
      aria-label={`${nome}: página inicial`}
      className={cn('inline-flex items-center gap-2', inverse ? 'text-fg-inverse' : 'text-fg')}
    >
      <Icon
        name="house"
        className={cn('size-8 sm:size-10', inverse ? 'text-accent' : 'text-primary')}
        strokeWidth={1.5}
      />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-lg font-bold whitespace-nowrap sm:text-xl">{nome}</span>
        {tagline && (
          <span
            className={cn(
              'hidden text-xs sm:block',
              inverse ? 'text-fg-inverse/80' : 'text-fg-muted',
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
