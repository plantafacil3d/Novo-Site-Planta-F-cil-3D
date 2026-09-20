'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '../ui/cn'

type TabItem = { id: string; label: string; content: ReactNode }

type TabsProps = {
  /** Nome acessível do grupo de abas (ex.: "Categorias da galeria"). */
  label: string
  items: TabItem[]
}

/**
 * Abas: só o conteúdo da aba ativa aparece. Setas, Home e End trocam de aba pelo teclado.
 * Todos os painéis ficam no HTML (só escondidos), para não sumirem dos buscadores.
 */
export function Tabs({ label, items }: TabsProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState(items[0]?.id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function selectByIndex(index: number) {
    const target = (index + items.length) % items.length
    const item = items[target]
    if (!item) return
    setActiveId(item.id)
    tabRefs.current[target]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight') selectByIndex(index + 1)
    else if (event.key === 'ArrowLeft') selectByIndex(index - 1)
    else if (event.key === 'Home') selectByIndex(0)
    else if (event.key === 'End') selectByIndex(items.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item, index) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'min-h-11 shrink-0 rounded-md px-4 text-sm font-medium transition-colors duration-150 ease-standard',
                selected ? 'bg-primary text-fg-inverse' : 'text-fg hover:bg-subtle',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="mt-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
