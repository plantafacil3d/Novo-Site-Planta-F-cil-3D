'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { IconButton } from '../ui/IconButton'
import { Modal } from '../ui/Modal'
import { Lightbox } from './Lightbox'
import { embedDeVideo } from './videoEmbed'

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
  const proxima = total > 1 ? images[(index + 1) % total] : null
  const anterior = total > 1 ? images[(index - 1 + total) % total] : null

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
          // Sem otimização: a foto já vem pronta do Storage, e passar pelo proxy de resize do
          // Next a cada troca (busca remota + processamento) é o que travava a navegação nas setas.
          unoptimized
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

      {/* Pré-carrega a foto anterior e a próxima para as setas trocarem sem espera. */}
      {(proxima || anterior) && (
        <div aria-hidden className="pointer-events-none absolute size-px overflow-hidden opacity-0">
          {proxima && (
            <div className="relative aspect-4/3">
              <Image src={proxima.src} alt="" fill unoptimized />
            </div>
          )}
          {anterior && (
            <div className="relative aspect-4/3">
              <Image src={anterior.src} alt="" fill unoptimized />
            </div>
          )}
        </div>
      )}

      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {thumbnails.map((image, thumbIndex) => (
          <li key={`${thumbIndex}-${image.src}`}>
            <button
              type="button"
              aria-label={`Ver foto ${thumbIndex + 1} de ${total}`}
              aria-current={thumbIndex === index}
              onClick={() => setIndex(thumbIndex)}
              className={cn(
                'group relative block aspect-4/3 w-full overflow-hidden rounded-md border-2 transition-colors duration-150 ease-standard',
                thumbIndex === index ? 'border-primary' : 'border-transparent hover:border-border-strong',
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 640px) 8vw, 25vw"
                className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
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
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-md text-sm font-semibold text-fg-inverse"
            >
              <Image
                src={firstHidden.src}
                alt=""
                fill
                sizes="(min-width: 640px) 8vw, 25vw"
                className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-inverse/70 transition-colors duration-150 ease-standard group-hover:bg-inverse/60">
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
          <iframe
            src={embedDeVideo(video.src)}
            title="Vídeo do projeto"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full"
          />
        </Modal>
      )}
    </div>
  )
}
