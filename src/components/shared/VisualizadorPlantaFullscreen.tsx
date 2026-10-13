'use client'

import Image from 'next/image'
import { useState } from 'react'

import { cn } from '../ui/cn'
import { Modal } from '../ui/Modal'
import { AreaComZoom } from './AreaComZoom'
import { SetasDoVisualizador } from './SetasDoVisualizador'
import { ShareButton, type DadosDeCompartilhamento } from './ShareButton'

type VisualizadorPlantaFullscreenProps = {
  images: { src: string; alt: string }[]
  /** Planta aberta; `null` = fechado. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Nome acessível da janela (ex.: "Planta humanizada do projeto X"). */
  label: string
  /** Com isto, aparece o botão de compartilhar no canto inferior direito. Sem, fica sem o botão. */
  compartilhar?: DadosDeCompartilhamento
}

/**
 * Planta em tela cheia, no mesmo visual do `Lightbox` (fundo escurecido e desfocado, sem caixa
 * fixa, cantos arredondados). Os gestos vêm da `AreaComZoom`: zoom por pinça (celular) ou scroll
 * do mouse, arrastar com zoom e, sem zoom, deslizar o dedo para trocar de pavimento. No celular a
 * planta fica girada na horizontal (`rotate(90deg)`, sem depender da Screen Orientation API,
 * inconsistente no Safari); a partir de `lg`, sem giro. Setas e "X de Y" só com 2+ pavimentos.
 */
export function VisualizadorPlantaFullscreen({
  images,
  index,
  onIndexChange,
  onClose,
  label,
  compartilhar,
}: VisualizadorPlantaFullscreenProps) {
  const total = images.length
  const current = index === null ? undefined : images[index]

  // Para que lado foi a última troca: o pavimento novo entra deslizando pelo lado oposto.
  const [direcao, setDirecao] = useState<1 | -1 | null>(null)

  function go(step: 1 | -1) {
    if (index === null || total === 0) return
    setDirecao(step)
    onIndexChange((index + step + total) % total)
  }

  function fechar() {
    setDirecao(null)
    onClose()
  }

  return (
    <Modal open={index !== null} onClose={fechar} label={label} immersive>
      {current && index !== null && (
        <div className="relative h-full">
          {/* O recuo, no eixo girado do celular, reserva a faixa do contador e do botão de fechar
              (o lado "esquerdo" da caixa girada vira o topo da tela) e, com mais de um pavimento,
              a das setas (o lado "direito" vira a base). A `key` zera o zoom a cada pavimento. */}
          <AreaComZoom
            key={index}
            girarNoCelular
            recuo={cn(
              'py-4 pl-16 lg:px-24 lg:pt-16 lg:pb-6',
              total > 1 || compartilhar ? 'pr-20' : 'pr-4',
            )}
            aoDeslizar={total > 1 ? go : undefined}
            aoClicarNoFundo={fechar}
            entrada={direcao}
          >
            <Image
              src={current.src}
              alt={current.alt}
              // Tamanho real vem do arquivo (ver `Lightbox`): é o que permite arredondar o canto
              // da própria planta, e não da caixa em volta.
              width={0}
              height={0}
              sizes="100vw"
              unoptimized
              draggable={false}
              className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain select-none"
            />
          </AreaComZoom>

          {total > 1 && (
            <>
              <SetasDoVisualizador
                aoAnterior={() => go(-1)}
                aoProxima={() => go(1)}
                labelAnterior="Pavimento anterior"
                labelProxima="Próximo pavimento"
              />
              <p
                aria-live="polite"
                className="absolute top-2 left-1/2 flex h-11 -translate-x-1/2 items-center rounded-sm bg-inverse/70 px-3 text-sm font-medium text-fg-inverse"
              >
                {index + 1} de {total}
              </p>
            </>
          )}

          {compartilhar && (
            <ShareButton
              {...compartilhar}
              variant="visualizador"
              className="absolute right-4 bottom-4"
            />
          )}
        </div>
      )}
    </Modal>
  )
}
