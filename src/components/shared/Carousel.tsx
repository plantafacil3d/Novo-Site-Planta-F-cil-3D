'use client'

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '../ui/cn'
import { IconButton } from '../ui/IconButton'

type CarouselProps = {
  /** Nome acessível da faixa (ex.: "Projetos relacionados"). */
  label: string
  /** Classes de largura de cada item (ex.: "w-72"). */
  itemClassName: string
  children: ReactNode
}

/**
 * Faixa horizontal rolável, com encaixe item a item. No celular rola com o dedo; a partir de
 * `md` aparecem setas quando há mais itens para os lados.
 */
export function Carousel({ label, itemClassName, children }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ canPrev: false, canNext: false })

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
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {Children.toArray(children).map((child, index) => (
          <li key={index} className={cn('shrink-0 snap-start', itemClassName)}>
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
