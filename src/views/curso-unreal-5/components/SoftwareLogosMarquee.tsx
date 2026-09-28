'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { softwaresCompativeis } from '../data'

/** 3 cópias da lista: dá largura suficiente para o loop fechar arrastando em qualquer direção. */
const conjuntosRepetidos = [0, 1, 2]

const VELOCIDADE_PX_POR_MS = 0.05

export function SoftwareLogosMarquee() {
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
    <div
      className="curso-logos-faixa relative w-full max-w-xl cursor-grab overflow-hidden py-1 select-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <span className="sr-only">
        Compatível com {softwaresCompativeis.map((software) => software.nome).join(', ')}
      </span>

      <div ref={trilhoRef} aria-hidden="true" className="flex w-max items-center">
        {conjuntosRepetidos.map((indiceDoConjunto) => (
          <div key={indiceDoConjunto} className="flex shrink-0 items-center gap-12 pr-12">
            {softwaresCompativeis.map((software) => (
              <Image
                key={`${indiceDoConjunto}-${software.nome}`}
                src={software.logo}
                alt=""
                width={160}
                height={48}
                draggable={false}
                className="h-11 w-auto max-w-[170px] shrink-0 object-contain select-none md:h-12"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
