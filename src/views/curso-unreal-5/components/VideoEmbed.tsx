'use client'

import Image from 'next/image'
import { useState } from 'react'

import { embedDeVideo } from '@/components/shared/videoEmbed'
import { Icon } from '@/components/ui/Icon'

type VideoEmbedProps = {
  href: string
  thumbnail: string
  title: string
  /** Proporção da miniatura e do player: `horizontal` (16:9, padrão) ou `vertical` (9:16). */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * Miniatura clicável com ícone de play sobre a imagem; ao clicar, a própria miniatura vira o
 * player (sem modal, sem nova aba) e o vídeo toca ali, no lugar.
 * `thumbnail` é um arquivo de upload manual (ver manifesto em `data.ts`); enquanto não existir,
 * a imagem aparece quebrada no navegador — não quebra o build (caminho é string, não `import`).
 */
export function VideoEmbed({
  href,
  thumbnail,
  title,
  orientation = 'horizontal',
  className,
}: VideoEmbedProps) {
  const [tocando, setTocando] = useState(false)
  const aspectClassName = orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'

  if (tocando) {
    return (
      <iframe
        src={embedDeVideo(href)}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className={`overflow-hidden rounded-lg ${aspectClassName} ${className ?? ''}`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTocando(true)}
      aria-label={title}
      className={`group relative block overflow-hidden rounded-lg bg-[var(--course-bg-elevated)] ${aspectClassName} ${className ?? ''}`}
    >
      <Image
        src={thumbnail}
        alt=""
        fill
        sizes={
          orientation === 'vertical'
            ? '(min-width: 768px) 400px, 100vw'
            : '(min-width: 768px) 640px, 100vw'
        }
        className="object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-[#000]/30 transition-colors group-hover:bg-[#000]/40">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--white)]/90 shadow-lg">
          <Icon name="play" className="size-7 text-[var(--course-accent-deep)]" strokeWidth={2} />
        </span>
      </span>
    </button>
  )
}
