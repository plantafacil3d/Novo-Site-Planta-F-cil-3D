'use client'

import { useId, useState } from 'react'

type TextoExpansivelProps = {
  texto: string
  /** Quantos caracteres aparecem antes do "Ver mais" (corta na última palavra inteira). */
  limite?: number
  className?: string
}

/** Texto longo com corte por caracteres; um botão abaixo revela ou esconde o restante. */
export function TextoExpansivel({ texto, limite = 280, className }: TextoExpansivelProps) {
  const [aberto, setAberto] = useState(false)
  const conteudoId = useId()

  if (texto.length <= limite) {
    return <p className={className}>{texto}</p>
  }

  const cortado = texto.slice(0, limite).replace(/\s+\S*$/, '')

  return (
    <div>
      <p id={conteudoId} className={className}>
        {aberto ? texto : `${cortado}…`}
      </p>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={conteudoId}
        onClick={() => setAberto((atual) => !atual)}
        className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
      >
        {aberto ? 'Ver menos' : 'Ver mais'}
      </button>
    </div>
  )
}
