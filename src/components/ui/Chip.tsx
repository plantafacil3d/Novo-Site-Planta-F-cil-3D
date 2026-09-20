import Link from 'next/link'

import { Icon } from './Icon'

type ChipProps = {
  /** Destino ao clicar (nos filtros aplicados: a mesma página sem este filtro). */
  href: string
  label: string
  /** Texto só para leitor de tela, no lugar do "x" (ex.: "Remover filtro"). */
  removeLabel: string
}

/** Filtro aplicado em forma de etiqueta; o clique o remove. É um link, então funciona sem JavaScript. */
export function Chip({ href, label, removeLabel }: ChipProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-tint px-3 text-sm font-medium transition-colors duration-150 ease-standard hover:bg-subtle"
    >
      {label}
      <Icon name="close" className="size-4" />
      <span className="sr-only">{removeLabel}</span>
    </Link>
  )
}
