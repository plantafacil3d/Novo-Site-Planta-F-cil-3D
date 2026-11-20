'use client'

import Image from 'next/image'
import { useState } from 'react'

import { SecaoDestacada } from '@/components/layout/SecaoDestacada'
import { Lightbox } from '@/components/shared/Lightbox'
import type { DadosDeCompartilhamento } from '@/components/shared/ShareButton'

import type { ItemGaleria } from '../types'

/**
 * "Prévias do projeto": fotos de prévia (plantas, detalhamentos...) cadastradas na aba "Prévias do
 * Projeto" do cadastro, dentro da moldura de destaque (`SecaoDestacada`). No computador, grade de 2
 * colunas; no celular, uma coluna com todas as fotos à mostra (o usuário pediu, 2026-11-20: a faixa
 * de deslizar escondia a quantidade e deixava a foto fora do centro). As fotos aparecem limpas, sem marca d'água (o usuário
 * pediu para tirar, 2026-11-20). Clicar abre o visualizador em tela cheia só com as prévias. Sem prévias, a seção não aparece.
 *
 * Layout igual ao da referência enviada pelo usuário (2026-11-20).
 */
export function PreviasDoProjeto({
  previas,
  compartilhar,
}: {
  previas: ItemGaleria[]
  /** Link do projeto: ativa o botão de compartilhar dentro do visualizador. */
  compartilhar: DadosDeCompartilhamento
}) {
  const [aberta, setAberta] = useState<number | null>(null)

  if (previas.length === 0) return null

  return (
    <SecaoDestacada
      selo="Prévias do projeto"
      title="Prévias do projeto"
      subtitle="Veja os trechos das peças técnicas que você vai receber."
    >
      <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        {previas.map((item, indice) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={`Ampliar prévia: ${item.imagem.alt}`}
              onClick={() => setAberta(indice)}
              // 33/20 = proporção do cartão da referência (683 × 415).
              className="relative block aspect-[33/20] w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-surface"
            >
              <Image
                src={item.imagem.src}
                alt=""
                fill
                sizes="(min-width: 1200px) 546px, (min-width: 768px) 46vw, 92vw"
                className="object-contain object-center p-3"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={previas.map((item) => item.imagem)}
        index={aberta}
        onIndexChange={setAberta}
        onClose={() => setAberta(null)}
        label="Prévias do projeto"
        compartilhar={compartilhar}
      />
    </SecaoDestacada>
  )
}
