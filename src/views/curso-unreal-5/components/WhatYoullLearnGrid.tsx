import { Section } from '@/components/layout/Section'
import { FeatureItem } from '@/components/shared/FeatureItem'

import { oQueVaiAprender } from '../data'

/** Grade "o que você vai aprender": reaproveita o `FeatureItem` já usado na home. */
export function WhatYoullLearnGrid() {
  return (
    <Section
      tone="subtle"
      title="O que você vai aprender"
      subtitle="Do primeiro render até tours virtuais interativos, 100% atualizado para a versão 5.6."
    >
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {oQueVaiAprender.map((item) => (
          <li key={item.title}>
            <FeatureItem layout="stack" titleAs="h3" {...item} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
