import Image from 'next/image'

import { Section } from '@/components/layout/Section'
import { FeatureItem } from '@/components/shared/FeatureItem'

import type { ConteudoSobre, ImagemRef } from '../types'

/** "Sobre o projeto": descrição à esquerda, ambientes e público no meio, foto à direita. */
export function SobreProjeto({ sobre, imagem }: { sobre: ConteudoSobre; imagem: ImagemRef }) {
  return (
    <Section title="Sobre o projeto">
      <div className="grid gap-8 lg:grid-cols-3">
        <p className="text-sm text-fg-muted">{sobre.descricao}</p>

        <div className="flex flex-col gap-6 lg:border-x lg:border-border lg:px-8">
          <FeatureItem
            titleAs="h3"
            icon="layout-grid"
            title="Ambientes"
            description={sobre.ambientes}
          />
          <FeatureItem
            titleAs="h3"
            icon="users"
            title="Indicado para"
            description={sobre.indicadoPara}
          />
          <FeatureItem
            titleAs="h3"
            icon="building2"
            title="Aplicações"
            description={sobre.aplicacoes}
          />
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-lg lg:aspect-auto">
          <Image
            src={imagem.src}
            alt={imagem.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  )
}
