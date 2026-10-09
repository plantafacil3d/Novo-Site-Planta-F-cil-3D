'use client'

import Image from 'next/image'
import { useState, type KeyboardEvent } from 'react'

import { IconButton } from '../ui/IconButton'
import { Modal } from '../ui/Modal'

type LightboxProps = {
  images: { src: string; alt: string }[]
  /** Foto aberta; `null` = fechado. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Nome acessível da janela (ex.: "Fotos do projeto"). */
  label: string
}

/** Visualizador de fotos em tela cheia, com setas do teclado e contador. */
export function Lightbox({ images, index, onIndexChange, onClose, label }: LightboxProps) {
  // A pré-carga da próxima foto só começa depois da primeira interação (seta ou teclado): quem só
  // abre a foto e olha não baixa nada além dela. Volta a zero ao fechar.
  const [interagiu, setInteragiu] = useState(false)

  const total = images.length
  const current = index === null ? undefined : images[index]
  const proxima = interagiu && index !== null && total > 1 ? images[(index + 1) % total] : null

  function go(step: number) {
    if (index === null) return
    setInteragiu(true)
    onIndexChange((index + step + total) % total)
  }

  function fechar() {
    setInteragiu(false)
    onClose()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'ArrowRight') go(1)
  }

  return (
    <Modal open={index !== null} onClose={fechar} label={label}>
      {current && index !== null && (
        <div className="relative" onKeyDown={handleKeyDown}>
          <div className="relative aspect-4/3 md:aspect-video">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              // Sem otimização: evita o proxy de resize do Next a cada troca de foto (ver MediaGallery).
              unoptimized
              className="object-contain"
            />
          </div>

          {/* Pré-carrega só a PRÓXIMA foto, e só depois da primeira interação, para a seta trocar
              sem espera. É o original, com o MESMO endereço que a foto exibida usa (`unoptimized`),
              então o navegador baixa o arquivo uma vez e o reaproveita. A anterior não precisa:
              quem volta já a viu e ela está no cache do navegador. */}
          {proxima && (
            <div
              aria-hidden
              className="pointer-events-none absolute size-px overflow-hidden opacity-0"
            >
              <div className="relative aspect-4/3">
                <Image src={proxima.src} alt="" fill unoptimized loading="eager" />
              </div>
            </div>
          )}

          {total > 1 && (
            <>
              <IconButton
                icon="chevron-left"
                label="Foto anterior"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-2 -translate-y-1/2"
              />
              <IconButton
                icon="chevron-right"
                label="Próxima foto"
                onClick={() => go(1)}
                className="absolute top-1/2 right-2 -translate-y-1/2"
              />
            </>
          )}

          <p
            aria-live="polite"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-inverse/70 px-2.5 py-1 text-xs font-medium text-fg-inverse"
          >
            {index + 1} de {total}
          </p>
        </div>
      )}
    </Modal>
  )
}
