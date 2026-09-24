import { Accordion } from '@/components/ui/Accordion'

import { textosDeEspecificacao } from '../conteudo'
import { listarChavesDeEspecificacao } from '../rules'
import type { ProjetoDetalhe } from '../types'

/**
 * Seção recolhida (some se não houver nenhuma especificação) que explica, em linguagem simples,
 * cada item que aparece em `EspecificacoesTecnicas` — mesma lista (`listarChavesDeEspecificacao`),
 * então nunca sai de sincronia. Fica minimizada por padrão; abre com o clique no `Accordion`.
 */
export function GlossarioEspecificacoes({ projeto }: { projeto: ProjetoDetalhe }) {
  const chaves = listarChavesDeEspecificacao(projeto)
  if (chaves.length === 0) return null

  const conteudo = (
    <dl className="grid gap-4 sm:grid-cols-2">
      {chaves.map((chave) => (
        <div key={chave}>
          <dt className="font-medium">{textosDeEspecificacao[chave].label}</dt>
          <dd>{textosDeEspecificacao[chave].explicacao}</dd>
        </div>
      ))}
    </dl>
  )

  return (
    <section aria-label="O que significa cada especificação" className="mx-auto max-w-content px-4 pb-6">
      <Accordion items={[{ title: 'O que significa cada especificação?', content: conteudo }]} />
    </section>
  )
}
