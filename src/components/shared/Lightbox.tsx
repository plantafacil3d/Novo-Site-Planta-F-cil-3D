'use client'

import Image from 'next/image'
import { useState, type KeyboardEvent } from 'react'

import { cn } from '../ui/cn'
import { Modal } from '../ui/Modal'
import { AreaComZoom } from './AreaComZoom'
import { SetasDoVisualizador } from './SetasDoVisualizador'
import { ShareButton, type DadosDeCompartilhamento } from './ShareButton'

type LightboxProps = {
  images: { src: string; alt: string }[]
  /** Foto aberta; `null` = fechado. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Nome acessível da janela (ex.: "Fotos do projeto"). */
  label: string
  /** Com isto, aparece o botão de compartilhar no canto inferior direito. Sem, fica sem o botão. */
  compartilhar?: DadosDeCompartilhamento
}

/** Visualizador de fotos em tela cheia, com setas do teclado e contador. */
export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  label,
  compartilhar,
}: LightboxProps) {
  // A pré-carga da próxima foto só começa depois da primeira interação (seta ou teclado): quem só
  // abre a foto e olha não baixa nada além dela. Volta a zero ao fechar.
  const [interagiu, setInteragiu] = useState(false)
  // Para que lado foi a última troca: a foto nova entra deslizando pelo lado oposto. `null` na
  // primeira foto aberta (sem animação).
  const [direcao, setDirecao] = useState<1 | -1 | null>(null)

  const total = images.length
  const current = index === null ? undefined : images[index]
  const proxima = interagiu && index !== null && total > 1 ? images[(index + 1) % total] : null

  function go(step: 1 | -1) {
    if (index === null) return
    setInteragiu(true)
    setDirecao(step)
    onIndexChange((index + step + total) % total)
  }

  function fechar() {
    setInteragiu(false)
    setDirecao(null)
    onClose()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'ArrowRight') go(1)
  }

  return (
    <Modal open={index !== null} onClose={fechar} label={label} immersive>
      {current && index !== null && (
        <div className="relative h-full" onKeyDown={handleKeyDown}>
          {/* Sem caixa de proporção fixa: a foto cresce até encostar na altura ou na largura da tela,
              mantendo a proporção original. Foto em pé usa a altura toda; foto deitada, a largura.
              O recuo reserva a faixa do contador e do botão de fechar (topo) e, no celular com mais
              de uma foto, a das setas (base). Clicar no escuro em volta da foto fecha o
              visualizador. Zoom (pinça ou scroll), arrastar com zoom e o slide de deslizar o dedo
              para o lado vêm da `AreaComZoom`; a `key` zera o zoom a cada foto. */}
          <AreaComZoom
            key={index}
            recuo={cn('px-4 pt-16 lg:px-24 lg:pb-6', total > 1 || compartilhar ? 'pb-24' : 'pb-6')}
            aoDeslizar={total > 1 ? go : undefined}
            aoClicarNoFundo={fechar}
            entrada={direcao}
          >
            <Image
              src={current.src}
              alt={current.alt}
              // Tamanho real vem do arquivo: `width`/`height` 0 só satisfazem o componente e o CSS
              // (`w-auto h-auto`) deixa o navegador usar a proporção da própria foto.
              width={0}
              height={0}
              sizes="100vw"
              // Sem otimização: evita o proxy de resize do Next a cada troca de foto (ver MediaGallery).
              unoptimized
              draggable={false}
              className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain select-none"
            />
          </AreaComZoom>

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
            <SetasDoVisualizador
              aoAnterior={() => go(-1)}
              aoProxima={() => go(1)}
              labelAnterior="Foto anterior"
              labelProxima="Próxima foto"
            />
          )}

          {compartilhar && (
            <ShareButton
              {...compartilhar}
              variant="visualizador"
              className="absolute right-4 bottom-4"
            />
          )}

          <p
            aria-live="polite"
            className="absolute top-2 left-1/2 flex h-11 -translate-x-1/2 items-center rounded-sm bg-inverse/70 px-3 text-sm font-medium text-fg-inverse"
          >
            {index + 1} de {total}
          </p>
        </div>
      )}
    </Modal>
  )
}
