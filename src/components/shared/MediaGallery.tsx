'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { IconButton } from '../ui/IconButton'
import { Modal } from '../ui/Modal'
import { Lightbox } from './Lightbox'

type Media = { src: string; alt: string }

type MediaGalleryProps = {
  images: Media[]
  /** Com vídeo, aparece o botão "Assistir vídeo" sobre a foto. */
  video?: { src: string }
  /** Nome acessível da galeria (ex.: "Fotos do Sobrado Moderno 7x20"). */
  label: string
}

// Quantas miniaturas aparecem; o resto fica atrás do "+N".
const MAX_THUMBNAILS = 6

/**
 * Galeria do topo da página: foto grande com setas, miniaturas, "+N" para ver todas em tela
 * cheia e botão de vídeo. A primeira foto carrega com prioridade (é a maior da página).
 */
export function MediaGallery({ images, video, label }: MediaGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [videoOpen, setVideoOpen] = useState(false)

  const total = images.length
  const thumbnails = images.slice(0, MAX_THUMBNAILS)
  const hidden = total - MAX_THUMBNAILS
  const firstHidden = images[MAX_THUMBNAILS]
  const current = images[index]

  function closeLightbox() {
    // Ao fechar, a foto grande acompanha a última vista no visualizador.
    if (lightboxIndex !== null) setIndex(lightboxIndex)
    setLightboxIndex(null)
  }

  if (!current) return null

  return (
    <div role="group" aria-label={label}>
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-subtle">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />

        <Button
          variant="primary"
          iconLeft="maximize"
          onClick={() => setLightboxIndex(index)}
          className="absolute top-3 left-3"
        >
          Ver em tela cheia
        </Button>

        {video && (
          <Button
            variant="primary"
            iconLeft="play"
            onClick={() => setVideoOpen(true)}
            className="absolute right-3 bottom-3"
          >
            Assistir vídeo
          </Button>
        )}

        {total > 1 && (
          <>
            <IconButton
              icon="chevron-left"
              label="Foto anterior"
              onClick={() => setIndex((index - 1 + total) % total)}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            />
            <IconButton
              icon="chevron-right"
              label="Próxima foto"
              onClick={() => setIndex((index + 1) % total)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            />
          </>
        )}
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {thumbnails.map((image, thumbIndex) => (
          <li key={`${thumbIndex}-${image.src}`}>
            <button
              type="button"
              aria-label={`Ver foto ${thumbIndex + 1} de ${total}`}
              aria-current={thumbIndex === index}
              onClick={() => setIndex(thumbIndex)}
              className={cn(
                'relative block aspect-4/3 w-full overflow-hidden rounded-md border-2',
                thumbIndex === index ? 'border-primary' : 'border-transparent',
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 640px) 8vw, 25vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}

        {firstHidden && (
          <li>
            <button
              type="button"
              aria-label={`Ver todas as ${total} fotos`}
              onClick={() => setLightboxIndex(MAX_THUMBNAILS)}
              className="relative block aspect-4/3 w-full overflow-hidden rounded-md text-sm font-semibold text-fg-inverse"
            >
              <Image
                src={firstHidden.src}
                alt=""
                fill
                sizes="(min-width: 640px) 8vw, 25vw"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-inverse/70">
                +{hidden}
              </span>
            </button>
          </li>
        )}
      </ul>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={closeLightbox}
        label={label}
      />

      {video && (
        <Modal open={videoOpen} onClose={() => setVideoOpen(false)} label="Vídeo do projeto">
          <video src={video.src} controls autoPlay playsInline className="aspect-video w-full" />
        </Modal>
      )}
    </div>
  )
}
