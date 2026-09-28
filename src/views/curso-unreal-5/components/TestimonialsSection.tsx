import { Carousel } from '@/components/shared/Carousel'

import { depoimentos } from '../data'
import { TestimonialCard } from './TestimonialCard'

export function TestimonialsSection() {
  return (
    <section className="bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-content px-4">
        <h2 className="font-heading text-2xl md:text-3xl">
          Seja o próximo a escrever sua própria{' '}
          <strong className="font-bold">história de sucesso!</strong>
        </h2>

        <div className="mt-8">
          <Carousel label="Depoimentos de alunos" itemClassName="w-72 md:w-80">
            {depoimentos.map((depoimento) => (
              <TestimonialCard key={depoimento.name} {...depoimento} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}
