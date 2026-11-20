'use client'

import Image from 'next/image'
import { useState } from 'react'

import { SecaoDestacada } from '@/components/layout/SecaoDestacada'
import { Lightbox } from '@/components/shared/Lightbox'
import type { DadosDeCompartilhamento } from '@/components/shared/ShareButton'
import { cn } from '@/components/ui/cn'

import type { FotoDeObra } from '../types'

/**
 * Mosaico no computador, pela quantidade de fotos (o cadastro aceita até 5). A primeira foto é a
 * grande quando há 3 ou 5; com 1, 2 ou 4 as fotos ficam do mesmo tamanho, sem buraco na grade.
 * `grade`: colunas a partir de `md`. `grande`: classes extras da primeira foto.
 */
const MOSAICO: Record<number, { grade: string; grande?: string }> = {
  // Uma foto só: metade da largura, à esquerda (o tamanho da foto grande do layout de 5). Na largura
  // toda ela ficava gigante (pedido do usuário, 2026-11-20).
  1: { grade: 'md:grid-cols-2', grande: 'md:col-span-1' },
  2: { grade: 'md:grid-cols-2' },
  3: { grade: 'md:grid-cols-3', grande: 'md:col-span-2 md:row-span-2 md:aspect-auto' },
  4: { grade: 'md:grid-cols-2' },
  5: { grade: 'md:grid-cols-4', grande: 'md:col-span-2 md:row-span-2 md:aspect-auto' },
}

/**
 * "Do projeto à obra": fotos de obras de clientes que construíram o modelo, num mosaico (no
 * computador, 1 foto grande + 4 menores, como a referência enviada pelo usuário em 2026-11-20); no
 * celular, a 1ª foto na largura toda e as outras em 2 colunas (referência "versão celular (1)"). Cada foto pode ter um selo com a situação da obra
 * (em verde) e a cidade. Clicar abre o visualizador em tela cheia só com estas fotos. Dados da aba
 * "Marketing" do cadastro. Sem fotos, a seção não aparece.
 */
export function ObrasDeClientes({
  obras,
  compartilhar,
}: {
  obras: FotoDeObra[]
  /** Link do projeto: ativa o botão de compartilhar dentro do visualizador. */
  compartilhar: DadosDeCompartilhamento
}) {
  const [aberto, setAberto] = useState<number | null>(null)

  if (obras.length === 0) return null

  const mosaico = MOSAICO[obras.length] ?? MOSAICO[5]

  return (
    <SecaoDestacada
      selo="Obras de clientes"
      title="Do projeto à obra"
      subtitle="Fotos enviadas por clientes que construíram este modelo."
    >
      <ul className={cn('mt-8 grid grid-cols-2 gap-3 md:gap-4', mosaico?.grade)}>
        {obras.map((obra, indice) => {
          const primeira = indice === 0
          const grande = primeira ? mosaico?.grande : undefined
          // No celular, a 1ª ocupa a largura toda e as outras vão em 2 colunas; se sobrar uma sozinha
          // na última fileira, ela também ocupa a largura toda (sem buraco).
          const sozinhaNoFim = indice === obras.length - 1 && (obras.length - 1) % 2 === 1
          const larguraToda = primeira || sozinhaNoFim
          const selo = [obra.etapa, obra.cidade].filter(Boolean).join(' · ')
          return (
            <li
              key={obra.id}
              className={cn('aspect-4/3', larguraToda && 'col-span-2 md:col-span-1', grande)}
            >
              <button
                type="button"
                aria-label={`Ampliar ${obra.imagem.alt}${selo ? ` (${selo})` : ''}`}
                onClick={() => setAberto(indice)}
                className="relative block size-full cursor-zoom-in overflow-hidden rounded-highlight bg-subtle"
              >
                <Image
                  src={obra.imagem.src}
                  alt=""
                  fill
                  sizes={
                    grande
                      ? '(min-width: 1200px) 680px, (min-width: 768px) 60vw, 85vw'
                      : '(min-width: 1200px) 340px, (min-width: 768px) 30vw, 46vw'
                  }
                  className="object-cover"
                />
                {selo && (
                  <span
                    aria-hidden="true"
                    // No celular, nos cartões estreitos, o texto quebra em 2 linhas (como a referência).
                    className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] rounded-md bg-overlay-strong px-2.5 py-1 text-sm leading-snug font-medium text-fg-inverse backdrop-blur-sm md:bottom-3 md:left-3 md:max-w-[calc(100%-1.5rem)] md:truncate md:px-3 md:py-1.5"
                  >
                    {obra.etapa && (
                      <span className="font-semibold text-accent-on-inverse">{obra.etapa}</span>
                    )}
                    {obra.etapa && obra.cidade && ' · '}
                    {obra.cidade}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <Lightbox
        images={obras.map((obra) => obra.imagem)}
        index={aberto}
        onIndexChange={setAberto}
        onClose={() => setAberto(null)}
        label="Obras de clientes"
        compartilhar={compartilhar}
      />
    </SecaoDestacada>
  )
}
