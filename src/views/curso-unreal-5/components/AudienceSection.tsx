import { Section } from '@/components/layout/Section'
import { CheckList } from '@/components/shared/CheckList'
import { FeatureItem } from '@/components/shared/FeatureItem'

import { beneficiosDoCurso, publicoAlvo } from '../data'

/** Para quem é o curso (personas) e os benefícios práticos de fazer parte dele. */
export function AudienceSection() {
  return (
    <Section
      title="O curso é para você"
      subtitle="Metodologia prática, para todos os níveis de experiência."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <CheckList items={publicoAlvo} columns={1} />

        <ul className="grid gap-6 sm:grid-cols-2">
          {beneficiosDoCurso.map((beneficio) => (
            <li key={beneficio.title}>
              <FeatureItem layout="stack" titleAs="h3" {...beneficio} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
