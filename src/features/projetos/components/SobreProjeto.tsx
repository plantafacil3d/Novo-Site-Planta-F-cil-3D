import Image from 'next/image'

import { Section } from '@/components/layout/Section'
import { CheckList } from '@/components/shared/CheckList'
import { FeatureItem } from '@/components/shared/FeatureItem'

import type { ConteudoSobre } from '../types'

/** "Sobre o projeto": texto e diferenciais à esquerda, ambientes e público no meio, foto à direita. */
export function SobreProjeto({ sobre }: { sobre: ConteudoSobre }) {
  return (
    <Section title="Sobre o projeto" subtitle={sobre.introducao}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          {sobre.textos.map((texto) => (
            <p key={texto} className="text-sm text-fg-muted">
              {texto}
            </p>
          ))}
          <CheckList items={sobre.destaques} />
        </div>

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
            src={sobre.imagem.src}
            alt={sobre.imagem.alt}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  )
}
