import { useId } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'

import { textosDeEspecificacao } from '../conteudo'
import {
  formatarArea,
  formatarMetros,
  listarChavesDeEspecificacao,
  simNao,
  totalDeQuartos,
  type ChaveEspecificacao,
} from '../rules'
import type { ProjetoDetalhe } from '../types'

const icones: Record<ChaveEspecificacao, IconName> = {
  larguraTerreno: 'move-horizontal',
  profundidadeTerreno: 'move-vertical',
  areaConstruida: 'scaling',
  quartos: 'bed-single',
  suites: 'bed-double',
  banheiros: 'bath',
  vagas: 'car',
  pavimentos: 'layers',
  piscina: 'waves',
  areaGourmet: 'utensils',
}

function valorDe(chave: ChaveEspecificacao, projeto: ProjetoDetalhe): string {
  switch (chave) {
    case 'larguraTerreno':
      return formatarMetros(projeto.larguraM)
    case 'profundidadeTerreno':
      return formatarMetros(projeto.profundidadeM)
    case 'areaConstruida':
      return formatarArea(projeto.areaConstruidaM2)
    case 'quartos':
      return String(totalDeQuartos(projeto))
    case 'suites':
      return String(projeto.suites)
    case 'banheiros':
      return String(projeto.banheiros)
    case 'vagas':
      return String(projeto.vagas)
    case 'pavimentos':
      return String(projeto.pavimentos)
    case 'piscina':
      return simNao(projeto.piscina)
    case 'areaGourmet':
      return 'Sim'
  }
}

/**
 * Faixa com as medidas do terreno e da construção, cada uma com seu ícone. Quais itens aparecem
 * é decidido por `listarChavesDeEspecificacao` (`rules.ts`), a mesma lista que alimenta o
 * `GlossarioEspecificacoes` logo abaixo.
 */
export function EspecificacoesTecnicas({ projeto }: { projeto: ProjetoDetalhe }) {
  const headingId = useId()
  const chaves = listarChavesDeEspecificacao(projeto)

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-content px-4 py-6">
      <h2 id={headingId} className="sr-only">
        Especificações técnicas
      </h2>
      <dl className="grid grid-cols-2 gap-6 rounded-lg bg-subtle p-6 sm:grid-cols-3 lg:grid-cols-6">
        {chaves.map((chave) => (
          <div key={chave} className="flex flex-col items-start gap-2">
            <Icon name={icones[chave]} className="size-6 text-primary" strokeWidth={1.5} />
            <div>
              <dt className="text-xs text-fg-muted">{textosDeEspecificacao[chave].label}</dt>
              <dd className="font-semibold">{valorDe(chave, projeto)}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
