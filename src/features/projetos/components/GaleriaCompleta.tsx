'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Section } from '@/components/layout/Section'
import { Lightbox } from '@/components/shared/Lightbox'
import type { DadosDeCompartilhamento } from '@/components/shared/ShareButton'

import type { ItemGaleria } from '../types'

/** Quantas fotos a grade mostra (2 fileiras de 4 no computador, como a referência do usuário de
 *  2026-11-20). As demais continuam no visualizador em tela cheia. */
const FOTOS_NA_GRADE = 8

/**
 * "Galeria completa": grade com as primeiras fotos; clicar em uma abre o visualizador em tela cheia,
 * que percorre TODAS as fotos do projeto. 2 colunas no celular e 4 a partir de `lg`: com 8 fotos as
 * fileiras sempre fecham (3 colunas deixariam a última pela metade).
 */
export function GaleriaCompleta({
  itens,
  compartilhar,
}: {
  itens: ItemGaleria[]
  /** Link do projeto: ativa o botão de compartilhar dentro do visualizador. */
  compartilhar: DadosDeCompartilhamento
}) {
  const [aberta, setAberta] = useState<number | null>(null)

  return (
    <Section title="Galeria completa" subtitle="Explore todos os detalhes do projeto.">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {itens.slice(0, FOTOS_NA_GRADE).map((item, indice) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={`Ampliar foto: ${item.imagem.alt}`}
              onClick={() => setAberta(indice)}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-lg"
            >
              <Image
                src={item.imagem.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 23vw, 46vw"
                className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={itens.map((item) => item.imagem)}
        index={aberta}
        onIndexChange={setAberta}
        onClose={() => setAberta(null)}
        label="Fotos do projeto"
        compartilhar={compartilhar}
      />
    </Section>
  )
}
