import { Section } from '@/components/layout/Section'
import { FeatureItem } from '@/components/shared/FeatureItem'
import type { IconName } from '@/components/ui/Icon'

import type { Ambiente, TipoAmbiente } from '../types'

const iconePorAmbiente: Record<TipoAmbiente, IconName> = {
  'sala-estar': 'sofa',
  'sala-jantar': 'utensils',
  cozinha: 'cooking-pot',
  suite: 'bed-double',
  'area-servico': 'shirt',
  'varanda-gourmet': 'armchair',
}

/** "Características e ambientes": grade de cômodos, cada um com seu ícone. */
export function CaracteristicasAmbientes({ ambientes }: { ambientes: Ambiente[] }) {
  return (
    <Section
      title="Características e ambientes"
      subtitle="Tudo pensado para o seu conforto e bem-estar."
    >
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0 lg:divide-x lg:divide-border">
        {ambientes.map((ambiente) => (
          <li key={ambiente.tipo} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <FeatureItem
              layout="stack"
              titleAs="h3"
              icon={iconePorAmbiente[ambiente.tipo]}
              title={ambiente.titulo}
              description={ambiente.descricao}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}
