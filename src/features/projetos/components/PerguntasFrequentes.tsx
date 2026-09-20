import { Section } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'

import { perguntasFrequentes } from '../conteudo'

/** Perguntas frequentes em duas colunas (uma no celular), cada pergunta abre e fecha. */
export function PerguntasFrequentes() {
  const itens = perguntasFrequentes.map((item) => ({
    title: item.pergunta,
    content: item.resposta,
  }))
  const metade = Math.ceil(itens.length / 2)

  return (
    <Section title="Perguntas frequentes" subtitle="Tire suas dúvidas antes de comprar.">
      <div className="grid items-start gap-3 lg:grid-cols-2 lg:gap-6">
        <Accordion items={itens.slice(0, metade)} />
        <Accordion items={itens.slice(metade)} />
      </div>
    </Section>
  )
}
