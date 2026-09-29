'use client'

import { useId, useState } from 'react'

import { TextoFormatado } from './TextoFormatado'

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
    return <TextoFormatado texto={texto} className={className} />
  }

  let cortado = texto.slice(0, limite).replace(/\s+\S*$/, '')
  // Cortar no meio de um `*negrito*` deixaria um asterisco solto aparecendo na tela.
  if ((cortado.match(/\*/g) ?? []).length % 2 === 1) {
    cortado =
      cortado.slice(0, cortado.lastIndexOf('*')) + cortado.slice(cortado.lastIndexOf('*') + 1)
  }

  return (
    <div>
      <TextoFormatado
        id={conteudoId}
        texto={aberto ? texto : `${cortado}…`}
        className={className}
      />
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
