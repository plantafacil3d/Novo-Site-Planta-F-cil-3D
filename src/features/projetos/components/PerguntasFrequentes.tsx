import { Section } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'

import {
  perguntaItensInclusos,
  perguntasFrequentes,
  respostaItensInclusosPadrao,
} from '../conteudo'
import { descreverItensInclusos } from '../rules'
import type { ProjetoDetalhe } from '../types'

type PerguntasFrequentesProps = {
  projeto: Pick<ProjetoDetalhe, 'itensInclusos' | 'larguraM' | 'profundidadeM'>
  /** Link do WhatsApp já com a mensagem deste projeto (nome e endereço da página). */
  linkWhatsapp: string
}

/**
 * Perguntas frequentes em duas colunas (uma no celular), cada pergunta abre e fecha. A primeira
 * resposta resume, numa frase, os itens inclusos do cadastro; sem itens, usa o texto padrão. Abaixo
 * das perguntas, fora da sanfona, fica o convite "Tem outra dúvida?" com o botão do WhatsApp.
 */
export function PerguntasFrequentes({ projeto, linkWhatsapp }: PerguntasFrequentesProps) {
  const { itensInclusos, larguraM, profundidadeM } = projeto
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
    ...perguntasFrequentes.map((item) => {
      const resposta =
        typeof item.resposta === 'function'
          ? item.resposta({ larguraM, profundidadeM })
          : item.resposta
      return {
        title: item.pergunta,
        content: (
          <div className="flex flex-col gap-3">
            {[resposta].flat().map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
          </div>
        ),
      }
    }),
  ]
  const metade = Math.ceil(itens.length / 2)

  return (
    <Section title="Perguntas frequentes" subtitle="Tire suas dúvidas antes de comprar.">
      <div className="grid items-start gap-3 lg:grid-cols-2 lg:gap-6">
        <Accordion items={itens.slice(0, metade)} />
        <Accordion items={itens.slice(metade)} />
      </div>
      <div className="mt-6 flex flex-col items-start gap-4 rounded-lg bg-subtle p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Tem outra dúvida?</p>
          <p className="text-fg-muted">Fale com a gente agora e a gente esclarece rapidinho.</p>
        </div>
        <Button variant="whatsapp" href={linkWhatsapp}>
          Chamar no WhatsApp
        </Button>
      </div>
    </Section>
  )
}
