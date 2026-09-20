import Link from 'next/link'

import { Icon } from '../ui/Icon'

type LogoProps = {
  nome: string
  tagline?: string
}

/** Marca do site para fundos escuros. Provisória: trocar pelo arquivo oficial do logotipo. */
export function Logo({ nome, tagline }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${nome}: página inicial`}
      className="inline-flex items-center gap-2 text-fg-inverse"
    >
      <Icon name="house" className="size-8 text-accent sm:size-10" strokeWidth={1.5} />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-lg font-bold whitespace-nowrap sm:text-xl">{nome}</span>
        {tagline && <span className="hidden text-xs text-fg-inverse/80 sm:block">{tagline}</span>}
      </span>
    </Link>
  )
}
