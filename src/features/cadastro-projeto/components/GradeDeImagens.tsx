import Image from 'next/image'
import type { ReactNode } from 'react'

import { IconButton } from '@/components/ui/IconButton'

import type { ImagemProjeto } from '../types'

type GradeDeImagensProps<T extends ImagemProjeto> = {
  imagens: T[]
  /** Nome acessível do botão de remover (ex.: "Remover a imagem 2"). */
  rotuloDeRemover: (imagem: T, indice: number) => string
  aoRemover: (id: string) => void
  /** Conteúdo abaixo da miniatura (ex.: o campo de nome da planta). */
  extra?: (imagem: T, indice: number) => ReactNode
}

/** Miniaturas das imagens escolhidas, cada uma com botão de remover. */
export function GradeDeImagens<T extends ImagemProjeto>({
  imagens,
  rotuloDeRemover,
  aoRemover,
  extra,
}: GradeDeImagensProps<T>) {
  if (imagens.length === 0) return null

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {imagens.map((imagem, indice) => (
        <li
          key={imagem.id}
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className="relative aspect-4/3 bg-subtle">
            <Image
              src={imagem.url}
              alt={`Prévia de ${imagem.nomeArquivo}`}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 90vw"
              className="object-cover"
            />
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
      ))}
    </ul>
  )
}
