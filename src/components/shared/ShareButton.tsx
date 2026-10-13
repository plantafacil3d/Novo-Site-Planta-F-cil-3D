'use client'

import { useEffect, useState } from 'react'

import { IconButton } from '../ui/IconButton'

type ShareButtonProps = {
  /** Endereço completo (com `https://`) que será compartilhado ou copiado. */
  url: string
  /** Título enviado junto ao compartilhamento nativo, ex.: nome do projeto. */
  title: string
  /** Nome acessível, ex.: "Compartilhar Casa Térrea Moderna". */
  label: string
  /** Posicionamento feito por quem usa, ex.: `ml-auto` para ir ao canto direito da linha. */
  className?: string
}

/**
 * Botão pequeno só com ícone. Onde o aparelho tem menu de compartilhar (celular), abre esse menu;
 * nos demais (computador), copia o link e mostra um check por 2 segundos.
 */
export function ShareButton({ url, title, label, className }: ShareButtonProps) {
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!copiado) return
    const timer = setTimeout(() => setCopiado(false), 2000)
    return () => clearTimeout(timer)
  }, [copiado])

  async function compartilhar() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url })
      } catch {
        // Fechar o menu sem escolher nada também cai aqui; não há o que avisar.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
    } catch {
      // Sem permissão para copiar: o botão simplesmente não confirma.
    }
  }

  return (
    <>
      <IconButton
        icon={copiado ? 'check' : 'share'}
        label={copiado ? 'Link copiado' : label}
        tone="quiet"
        className={className}
        onClick={compartilhar}
      />
      <span role="status" className="sr-only">
        {copiado ? 'Link copiado' : ''}
      </span>
    </>
  )
}
