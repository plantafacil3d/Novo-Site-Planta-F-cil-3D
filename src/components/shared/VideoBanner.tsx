'use client'

import Image from 'next/image'
import { useId, useState } from 'react'

import { IconButton } from '../ui/IconButton'
import { Modal } from '../ui/Modal'
import { embedDeVideo } from './videoEmbed'

type VideoBannerProps = {
  title: string
  description: string
  /** Imagem de fundo do bloco. */
  image: { src: string; alt: string }
  videoSrc: string
}

/** Bloco escuro com imagem ao fundo e um grande botão de play que abre o vídeo em uma janela. */
export function VideoBanner({ title, description, image, videoSrc }: VideoBannerProps) {
  const headingId = useId()
  const [open, setOpen] = useState(false)

  return (
    <section aria-labelledby={headingId} className="py-12 md:py-16">
      <div className="mx-auto max-w-content px-4">
        <div className="relative isolate flex min-h-72 flex-col overflow-hidden rounded-lg bg-inverse text-fg-inverse md:min-h-80">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1200px) 1168px, 100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-inverse/80 md:bg-transparent md:bg-linear-to-r md:from-inverse md:via-inverse/70 md:to-transparent"
          />

          <div className="max-w-md p-6 md:p-10">
            <h2 id={headingId} className="text-2xl md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-fg-inverse/80">{description}</p>
          </div>

          <IconButton
            icon="play"
            size="lg"
            label="Assistir ao vídeo do projeto"
            onClick={() => setOpen(true)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 md:top-1/2 md:bottom-auto md:-translate-y-1/2 [&_svg]:fill-current"
          />
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} label="Vídeo do projeto">
        <iframe
          src={embedDeVideo(videoSrc)}
          title="Vídeo do projeto"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </Modal>
    </section>
  )
}
