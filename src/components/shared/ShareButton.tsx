'use client'

import { useEffect, useState } from 'react'

import { cn } from '../ui/cn'
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
 * Botão redondo com contorno e só ícone. Onde o aparelho tem menu de compartilhar (celular), abre
 * esse menu; nos demais (computador), copia o link, troca o ícone por um check e mostra um
 * balãozinho "Link copiado!" por 2 segundos.
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
    <span className={cn('relative inline-flex', className)}>
      <IconButton
        icon={copiado ? 'check' : 'share'}
        label={copiado ? 'Link copiado' : label}
        tone="outline"
        // Círculo de 32px; o `after` estica a área de toque para 44px sem aumentar o desenho.
        className={cn(
          'relative size-8 after:absolute after:-inset-1.5',
          copiado && 'bg-tint text-primary hover:bg-tint',
        )}
        onClick={compartilhar}
      />
      {/* Balão só visual (o aviso para leitor de tela é o `role="status"` logo abaixo). */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-full right-0 z-10 mt-2 rounded-md bg-inverse px-3 py-1.5 text-xs font-medium whitespace-nowrap text-fg-inverse shadow-md',
          'transition duration-150 ease-standard',
          copiado ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
        )}
      >
        Link copiado!
      </span>
      <span role="status" className="sr-only">
        {copiado ? 'Link copiado' : ''}
      </span>
    </span>
  )
}
