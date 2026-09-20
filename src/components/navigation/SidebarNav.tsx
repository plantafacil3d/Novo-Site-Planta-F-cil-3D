'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '../ui/cn'
import { Icon, type IconName } from '../ui/Icon'

export type SidebarItem = {
  label: string
  icon: IconName
  /** Sem `href` o item é estático: aparece no menu, mas ainda não leva a lugar nenhum. */
  href?: string
}

type SidebarNavProps = {
  items: SidebarItem[]
  label: string
}

/**
 * Menu lateral para fundo escuro (painel do administrador). No celular vira uma faixa horizontal
 * rolável; a partir de `lg`, uma coluna. A página atual usa `aria-current`.
 */
export function SidebarNav({ items, label }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label={label}>
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items.map((item) => (
          <li key={item.label} className="shrink-0">
            {item.href ? (
              <Link
                href={item.href}
                aria-current={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'page'
                    : undefined
                }
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-fg-inverse transition-colors duration-150 ease-standard hover:bg-fg-inverse/10 aria-[current=page]:bg-fg-inverse/15"
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={cn(
                  'flex min-h-11 cursor-not-allowed items-center gap-3 rounded-md px-3 text-sm font-medium text-fg-inverse/60',
                )}
              >
                <Icon name={item.icon} className="size-5" />
                {item.label}
                <span className="text-xs lg:ml-auto">Em breve</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
