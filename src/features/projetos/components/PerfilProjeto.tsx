import { Section } from '@/components/layout/Section'
import { FeatureItem } from '@/components/shared/FeatureItem'
import type { IconName } from '@/components/ui/Icon'

import type { PerfilDoProjeto } from '../types'

/** "Para quem é este projeto?": o perfil ideal de terreno, família e uso. */
export function PerfilProjeto({ perfil }: { perfil: PerfilDoProjeto }) {
  const itens: { icon: IconName; title: string; description: string }[] = [
    { icon: 'ruler', title: 'Terreno mínimo', description: perfil.terrenoMinimo },
    { icon: 'map-pin', title: 'Perfil do terreno', description: perfil.perfilDoTerreno },
    { icon: 'users', title: 'Família indicada', description: perfil.familia },
    { icon: 'sparkles', title: 'Estilo', description: perfil.estilo },
    { icon: 'building2', title: 'Categoria', description: perfil.categoria },
  ]

  return (
    <Section
      title="Para quem é este projeto?"
      subtitle="Descubra se este projeto é ideal para você."
    >
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-border">
        {itens.map((item) => (
          <li key={item.title} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <FeatureItem layout="stack" titleAs="h3" {...item} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
