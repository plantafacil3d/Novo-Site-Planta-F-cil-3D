'use client'

import { useId, useRef } from 'react'

import { cn } from '@/components/ui/cn'
import { Icon, type IconName } from '@/components/ui/Icon'

import { useIdioma, type LanguageCode } from '../hooks/useIdioma'

type Idioma = { code: LanguageCode; label: string; flag: IconName }

const IDIOMAS: Idioma[] = [
  { code: 'pt', label: 'Português', flag: 'flag-br' },
  { code: 'en', label: 'English', flag: 'flag-us' },
  { code: 'es', label: 'Español', flag: 'flag-es' },
  { code: 'fr', label: 'Français', flag: 'flag-fr' },
  { code: 'it', label: 'Italiano', flag: 'flag-it' },
  { code: 'de', label: 'Deutsch', flag: 'flag-de' },
  { code: 'ja', label: '日本語', flag: 'flag-jp' },
  { code: 'zh-CN', label: '中文', flag: 'flag-cn' },
]

/** Largura fixa do painel (`w-44`): usada para calcular a posição antes de ele aparecer. */
const LARGURA_DO_PAINEL = 176

/**
 * Dropdown de idiomas com a cara do site. Por baixo, comanda o widget escondido do Google
 * Translate (`services/translate`, via `useIdioma`). Mesma técnica de posicionamento do
 * `DropdownMenu` (`ui/`): painel com `popover` nativo, sem código de fechar/travar rolagem.
 */
export function SeletorDeIdioma() {
  const { idiomaAtivo, trocarIdioma } = useIdioma()
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const atual = IDIOMAS.find((idioma) => idioma.code === idiomaAtivo) ?? IDIOMAS[0]!

  function posicionar() {
    const wrapper = wrapperRef.current
    const painel = panelRef.current
    if (!wrapper || !painel) return
    const rect = wrapper.getBoundingClientRect()
    painel.style.top = `${rect.bottom + 4}px`
    painel.style.left = `${Math.max(8, rect.right - LARGURA_DO_PAINEL)}px`
  }

  function selecionar(code: LanguageCode) {
    panelRef.current?.hidePopover()
    trocarIdioma(code)
  }

  return (
    <div ref={wrapperRef} className="notranslate" translate="no">
      <button
        type="button"
        aria-haspopup="true"
        aria-label="Escolher idioma"
        popoverTarget={panelId}
        className="inline-flex h-11 items-center gap-1.5 rounded-md px-2 text-fg-muted transition-colors duration-150 ease-standard hover:bg-subtle hover:text-fg"
      >
        <Icon name={atual.flag} className="size-4 shrink-0 rounded-xs" />
        <span className="hidden text-sm font-medium sm:inline">{atual.code.toUpperCase()}</span>
        <Icon name="chevron-down" className="size-4" />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        aria-label="Idiomas disponíveis"
        onBeforeToggle={(evento) => {
          if (evento.newState === 'open') posicionar()
        }}
        className="fixed m-0 w-44 rounded-md border border-border bg-surface p-1 shadow-md"
      >
        {IDIOMAS.map((idioma) => (
          <button
            key={idioma.code}
            type="button"
            onClick={() => selecionar(idioma.code)}
            className={cn(
              'flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition-colors duration-150 ease-standard hover:bg-subtle',
              idioma.code === atual.code ? 'text-fg' : 'text-fg-muted',
            )}
          >
            <Icon name={idioma.flag} className="size-4 shrink-0 rounded-xs" />
            {idioma.label}
            {idioma.code === atual.code && <Icon name="check" className="ml-auto size-4" />}
          </button>
        ))}
      </div>
    </div>
  )
}
