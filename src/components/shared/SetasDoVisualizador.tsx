import { IconButton } from '../ui/IconButton'

type SetasDoVisualizadorProps = {
  aoAnterior: () => void
  aoProxima: () => void
  labelAnterior: string
  labelProxima: string
}

/**
 * Setas Anterior/Próxima dos visualizadores em tela cheia (`Lightbox`, plantas). No celular ficam
 * num lugar fixo, juntas na base da tela, como o contador e o botão de fechar no topo: não cobrem
 * a foto nem acompanham o zoom. A partir de `lg` voltam para as laterais, no meio da altura.
 * Posicionam-se em relação ao pai (`relative`, tela cheia).
 */
export function SetasDoVisualizador({
  aoAnterior,
  aoProxima,
  labelAnterior,
  labelProxima,
}: SetasDoVisualizadorProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-6 lg:contents">
      <IconButton
        icon="chevron-left"
        label={labelAnterior}
        onClick={aoAnterior}
        className="pointer-events-auto lg:absolute lg:top-1/2 lg:left-2 lg:-translate-y-1/2"
      />
      <IconButton
        icon="chevron-right"
        label={labelProxima}
        onClick={aoProxima}
        className="pointer-events-auto lg:absolute lg:top-1/2 lg:right-2 lg:-translate-y-1/2"
      />
    </div>
  )
}
