'use client'

import { useEffect, useId, useState, type ReactNode } from 'react'

import { Icon } from '../ui/Icon'
import { MainNav, type NavItem } from './MainNav'

type MobileMenuProps = {
  items: NavItem[]
  /** Botão de conta pronto; o clique nele fecha o menu. */
  cta: ReactNode
}

/** Menu recolhível para telas < lg. O painel abre logo abaixo do header (que é `relative`). */
export function MobileMenu({ items, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-150 ease-standard hover:bg-subtle"
      >
        <Icon name={open ? 'close' : 'menu'} className="size-6" />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-4 border-t border-border bg-page px-4 py-4 shadow-md"
        >
          <MainNav
            items={items}
            label="Menu"
            orientation="vertical"
            onNavigate={() => setOpen(false)}
          />
          <div className="flex flex-col" onClick={() => setOpen(false)}>
            {cta}
          </div>
        </div>
      )}
    </div>
  )
}
