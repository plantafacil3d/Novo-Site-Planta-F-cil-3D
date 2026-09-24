import type { ReactNode } from 'react'

import { Icon } from './Icon'

type AccordionProps = {
  items: { title: string; content: ReactNode }[]
}

/**
 * Lista de perguntas que abrem e fecham (sanfona). Usa `<details>` nativo: funciona sem
 * JavaScript, é acessível pelo teclado e o texto já vem no HTML para os buscadores.
 */
export function Accordion({ items }: AccordionProps) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.title}>
          <details className="group rounded-md border border-border bg-surface">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 py-3 text-sm font-medium transition-colors duration-150 ease-standard hover:bg-tint [&::-webkit-details-marker]:hidden">
              {item.title}
              <Icon name="plus" className="size-4 group-open:hidden" />
              <Icon name="minus" className="hidden size-4 group-open:block" />
            </summary>
            <div className="px-4 pb-4 text-sm text-fg-muted">{item.content}</div>
          </details>
        </li>
      ))}
    </ul>
  )
}
