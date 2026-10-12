import Image from 'next/image'
import { useState, type KeyboardEvent, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/components/ui/cn'
import { useArrastarParaReordenar } from '@/hooks/useArrastarParaReordenar'

import type { ImagemProjeto } from '../types'

type GradeDeImagensProps<T extends ImagemProjeto> = {
  imagens: T[]
  /** Nome acessível do botão de remover (ex.: "Remover a imagem 2"). */
  rotuloDeRemover: (imagem: T, indice: number) => string
  aoRemover: (id: string) => void
  /** Conteúdo abaixo da miniatura (ex.: o campo de nome da planta). */
  extra?: (imagem: T, indice: number) => ReactNode
  /** Quando informado (e há mais de uma imagem), cada miniatura ganha uma alça para mudar a ordem:
   *  arrastando, ou com as setas do teclado. A imagem de `idOrigem` passa a ocupar o lugar de `idDestino`. */
  aoReordenar?: (idOrigem: string, idDestino: string) => void
  /** Segunda forma de reordenar, para muitas imagens: marcar as miniaturas na ordem desejada e mandar
   *  todas para o início. Recebe os ids na ordem em que foram marcadas. */
  aoMoverParaInicio?: (ids: string[]) => void
}

/** Miniaturas das imagens escolhidas, cada uma com botão de remover (e, se pedido, de reordenar). */
export function GradeDeImagens<T extends ImagemProjeto>({
  imagens,
  rotuloDeRemover,
  aoRemover,
  extra,
  aoReordenar,
  aoMoverParaInicio,
}: GradeDeImagensProps<T>) {
  const { arrastando, handleProps, itemProps } = useArrastarParaReordenar({
    aoReordenar: (idOrigem, idDestino) => aoReordenar?.(idOrigem, idDestino),
  })
  // Ids marcados, na ordem em que foram marcados.
  const [marcadas, setMarcadas] = useState<string[]>([])

  if (imagens.length === 0) return null
  const podeArrastar = Boolean(aoReordenar) && imagens.length > 1
  const podeMarcar = Boolean(aoMoverParaInicio) && imagens.length > 1
  // Uma imagem removida depois de marcada some da seleção.
  const selecao = marcadas.filter((id) => imagens.some((imagem) => imagem.id === id))

  function alternarMarca(id: string) {
    setMarcadas(selecao.includes(id) ? selecao.filter((item) => item !== id) : [...selecao, id])
  }

  function moverMarcadasParaInicio() {
    aoMoverParaInicio?.(selecao)
    setMarcadas([])
  }

  /** Setas movem a imagem uma posição; o foco volta para a alça, que o React move junto com a miniatura. */
  function aoTeclarNaAlca(evento: KeyboardEvent, indice: number, id: string) {
    const passo =
      evento.key === 'ArrowLeft' || evento.key === 'ArrowUp'
        ? -1
        : evento.key === 'ArrowRight' || evento.key === 'ArrowDown'
          ? 1
          : 0
    const vizinha = imagens[indice + passo]
    if (passo === 0 || !vizinha) return
    evento.preventDefault()
    aoReordenar?.(id, vizinha.id)
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`[data-alca-de-imagem="${id}"]`)?.focus(),
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {podeMarcar && selecao.length === 0 && (
        <p className="text-sm text-fg-muted">
          Para reordenar várias de uma vez, marque as imagens na ordem em que devem aparecer e
          clique em &ldquo;Mover para o início&rdquo;.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {imagens.map((imagem, indice) => {
          const posicaoNaSelecao = selecao.indexOf(imagem.id) + 1
          return (
            <li
              key={imagem.id}
              className={cn(
                'flex flex-col overflow-hidden rounded-lg border border-border bg-surface',
                posicaoNaSelecao > 0 && 'border-primary ring-2 ring-primary',
                arrastando === imagem.id && 'opacity-50',
              )}
              {...(podeArrastar ? itemProps(imagem.id) : {})}
            >
              <div className="relative aspect-4/3 bg-subtle">
                <Image
                  src={imagem.url}
                  alt={`Prévia de ${imagem.nomeArquivo}`}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 90vw"
                  className="object-cover"
                  draggable={false}
                />
                {podeArrastar && (
                  <IconButton
                    icon="grip"
                    tone="inverse"
                    label={`Mover a imagem ${indice + 1}: arraste, ou use as setas do teclado`}
                    data-alca-de-imagem={imagem.id}
                    className="absolute top-2 left-2 cursor-grab touch-none active:cursor-grabbing"
                    onKeyDown={(evento) => aoTeclarNaAlca(evento, indice, imagem.id)}
                    {...handleProps(imagem.id)}
                  />
                )}
                {podeMarcar && (
                  <button
                    type="button"
                    aria-pressed={posicaoNaSelecao > 0}
                    aria-label={`Marcar a imagem ${indice + 1} para mover`}
                    onClick={() => alternarMarca(imagem.id)}
                    // A área de toque continua com 44 px; só a bolinha que se vê é pequena.
                    className="group absolute bottom-0 left-0 inline-flex size-11 items-center justify-center"
                  >
                    <span
                      className={cn(
                        'inline-flex size-6 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-150 ease-standard',
                        posicaoNaSelecao > 0
                          ? 'border-accent bg-accent text-fg'
                          : 'border-fg-inverse/80 bg-inverse/70 text-fg-inverse group-hover:bg-inverse',
                      )}
                    >
                      {posicaoNaSelecao > 0 ? posicaoNaSelecao : null}
                    </span>
                  </button>
                )}
                <IconButton
                  icon="trash"
                  tone="inverse"
                  label={rotuloDeRemover(imagem, indice)}
                  onClick={() => aoRemover(imagem.id)}
                  className="absolute top-2 right-2"
                />
              </div>
              {extra && <div className="p-3">{extra(imagem, indice)}</div>}
            </li>
          )
        })}
      </ul>

      {podeMarcar && selecao.length > 0 && (
        <div
          role="group"
          aria-label="Mover as imagens marcadas"
          className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-md"
        >
          <span className="text-sm font-medium">
            {selecao.length === 1 ? '1 imagem marcada' : `${selecao.length} imagens marcadas`}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => setMarcadas([])}>
              Limpar marcação
            </Button>
            <Button onClick={moverMarcadasParaInicio}>Mover para o início</Button>
          </div>
        </div>
      )}
    </div>
  )
}
