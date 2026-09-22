'use client'

import { useId, useRef } from 'react'
import Link from 'next/link'

import { cn } from './cn'
import { Icon, type IconName } from './Icon'
import { IconButton } from './IconButton'

export type DropdownMenuItem = {
  key: string
  label: string
  icon?: IconName
  /** Item vira link (navega); sem `href`, vira botão e chama `onSelect`. */
  href?: string
  onSelect?: () => void
  /** `danger` só muda a cor do texto (tom de atenção); vermelho sólido fica só no `DialogoDeConfirmacao`. */
  tone?: 'default' | 'danger'
  disabled?: boolean
}

type DropdownMenuProps = {
  /** Nome acessível do botão (⋮) e do painel, ex.: "Ações de Sobrado com Piscina". */
  label: string
  items: DropdownMenuItem[]
  disabled?: boolean
}

/** Largura fixa do painel (`w-52`): usada para calcular a posição antes de ele aparecer. */
const LARGURA_DO_PAINEL = 208

const itemStyles = (tone: DropdownMenuItem['tone']) =>
  cn(
    'flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition-colors duration-150 ease-standard hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50',
    tone === 'danger' ? 'text-danger-fg' : 'text-fg',
  )

/**
 * Menu de contexto (botão ⋮ + painel de ações). O painel usa o `popover` nativo do navegador (como
 * o `<dialog>` do `Modal`): aparece por cima de tudo (não é cortado pela rolagem da tabela) e fecha
 * sozinho com Esc ou clique fora, sem código extra. A posição é calculada perto do botão que abriu.
 */
export function DropdownMenu({ label, items, disabled }: DropdownMenuProps) {
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function posicionar() {
    const wrapper = wrapperRef.current
    const painel = panelRef.current
    if (!wrapper || !painel) return
    const rect = wrapper.getBoundingClientRect()
    painel.style.top = `${rect.bottom + 4}px`
    painel.style.left = `${Math.max(8, rect.right - LARGURA_DO_PAINEL)}px`
  }

  function selecionar(item: DropdownMenuItem) {
    panelRef.current?.hidePopover()
    item.onSelect?.()
  }

  return (
    <div ref={wrapperRef}>
      <IconButton
        icon="more-vertical"
        label={label}
        disabled={disabled}
        className="bg-transparent shadow-none"
        popoverTarget={panelId}
        aria-haspopup="true"
      />
      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        aria-label={label}
        onBeforeToggle={(evento) => {
          if (evento.newState === 'open') posicionar()
        }}
        className="fixed m-0 w-52 rounded-md border border-border bg-surface p-1 shadow-md"
      >
        {items.map((item) =>
          item.href ? (
            <Link key={item.key} href={item.href} className={itemStyles(item.tone)}>
              {item.icon && <Icon name={item.icon} className="size-4 shrink-0" />}
              {item.label}
            </Link>
          ) : (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              className={itemStyles(item.tone)}
              onClick={() => selecionar(item)}
            >
              {item.icon && <Icon name={item.icon} className="size-4 shrink-0" />}
              {item.label}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
