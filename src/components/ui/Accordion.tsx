import type { ReactNode } from 'react'

import { cn } from './cn'
import { Icon } from './Icon'

type AccordionProps = {
  items: { title: string; content: ReactNode; defaultOpen?: boolean }[]
  /** `inverse` para fundos escuros (landing com tema próprio). */
  tone?: 'default' | 'inverse'
  /** `chevron` (seta que gira 90°) no lugar do padrão +/−, para seguir uma referência visual. */
  icon?: 'plus-minus' | 'chevron'
  /** Sobrescreve cor/borda de cada item (ex.: `[&_details]:bg-[...]`), quando `tone` não basta. */
  className?: string
}

/**
 * Lista de perguntas que abrem e fecham (sanfona). Usa `<details>` nativo: funciona sem
 * JavaScript, é acessível pelo teclado e o texto já vem no HTML para os buscadores.
 */
export function Accordion({
  items,
  tone = 'default',
  icon = 'plus-minus',
  className,
}: AccordionProps) {
  const inverse = tone === 'inverse'

  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => (
        <li key={item.title}>
          <details
            open={item.defaultOpen}
            className={cn(
              'group rounded-md border',
              inverse ? 'border-fg-inverse/20 bg-inverse' : 'border-border bg-surface',
            )}
          >
            <summary
              className={cn(
                'flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 py-3 text-sm font-medium transition-colors duration-150 ease-standard [&::-webkit-details-marker]:hidden',
                inverse ? 'text-fg-inverse hover:bg-fg-inverse/10' : 'hover:bg-tint',
              )}
            >
              {item.title}
              {icon === 'chevron' ? (
                <Icon
                  name="chevron-right"
                  className="size-4 shrink-0 transition-transform duration-150 ease-standard group-open:rotate-90"
                />
              ) : (
                <>
                  <Icon name="plus" className="size-4 group-open:hidden" />
                  <Icon name="minus" className="hidden size-4 group-open:block" />
                </>
              )}
            </summary>
            <div
              className={cn('px-4 pb-4 text-sm', inverse ? 'text-fg-inverse/80' : 'text-fg-muted')}
            >
              {item.content}
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
