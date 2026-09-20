'use client'

import { useId, useState, type ReactNode } from 'react'

import { Button } from '../ui/Button'
import { cn } from '../ui/cn'

type CollapsiblePanelProps = {
  /** Texto do botão que abre e fecha (ex.: "Filtros"). */
  label: string
  /** Quantos itens estão ativos dentro do painel; aparece ao lado do rótulo. */
  count?: number
  children: ReactNode
}

/**
 * No celular, o conteúdo fica atrás de um botão; a partir de `lg` ele aparece sempre aberto e o
 * botão some. O conteúdo é renderizado no servidor e só a abertura é estado do navegador.
 */
export function CollapsiblePanel({ label, count = 0, children }: CollapsiblePanelProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div>
      <Button
        variant="secondary"
        iconLeft="sliders"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((atual) => !atual)}
        className="w-full lg:hidden"
      >
        {count > 0 ? `${label} (${count})` : label}
      </Button>
      <div id={panelId} className={cn('lg:block', open ? 'mt-3 block' : 'hidden')}>
        {children}
      </div>
    </div>
  )
}
