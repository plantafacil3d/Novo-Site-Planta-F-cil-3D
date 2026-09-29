import { Section } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'

import {
  perguntaItensInclusos,
  perguntasFrequentes,
  respostaItensInclusosPadrao,
} from '../conteudo'
import { descreverItensInclusos } from '../rules'

/**
 * Perguntas frequentes em duas colunas (uma no celular), cada pergunta abre e fecha. A primeira
 * resposta resume, numa frase, os itens inclusos do cadastro; sem itens, usa o texto padrão.
 */
export function PerguntasFrequentes({ itensInclusos }: { itensInclusos: string[] }) {
  const itens = [
    {
      title: perguntaItensInclusos,
      content:
        itensInclusos.length > 0 ? (
          <p>Você vai receber os seguintes itens: {descreverItensInclusos(itensInclusos)}</p>
        ) : (
          <p>{respostaItensInclusosPadrao}</p>
        ),
    },
    ...perguntasFrequentes.map((item) => ({
      title: item.pergunta,
      content: (
        <div className="flex flex-col gap-3">
          {[item.resposta].flat().map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
      ),
    })),
  ]
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
