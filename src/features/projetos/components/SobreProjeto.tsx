import Image from 'next/image'

import { Section } from '@/components/layout/Section'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { TextoExpansivel } from '@/components/shared/TextoExpansivel'

import type { ConteudoSobre, ImagemRef } from '../types'

// Mesmo destaque do hover do Accordion (FAQ): fundo `--color-tint` com raio e transição suaves.
const ITEM_HOVER = 'rounded-md p-3 -m-3 transition-colors duration-150 ease-standard hover:bg-tint'

// Acima disto a descrição vira "Ver mais", para a seção não crescer sem limite.
const LIMITE_DESCRICAO = 500

/** "Sobre o projeto": descrição à esquerda, ambientes e público no meio, foto à direita. */
export function SobreProjeto({ sobre, imagem }: { sobre: ConteudoSobre; imagem: ImagemRef }) {
  return (
    <Section title="Sobre o projeto">
      <div className="grid gap-8 lg:grid-cols-3">
        <TextoExpansivel
          texto={sobre.descricao}
          limite={LIMITE_DESCRICAO}
          className="text-sm text-fg-muted"
        />

        <div className="flex flex-col gap-6 lg:border-x lg:border-border lg:px-8">
          <FeatureItem
            titleAs="h3"
            icon="layout-grid"
            title="Ambientes"
            description={sobre.ambientes}
            className={ITEM_HOVER}
          />
          <FeatureItem
            titleAs="h3"
            icon="users"
            title="Indicado para"
            description={sobre.indicadoPara}
            className={ITEM_HOVER}
          />
          <FeatureItem
            titleAs="h3"
            icon="building2"
            title="Aplicações"
            description={sobre.aplicacoes}
            className={ITEM_HOVER}
          />
        </div>

        {/* Proporção fixa e `self-start`: a foto não estica junto com o texto ao lado. */}
        <div className="group relative aspect-4/3 overflow-hidden rounded-lg lg:self-start">
          <Image
            src={imagem.src}
            alt={imagem.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
          />
        </div>
      </div>
    </Section>
  )
}
