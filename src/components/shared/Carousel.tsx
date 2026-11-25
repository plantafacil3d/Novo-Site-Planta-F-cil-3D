'use client'

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

import { cn } from '../ui/cn'
import { IconButton } from '../ui/IconButton'

type CarouselProps = {
  /** Nome acessível da faixa (ex.: "Projetos relacionados"). */
  label: string
  /** Classes de largura de cada item (ex.: "w-72"). */
  itemClassName: string
  /** No computador, permite clicar e arrastar a faixa com o mouse (além das setas). */
  dragToScroll?: boolean
  /** A partir de `lg`, quantos itens cabem inteiros lado a lado (sobrepõe a largura de `itemClassName`). */
  desktopColumns?: 4 | 6
  children: ReactNode
}

/** Largura do item para N por vez: (100% − os vãos de `gap-4`, 1rem cada) ÷ N. Fica aqui porque
 *  depende do vão da faixa, que é deste componente. */
const LARGURA_POR_COLUNAS = {
  4: 'lg:w-[calc((100%-3rem)/4)]',
  6: 'lg:w-[calc((100%-5rem)/6)]',
} as const

/** Quanto o mouse precisa andar (px) para virar arraste; abaixo disso ainda é um clique. */
const LIMIAR_DO_ARRASTE = 5

/**
 * Faixa horizontal rolável, com encaixe item a item. No celular rola com o dedo; a partir de
 * `md` aparecem setas quando há mais itens para os lados. Com `dragToScroll`, o mouse também arrasta.
 */
export function Carousel({
  label,
  itemClassName,
  dragToScroll,
  desktopColumns,
  children,
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ canPrev: false, canNext: false })
  // Arraste com o mouse: ponto de partida e se já passou do limiar (para não abrir o link ao soltar).
  const drag = useRef<{ x: number; scrollLeft: number; moved: boolean } | null>(null)
  const justDragged = useRef(false)

  function startDrag(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current
    if (!dragToScroll || !track || event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, scrollLeft: track.scrollLeft, moved: false }
    justDragged.current = false
  }

  function moveDrag(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current
    const current = drag.current
    if (!track || !current) return
    const dx = event.clientX - current.x
    if (!current.moved) {
      if (Math.abs(dx) < LIMIAR_DO_ARRASTE) return
      current.moved = true
      track.setPointerCapture(event.pointerId)
      // Sem o encaixe durante o arraste, a faixa acompanha o mouse; ao soltar, volta a encaixar.
      track.style.scrollSnapType = 'none'
    }
    track.scrollLeft = current.scrollLeft - dx
  }

  function endDrag(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current
    const current = drag.current
    drag.current = null
    if (!track || !current?.moved) return
    justDragged.current = true
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
    // Desliza até o item mais próximo de onde o arraste parou e volta a ligar o encaixe.
    const items = Array.from(track.children) as HTMLElement[]
    const nearest = items.reduce((best, item) =>
      Math.abs(item.offsetLeft - track.scrollLeft) < Math.abs(best.offsetLeft - track.scrollLeft)
        ? item
        : best,
    )
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: nearest.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' })
    window.setTimeout(() => (track.style.scrollSnapType = ''), reduceMotion ? 0 : 400)
  }

  /** Soltar o mouse depois de arrastar não conta como clique no card. */
  function blockClickAfterDrag(event: MouseEvent) {
    if (!justDragged.current) return
    justDragged.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const canPrev = track.scrollLeft > 1
    const canNext = track.scrollLeft + track.clientWidth < track.scrollWidth - 1
    setEdges((current) =>
      current.canPrev === canPrev && current.canNext === canNext ? current : { canPrev, canNext },
    )
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // Avisa também quando a faixa muda de tamanho (janela, aba que passou a ser exibida).
    const observer = new ResizeObserver(updateEdges)
    observer.observe(track)
    return () => observer.disconnect()
  }, [updateEdges])

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div role="region" aria-label={label} className="relative">
      <ul
        ref={trackRef}
        onScroll={updateEdges}
        {...(dragToScroll && {
          onPointerDown: startDrag,
          onPointerMove: moveDrag,
          onPointerUp: endDrag,
          onPointerCancel: endDrag,
          onClickCapture: blockClickAfterDrag,
          // Sem isto, o navegador "pega" a foto ou o link para arrastar em vez de rolar a faixa.
          onDragStart: (event: DragEvent) => event.preventDefault(),
        })}
        // `relative`: textos só para leitores de tela (posição absoluta, ex.: "abre em nova aba" do
        // botão) ficam presos na faixa; sem isso escapam dela e alargam a página no celular.
        className={cn(
          'relative flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden',
          dragToScroll && 'select-none md:cursor-grab md:active:cursor-grabbing',
        )}
      >
        {Children.toArray(children).map((child, index) => (
          <li
            key={index}
            className={cn(
              'shrink-0 snap-start',
              itemClassName,
              desktopColumns && LARGURA_POR_COLUNAS[desktopColumns],
            )}
          >
            {child}
          </li>
        ))}
      </ul>

      {edges.canPrev && (
        <IconButton
          icon="chevron-left"
          label="Anterior"
          onClick={() => scrollByPage(-1)}
          className="absolute top-1/2 left-2 hidden -translate-y-1/2 md:inline-flex"
        />
      )}
      {edges.canNext && (
        <IconButton
          icon="chevron-right"
          label="Próximo"
          onClick={() => scrollByPage(1)}
          className="absolute top-1/2 right-2 hidden -translate-y-1/2 md:inline-flex"
        />
      )}
    </div>
  )
}
