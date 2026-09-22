'use client'

import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from './cn'
import { IconButton } from './IconButton'

type ModalProps = {
  open: boolean
  onClose: () => void
  /** Nome acessível do diálogo (ex.: "Fotos do projeto"). */
  label: string
  /**
   * Cor da moldura: `inverse` (padrão) é o escuro de foto e vídeo em tela cheia; `surface` é o
   * claro, para diálogos de texto.
   */
  tone?: 'inverse' | 'surface'
  children: ReactNode
  className?: string
}

/**
 * Janela por cima da página, feita com o `<dialog>` nativo: o foco fica preso dentro, Esc fecha
 * e o clique no fundo escuro também. O conteúdo só existe enquanto aberto (vídeo para de tocar).
 */
export function Modal({ open, onClose, label, tone = 'inverse', children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()

    if (!open) return
    // Sem isso a página de trás continua rolando com a roda do mouse.
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflowAnterior
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto max-h-dvh w-full max-w-5xl bg-transparent p-0 backdrop:bg-overlay"
    >
      {open && (
        <div
          className={cn(
            'relative overflow-hidden rounded-lg',
            tone === 'inverse' ? 'bg-inverse-strong' : 'bg-surface',
            className,
          )}
        >
          {children}
          <IconButton
            icon="close"
            label="Fechar"
            tone={tone}
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
          />
        </div>
      )}
    </dialog>
  )
}
