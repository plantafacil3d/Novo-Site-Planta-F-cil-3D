import Link from 'next/link'

import { Icon, type IconName } from '../ui/Icon'

type CategoryTileProps = {
  href: string
  label: string
  icon: IconName
}

/** Bloco clicável com ícone e rótulo (categorias de projeto). */
export function CategoryTile({ href, label, icon }: CategoryTileProps) {
  return (
    <Link
      href={href}
      className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg bg-tint p-4 text-center text-sm font-medium text-fg transition-shadow duration-150 ease-standard hover:shadow-md"
    >
      <Icon name={icon} className="size-8 text-primary" strokeWidth={1.5} />
      {label}
    </Link>
  )
}
