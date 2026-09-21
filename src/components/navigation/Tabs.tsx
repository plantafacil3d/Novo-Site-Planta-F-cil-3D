'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

/** Situação da aba, para o marcador ao lado do nome: completa, com pendência ou opcional. */
type TabStatus = 'complete' | 'pending' | 'optional'

type TabItem = { id: string; label: string; content: ReactNode; status?: TabStatus }

type TabsProps = {
  /** Nome acessível do grupo de abas (ex.: "Categorias da galeria"). */
  label: string
  items: TabItem[]
  /** `vertical`: menu ao lado do conteúdo a partir de `lg` (faixa rolável no celular). */
  orientation?: 'horizontal' | 'vertical'
  /** Aba ativa, para quem controla as abas de fora (ex.: botões "Anterior" e "Próxima etapa"). */
  value?: string
  onValueChange?: (id: string) => void
  /** Conteúdo abaixo dos painéis, na mesma coluna (ex.: botões de navegação e de salvar). */
  footer?: ReactNode
}

const marcadores = {
  complete: (
    <>
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-fg">
        <Icon name="check" className="size-3" />
      </span>
      <span className="sr-only">(completa)</span>
    </>
  ),
  pending: (
    <>
      <span className="size-5 shrink-0 rounded-full border-2 border-border-strong" />
      <span className="sr-only">(pendente)</span>
    </>
  ),
  optional: <span className="shrink-0 text-xs opacity-70">Opcional</span>,
} as const

/**
 * Abas: só o conteúdo da aba ativa aparece. Setas, Home e End trocam de aba pelo teclado.
 * Todos os painéis ficam no HTML (só escondidos), para não sumirem dos buscadores.
 * Sem `value`, cuida da aba ativa sozinha. Com `value`, quem usa decide, e a troca vinda de fora
 * leva a tela ao topo do painel e move o foco para ele.
 */
export function Tabs({
  label,
  items,
  orientation = 'horizontal',
  value,
  onValueChange,
  footer,
}: TabsProps) {
  const baseId = useId()
  const vertical = orientation === 'vertical'
  const [interno, setInterno] = useState(items[0]?.id)
  const activeId = value ?? interno
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const painelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const anterior = useRef(activeId)
  const trocouPelaAba = useRef(false)

  function ativar(id: string) {
    // Clicar na aba que já está ativa não muda nada; sem esta guarda o aviso ficaria armado à toa.
    if (id !== activeId) trocouPelaAba.current = true
    setInterno(id)
    onValueChange?.(id)
  }

  // Troca vinda de fora (botões do rodapé): o foco vai para o painel novo, para leitor de tela e teclado.
  useEffect(() => {
    if (anterior.current === activeId) return
    anterior.current = activeId
    if (trocouPelaAba.current) {
      trocouPelaAba.current = false
      return
    }
    const painel = activeId ? painelRefs.current[activeId] : null
    painel?.focus({ preventScroll: true })
    painel?.scrollIntoView({ block: 'start' })
  }, [activeId])

  function selectByIndex(index: number) {
    const target = (index + items.length) % items.length
    const item = items[target]
    if (!item) return
    ativar(item.id)
    tabRefs.current[target]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const proxima = vertical ? 'ArrowDown' : 'ArrowRight'
    const anteriorTecla = vertical ? 'ArrowUp' : 'ArrowLeft'
    // No celular o menu vertical vira faixa horizontal: as setas dos dois eixos funcionam.
    if (event.key === proxima || (vertical && event.key === 'ArrowRight')) selectByIndex(index + 1)
    else if (event.key === anteriorTecla || (vertical && event.key === 'ArrowLeft'))
      selectByIndex(index - 1)
    else if (event.key === 'Home') selectByIndex(0)
    else if (event.key === 'End') selectByIndex(items.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div
      className={cn(
        vertical && 'flex flex-col gap-6 lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-8',
      )}
    >
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        className={cn(
          // `relative`: o texto só para leitor de tela (sr-only) é absoluto e, sem isto, escapa da rolagem.
          'relative flex gap-2 overflow-x-auto pb-1',
          vertical &&
            'lg:sticky lg:top-8 lg:flex-col lg:overflow-visible lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:p-2 lg:pb-2',
        )}
      >
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
              onClick={() => ativar(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-3 rounded-md px-4 text-sm font-medium transition-colors duration-150 ease-standard',
                vertical && 'lg:w-full lg:justify-between lg:text-left',
                selected ? 'bg-primary text-fg-inverse' : 'text-fg hover:bg-subtle',
              )}
            >
              {item.label}
              {item.status && marcadores[item.status]}
            </button>
          )
        })}
      </div>

      <div className="min-w-0">
        {items.map((item) => (
          <div
            key={item.id}
            ref={(element) => {
              painelRefs.current[item.id] = element
            }}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            hidden={item.id !== activeId}
            tabIndex={vertical ? -1 : undefined}
            className={cn(vertical ? 'scroll-mt-4 outline-none' : 'mt-6')}
          >
            {item.content}
          </div>
        ))}
        {footer}
      </div>
    </div>
  )
}
