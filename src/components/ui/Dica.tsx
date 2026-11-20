'use client'

import { useId, useRef, type PointerEvent } from 'react'

import { cn } from './cn'
import { Icon } from './Icon'

/** Largura máxima do balão (`max-w-64`), para calcular a posição antes de ele aparecer. */
const LARGURA_DO_BALAO = 256
const MARGEM_DA_TELA = 8

type DicaProps = {
  /** O texto da explicação (curto: uma ou duas frases). */
  texto: string
  className?: string
}

/**
 * Ícone "i" que mostra uma explicação num balão, no lugar de um parágrafo sempre à vista (telas com
 * muito texto ficam poluídas). Abre ao passar o mouse, ao focar pelo teclado e ao tocar (celular); fecha
 * ao sair, com Esc ou tocando fora. O balão usa o `popover` nativo (como o `DropdownMenu`, mas no modo
 * `manual`): fica por cima de tudo e não é cortado pela rolagem. O leitor de tela lê o texto como descrição do botão.
 * Erro de campo NUNCA vai para cá: erro precisa estar sempre visível.
 */
export function Dica({ texto, className }: DicaProps) {
  const balaoId = useId()
  const botaoRef = useRef<HTMLButtonElement>(null)
  const balaoRef = useRef<HTMLDivElement>(null)

  function posicionar() {
    const botao = botaoRef.current
    const balao = balaoRef.current
    if (!botao || !balao) return
    const rect = botao.getBoundingClientRect()
    const largura = Math.min(LARGURA_DO_BALAO, window.innerWidth - MARGEM_DA_TELA * 2)
    const esquerda = rect.left + rect.width / 2 - largura / 2
    balao.style.top = `${rect.bottom + 4}px`
    balao.style.left = `${Math.min(
      Math.max(MARGEM_DA_TELA, esquerda),
      window.innerWidth - largura - MARGEM_DA_TELA,
    )}px`
  }

  const aberto = () => balaoRef.current?.matches(':popover-open') ?? false

  // Toque fora fecha (no celular não existe "tirar o mouse"). Vale só enquanto o balão está aberto.
  function fecharAoTocarFora(evento: globalThis.PointerEvent) {
    if (!botaoRef.current?.contains(evento.target as Node)) esconder()
  }

  function mostrar() {
    if (aberto()) return
    balaoRef.current?.showPopover()
    document.addEventListener('pointerdown', fecharAoTocarFora)
  }

  function esconder() {
    document.removeEventListener('pointerdown', fecharAoTocarFora)
    if (aberto()) balaoRef.current?.hidePopover()
  }
  // Só o mouse abre/fecha ao passar por cima: no toque, o "passar por cima" vem junto com o toque.
  const ehMouse = (evento: PointerEvent) => evento.pointerType === 'mouse'

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        aria-label="Mais informações"
        aria-describedby={balaoId}
        // Só abre: no toque, o foco já abriu o balão e um "alternar" o fecharia no mesmo gesto.
        onClick={mostrar}
        onPointerEnter={(evento) => {
          if (ehMouse(evento)) mostrar()
        }}
        onPointerLeave={(evento) => {
          if (ehMouse(evento)) esconder()
        }}
        onFocus={mostrar}
        onBlur={esconder}
        onKeyDown={(evento) => {
          if (evento.key === 'Escape') esconder()
        }}
        // Área de toque de 44px com o ícone de 16px: a margem negativa evita que ela empurre o texto ao lado.
        className={cn(
          '-m-3.5 inline-flex size-11 shrink-0 cursor-help items-center justify-center rounded-full text-fg-muted transition-colors duration-150 ease-standard hover:text-fg',
          className,
        )}
      >
        <Icon name="info" className="size-4" />
      </button>
      <div
        ref={balaoRef}
        id={balaoId}
        role="tooltip"
        // `manual`: o `auto` fecharia o balão ao tocar no próprio ícone e o clique o reabriria.
        popover="manual"
        onBeforeToggle={(evento) => {
          if (evento.newState === 'open') posicionar()
        }}
        className="fixed m-0 max-w-64 rounded-md border border-border bg-surface p-3 text-sm font-normal text-fg shadow-md"
      >
        {texto}
      </div>
    </>
  )
}
