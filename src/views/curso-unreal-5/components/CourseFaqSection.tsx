import { Section } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'

import { perguntasFrequentesDoCurso } from '../data'

/** FAQ do curso, no mesmo padrão de `PerguntasFrequentes` (duas colunas, cada uma com sua sanfona). */
export function CourseFaqSection() {
  const itens = perguntasFrequentesDoCurso.map((item) => ({
    title: item.pergunta,
    content: item.resposta,
  }))
  const metade = Math.ceil(itens.length / 2)

  return (
    <Section
      tone="subtle"
      title="Dúvidas frequentes"
      subtitle="Tire suas dúvidas antes de garantir sua vaga."
    >
      <div className="grid items-start gap-3 lg:grid-cols-2 lg:gap-6">
        <Accordion items={itens.slice(0, metade)} />
        <Accordion items={itens.slice(metade)} />
      </div>
    </Section>
  )
}
