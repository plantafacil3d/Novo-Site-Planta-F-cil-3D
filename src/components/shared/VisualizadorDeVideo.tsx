'use client'

import { Modal } from '../ui/Modal'
import { embedDeVideo } from './videoEmbed'

type VisualizadorDeVideoProps = {
  /** Link do vídeo (YouTube ou Vimeo). */
  src: string
  open: boolean
  onClose: () => void
  /** Nome acessível da janela e do player (ex.: "Vídeo do projeto"). */
  label: string
}

/**
 * Vídeo em tela cheia, no mesmo visual do `Lightbox`: fundo escurecido e desfocado, o player
 * centralizado e o botão de fechar no canto da tela, fora de cima do vídeo. O player entra limpo
 * (sem barra de controles nem cartões do YouTube); o som liga normal, porque o vídeo só nasce
 * depois do clique em "Assistir".
 */
export function VisualizadorDeVideo({ src, open, onClose, label }: VisualizadorDeVideoProps) {
  return (
    <Modal open={open} onClose={onClose} label={label} immersive>
      {/* A moldura do `Modal` cobre a tela toda: clicar no escuro em volta do vídeo fecha. O recuo
          de cima reserva a faixa do botão de fechar. */}
      <div
        className="flex h-full items-center justify-center px-4 pt-16 pb-6 lg:px-24"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <iframe
          src={embedDeVideo(src, { hideControls: true, mute: false })}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full max-w-5xl rounded-lg bg-inverse-strong"
        />
      </div>
    </Modal>
  )
}
