'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Section } from '@/components/layout/Section'
import { Tabs } from '@/components/navigation/Tabs'
import { Carousel } from '@/components/shared/Carousel'
import { Lightbox } from '@/components/shared/Lightbox'

import { categoriasGaleria } from '../rules'
import type { CategoriaGaleria, ItemGaleria } from '../types'

type FotoAberta = { categoria: CategoriaGaleria; indice: number }

/** "Galeria completa": fotos separadas por abas; clicar em uma abre o visualizador em tela cheia. */
export function GaleriaCompleta({ itens }: { itens: ItemGaleria[] }) {
  const [aberta, setAberta] = useState<FotoAberta | null>(null)

  // Só mostra abas que têm foto.
  const abas = categoriasGaleria
    .map((categoria) => ({
      ...categoria,
      imagens: itens.filter((item) => item.categoria === categoria.id).map((item) => item.imagem),
    }))
    .filter((aba) => aba.imagens.length > 0)

  const imagensAbertas = abas.find((aba) => aba.id === aberta?.categoria)?.imagens ?? []

  return (
    <Section title="Galeria completa" subtitle="Explore todos os detalhes do projeto.">
      <Tabs
        label="Categorias da galeria"
        items={abas.map((aba) => ({
          id: aba.id,
          label: aba.rotulo,
          content: (
            <Carousel label={`Fotos: ${aba.rotulo}`} itemClassName="w-64 sm:w-72">
              {aba.imagens.map((imagem, indice) => (
                <button
                  key={`${indice}-${imagem.src}`}
                  type="button"
                  aria-label={`Ampliar foto: ${imagem.alt}`}
                  onClick={() => setAberta({ categoria: aba.id, indice })}
                  className="group relative block aspect-4/3 w-full overflow-hidden rounded-lg"
                >
                  <Image
                    src={imagem.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 288px, 256px"
                    className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
                  />
                </button>
              ))}
            </Carousel>
          ),
        }))}
      />

      <Lightbox
        images={imagensAbertas}
        index={aberta?.indice ?? null}
        onIndexChange={(indice) => setAberta((atual) => (atual ? { ...atual, indice } : atual))}
        onClose={() => setAberta(null)}
        label="Fotos do projeto"
      />
    </Section>
  )
}
