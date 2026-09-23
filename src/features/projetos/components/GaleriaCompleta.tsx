'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Section } from '@/components/layout/Section'
import { Lightbox } from '@/components/shared/Lightbox'

import type { ItemGaleria } from '../types'

/** "Galeria completa": grade de fotos; clicar em uma abre o visualizador em tela cheia. */
export function GaleriaCompleta({ itens }: { itens: ItemGaleria[] }) {
  const [aberta, setAberta] = useState<number | null>(null)

  return (
    <Section title="Galeria completa" subtitle="Explore todos os detalhes do projeto.">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {itens.map((item, indice) => (
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
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
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
      />
    </Section>
  )
}
