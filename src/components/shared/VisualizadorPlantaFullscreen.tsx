'use client'

import Image from 'next/image'
import { useRef, useState, type Touch, type TouchEvent } from 'react'

import { IconButton } from '../ui/IconButton'
import { Modal } from '../ui/Modal'

type VisualizadorPlantaFullscreenProps = {
  images: { src: string; alt: string }[]
  /** Planta aberta; `null` = fechado. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Nome acessível da janela (ex.: "Planta humanizada do projeto X"). */
  label: string
}

const ESCALA_MIN = 1
const ESCALA_MAX = 4
/** Arraste horizontal mínimo (px), sem zoom, para trocar de pavimento. */
const LIMIAR_DE_SWIPE = 50

const distanciaEntre = (a: Touch, b: Touch) =>
  Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

type Gesto = {
  distanciaInicial: number
  escalaInicial: number
  pontoInicial: { x: number; y: number }
  deslocamentoInicial: { x: number; y: number }
}

/**
 * Planta em tela cheia para celular: fica girada na horizontal (`rotate(90deg)`, sem depender da
 * Screen Orientation API, inconsistente no Safari) e aceita zoom por pinça e arraste com o dedo.
 * Sem zoom, arrastar na horizontal troca de pavimento. Setas e "X de Y" só com 2+ pavimentos.
 */
export function VisualizadorPlantaFullscreen({
  images,
  index,
  onIndexChange,
  onClose,
  label,
}: VisualizadorPlantaFullscreenProps) {
  const total = images.length
  const current = index === null ? undefined : images[index]
  const [escala, setEscala] = useState(1)
  const [deslocamento, setDeslocamento] = useState({ x: 0, y: 0 })
  const gesto = useRef<Gesto | null>(null)

  function reiniciarZoom() {
    setEscala(1)
    setDeslocamento({ x: 0, y: 0 })
  }

  function go(step: number) {
    if (index === null || total === 0) return
    reiniciarZoom()
    onIndexChange((index + step + total) % total)
  }

  function aoTocarInicio(evento: TouchEvent) {
    const t0 = evento.touches.item(0)
    const t1 = evento.touches.item(1)
    if (t1 && t0) {
      gesto.current = {
        distanciaInicial: distanciaEntre(t0, t1),
        escalaInicial: escala,
        pontoInicial: { x: 0, y: 0 },
        deslocamentoInicial: deslocamento,
      }
    } else if (t0) {
      gesto.current = {
        distanciaInicial: 0,
        escalaInicial: escala,
        pontoInicial: { x: t0.clientX, y: t0.clientY },
        deslocamentoInicial: deslocamento,
      }
    }
  }

  function aoMoverToque(evento: TouchEvent) {
    if (!gesto.current) return
    const t0 = evento.touches.item(0)
    const t1 = evento.touches.item(1)
    if (t1 && t0) {
      const fator = distanciaEntre(t0, t1) / gesto.current.distanciaInicial
      setEscala(Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, gesto.current.escalaInicial * fator)))
      evento.preventDefault()
    } else if (t0 && escala > 1) {
      // A imagem está girada: um arraste na tela (x, y) move o conteúdo no eixo local trocado.
      const dxTela = t0.clientX - gesto.current.pontoInicial.x
      const dyTela = t0.clientY - gesto.current.pontoInicial.y
      setDeslocamento({
        x: gesto.current.deslocamentoInicial.x + dyTela,
        y: gesto.current.deslocamentoInicial.y - dxTela,
      })
      evento.preventDefault()
    }
  }

  function aoSoltarToque(evento: TouchEvent) {
    const t0 = evento.changedTouches[0]
    if (escala === 1 && gesto.current && evento.changedTouches.length === 1 && t0) {
      const deltaX = t0.clientX - gesto.current.pontoInicial.x
      if (Math.abs(deltaX) > LIMIAR_DE_SWIPE) go(deltaX < 0 ? 1 : -1)
    }
    gesto.current = null
  }

  return (
    <Modal open={index !== null} onClose={onClose} label={label}>
      {current && index !== null && (
        <div
          className="relative aspect-square w-full touch-none overflow-hidden bg-inverse-strong"
          onTouchStart={aoTocarInicio}
          onTouchMove={aoMoverToque}
          onTouchEnd={aoSoltarToque}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `rotate(90deg) scale(${escala}) translate(${deslocamento.x}px, ${deslocamento.y}px)`,
            }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              unoptimized
              className="object-contain"
            />
          </div>

          {total > 1 && (
            <>
              <IconButton
                icon="chevron-left"
                label="Pavimento anterior"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-2 -translate-y-1/2"
              />
              <IconButton
                icon="chevron-right"
                label="Próximo pavimento"
                onClick={() => go(1)}
                className="absolute top-1/2 right-2 -translate-y-1/2"
              />
              <p
                aria-live="polite"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-inverse/70 px-2.5 py-1 text-xs font-medium text-fg-inverse"
              >
                {index + 1} de {total}
              </p>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
