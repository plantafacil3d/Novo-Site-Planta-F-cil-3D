'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { imagensTira, secaoReferencia } from '../data'

const conjuntosRepetidos = [0, 1, 2]
const VELOCIDADE_PX_POR_MS = 0.05

export function ReferenceStripSection() {
  const trilhoRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const arrastandoRef = useRef(false)
  const inicioArrasteXRef = useRef(0)
  const inicioArrasteValorRef = useRef(0)

  const aplicarX = (proximoX: number) => {
    const trilho = trilhoRef.current
    if (!trilho) return

    const larguraDeUmConjunto = trilho.scrollWidth / conjuntosRepetidos.length
    let x = proximoX
    if (larguraDeUmConjunto > 0) {
      while (x <= -larguraDeUmConjunto) x += larguraDeUmConjunto
      while (x > 0) x -= larguraDeUmConjunto
    }

    xRef.current = x
    trilho.style.transform = `translateX(${x}px)`
  }

  useEffect(() => {
    let frameId: number
    let ultimoTempo: number | null = null

    const passo = (tempo: number) => {
      if (ultimoTempo === null) ultimoTempo = tempo
      const delta = tempo - ultimoTempo
      ultimoTempo = tempo

      if (!arrastandoRef.current) {
        aplicarX(xRef.current - delta * VELOCIDADE_PX_POR_MS)
      }

      frameId = requestAnimationFrame(passo)
    }

    frameId = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(frameId)
  }, [])

  const handlePointerDown = (evento: React.PointerEvent<HTMLDivElement>) => {
    arrastandoRef.current = true
    inicioArrasteXRef.current = evento.clientX
    inicioArrasteValorRef.current = xRef.current
    evento.currentTarget.setPointerCapture(evento.pointerId)
  }

  const handlePointerMove = (evento: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastandoRef.current) return
    aplicarX(inicioArrasteValorRef.current + (evento.clientX - inicioArrasteXRef.current))
  }

  const handlePointerUp = (evento: React.PointerEvent<HTMLDivElement>) => {
    if (!arrastandoRef.current) return
    arrastandoRef.current = false
    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId)
    }
  }

  return (
    <section className="bg-page py-12 text-fg md:py-16">
      <div className="mx-auto max-w-content px-4 text-center">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">{secaoReferencia.title}</h2>
        <p className="mt-3 text-fg-muted">{secaoReferencia.description}</p>
      </div>

      <div
        className="mt-10 w-full overflow-hidden cursor-grab active:cursor-grabbing pb-2 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={trilhoRef} className="flex w-max items-center">
          {conjuntosRepetidos.map((indiceDoConjunto) => (
            <div key={indiceDoConjunto} className="flex shrink-0 gap-2 pr-2">
              {imagensTira.map((src) => (
                <div
                  key={`${indiceDoConjunto}-${src}`}
                  className="relative h-40 w-56 shrink-0 overflow-hidden rounded-md md:h-48 md:w-72"
                >
                  <Image
                    src={src}
                    alt="Projeto realizado pela DVIZ"
                    fill
                    sizes="288px"
                    className="pointer-events-none select-none object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
