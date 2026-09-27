'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Section } from '@/components/layout/Section'
import { Lightbox } from '@/components/shared/Lightbox'

import { projetosParaAprender } from '../data'

const label = 'Projetos que você vai aprender a criar no treinamento'

/**
 * Mosaico de fotos: os tipos de projeto que o aluno aprende a criar no curso, clicável em tela
 * cheia. Layout tipo alvenaria (colunas CSS + `break-inside-avoid`): cada foto mantém sua
 * proporção real (quadrada, retangular...) e encaixa sem cortar nem deixar buraco, diferente do
 * grid de células iguais.
 */
export function ProjectsMosaicSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <Section
      title="Projetos que você vai aprender em nosso treinamento!"
      subtitle="Não é foto, é 3D! Vamos juntos buscar o realismo em tempo real tão desejado pelo mercado de Archviz."
    >
      <div role="group" aria-label={label} className="columns-2 gap-2 sm:columns-3 sm:gap-3">
        {projetosParaAprender.map((foto, indice) => (
          <button
            key={`${indice}-${foto.src}`}
            type="button"
            aria-label={`Ver foto ${indice + 1} de ${projetosParaAprender.length}`}
            onClick={() => setLightboxIndex(indice)}
            className="group mb-2 block w-full break-inside-avoid overflow-hidden rounded-md sm:mb-3"
          >
            <Image
              src={foto.src}
              alt=""
              width={foto.width}
              height={foto.height}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="block h-auto w-full transition-transform duration-250 ease-standard group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={projetosParaAprender}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        label={label}
      />
    </Section>
  )
}
