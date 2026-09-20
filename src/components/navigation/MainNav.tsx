'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '../ui/cn'

export type NavItem = { label: string; href: string }

type MainNavProps = {
  items: NavItem[]
  /** Nome do landmark para leitores de tela (o menu mobile usa outro). */
  label?: string
  orientation?: 'horizontal' | 'vertical'
  onNavigate?: () => void
}

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

/** Navegação principal para fundo escuro, com a página atual marcada por `aria-current`. */
export function MainNav({
  items,
  label = 'Principal',
  orientation = 'horizontal',
  onNavigate,
}: MainNavProps) {
  const pathname = usePathname()
  const vertical = orientation === 'vertical'

  return (
    <nav aria-label={label}>
      <ul className={cn('flex gap-1', vertical ? 'flex-col' : 'items-center gap-6')}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              className={cn(
                'relative inline-flex min-h-11 items-center text-sm font-medium text-fg-inverse/80 transition-colors duration-150 ease-standard hover:text-fg-inverse aria-[current=page]:text-fg-inverse',
                vertical
                  ? 'w-full rounded-md px-3 hover:bg-fg-inverse/10 aria-[current=page]:bg-fg-inverse/10'
                  : 'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent after:opacity-0 aria-[current=page]:after:opacity-100',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
