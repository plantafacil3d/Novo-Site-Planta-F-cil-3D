'use client'

import { useState, type DragEvent } from 'react'

type Opcoes = {
  aoReordenar: (idOrigem: string, idDestino: string) => void
}

/** O que `handleProps` devolve: vai direto num elemento arrastável (ex.: `<button {...alca}>`). */
export type AlcaDeArrasto = {
  draggable: true
  onDragStart: (evento: DragEvent) => void
  onDragEnd: () => void
}

/**
 * Reordenar uma lista arrastando, com o Drag and Drop nativo do navegador (sem lib). `handleProps`
 * vai na alça que inicia o arraste (só ela; o resto do item não arrasta); `itemProps` vai no
 * elemento que se move, para aceitar o item solto em cima dele.
 */
export function useArrastarParaReordenar({ aoReordenar }: Opcoes) {
  const [arrastando, setArrastando] = useState<string | null>(null)

  function handleProps(id: string): AlcaDeArrasto {
    return {
      draggable: true,
      onDragStart: (evento: DragEvent) => {
        evento.dataTransfer.effectAllowed = 'move'
        setArrastando(id)
      },
      onDragEnd: () => setArrastando(null),
    }
  }

  function itemProps(id: string) {
    return {
      onDragOver: (evento: DragEvent) => {
        if (arrastando && arrastando !== id) evento.preventDefault()
      },
      onDrop: (evento: DragEvent) => {
        evento.preventDefault()
        if (arrastando && arrastando !== id) aoReordenar(arrastando, id)
        setArrastando(null)
      },
    }
  }

  return { arrastando, handleProps, itemProps }
}
