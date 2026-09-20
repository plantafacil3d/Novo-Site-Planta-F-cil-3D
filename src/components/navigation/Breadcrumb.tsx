import Link from 'next/link'

import { Icon } from '../ui/Icon'

export type BreadcrumbItem = {
  label: string
  /** Sem `href` = página atual. */
  href?: string
}

/** Trilha "Início › Projetos › Sobrados › Projeto". O último item é a página atual. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Você está aqui">
      <ol className="flex flex-wrap items-center text-sm text-fg-muted">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center">
            {index > 0 && <Icon name="chevron-right" className="mx-1 size-4" />}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-11 items-center hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-fg">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
