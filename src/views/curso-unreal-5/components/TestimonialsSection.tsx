import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/shared/Carousel'

import { depoimentos } from '../data'

import { TestimonialCard } from './TestimonialCard'

/** Depoimentos de alunos, em faixa rolável. */
export function TestimonialsSection() {
  return (
    <Section
      title="Seja o próximo a escrever sua história"
      subtitle="Quem já fez o curso conta como a Unreal Engine mudou o dia a dia de trabalho."
    >
      <Carousel label="Depoimentos de alunos" itemClassName="w-80 grid">
        {depoimentos.map((depoimento) => (
          <TestimonialCard key={depoimento.nome} {...depoimento} />
        ))}
      </Carousel>
    </Section>
  )
}
