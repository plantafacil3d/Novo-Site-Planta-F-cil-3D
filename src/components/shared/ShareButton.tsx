'use client'

import { useEffect, useState } from 'react'

import { cn } from '../ui/cn'
import { IconButton } from '../ui/IconButton'

/** O que é compartilhado: quem tem o projeto monta uma vez e entrega aos botões e visualizadores. */
export type DadosDeCompartilhamento = {
  /** Endereço completo (com `https://`) que será compartilhado ou copiado. */
  url: string
  /** Título enviado junto ao compartilhamento nativo, ex.: nome do projeto. */
  title: string
  /** Nome acessível, ex.: "Compartilhar Casa Térrea Moderna". */
  label: string
}

type ShareButtonProps = DadosDeCompartilhamento & {
  /**
   * `visualizador`: para os visualizadores em tela cheia (`Lightbox`, plantas). Mesmo botão escuro
   * de 44px dos outros controles de lá, e o balão "Link copiado!" aparece acima, porque o botão
   * fica colado na base da tela.
   */
  variant?: 'default' | 'visualizador'
  /** Posicionamento feito por quem usa, ex.: `ml-auto` para ir ao canto direito da linha. */
  className?: string
}

/**
 * Botão redondo com contorno e só ícone. Onde o aparelho tem menu de compartilhar (celular), abre
 * esse menu; nos demais (computador), copia o link, troca o ícone por um check e mostra um
 * balãozinho "Link copiado!" por 2 segundos.
 */
export function ShareButton({
  url,
  title,
  label,
  variant = 'default',
  className,
}: ShareButtonProps) {
  const [copiado, setCopiado] = useState(false)
  const noVisualizador = variant === 'visualizador'

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
        tone={noVisualizador ? 'inverse' : 'outline'}
        // Padrão: círculo de 32px; o `after` estica a área de toque para 44px sem aumentar o
        // desenho. No visualizador, o 44px do próprio `IconButton`.
        className={cn(
          'relative',
          !noVisualizador && 'size-8 after:absolute after:-inset-1.5',
          copiado && 'bg-tint text-primary hover:bg-tint',
        )}
        onClick={compartilhar}
      />
      {/* Balão só visual (o aviso para leitor de tela é o `role="status"` logo abaixo). */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute right-0 z-10 rounded-md bg-inverse px-3 py-1.5 text-xs font-medium whitespace-nowrap text-fg-inverse shadow-md',
          'transition duration-150 ease-standard',
          noVisualizador ? 'bottom-full mb-2' : 'top-full mt-2',
          copiado
            ? 'translate-y-0 opacity-100'
            : cn('opacity-0', noVisualizador ? 'translate-y-1' : '-translate-y-1'),
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
