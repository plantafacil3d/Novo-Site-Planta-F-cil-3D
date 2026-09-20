import { useId } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'

import { formatarArea, formatarMetros, simNao, totalDeQuartos } from '../rules'
import type { ProjetoDetalhe } from '../types'

/** Faixa com as medidas do terreno e da construção, cada uma com seu ícone. */
export function EspecificacoesTecnicas({ projeto }: { projeto: ProjetoDetalhe }) {
  const headingId = useId()
  const itens: { icon: IconName; label: string; valor: string }[] = [
    {
      icon: 'move-horizontal',
      label: 'Largura do terreno',
      valor: formatarMetros(projeto.larguraM),
    },
    {
      icon: 'move-vertical',
      label: 'Profundidade do terreno',
      valor: formatarMetros(projeto.profundidadeM),
    },
    { icon: 'scaling', label: 'Área construída', valor: formatarArea(projeto.areaConstruidaM2) },
    { icon: 'bed-single', label: 'Quartos', valor: String(totalDeQuartos(projeto)) },
    { icon: 'bed-double', label: 'Suítes', valor: String(projeto.suites) },
    { icon: 'bath', label: 'Banheiros', valor: String(projeto.banheiros) },
    { icon: 'car', label: 'Vagas de garagem', valor: String(projeto.vagas) },
    { icon: 'layers', label: 'Pavimentos', valor: String(projeto.pavimentos) },
    { icon: 'waves', label: 'Piscina', valor: simNao(projeto.piscina) },
    { icon: 'shirt', label: 'Closet', valor: simNao(projeto.closet) },
    { icon: 'utensils', label: 'Área gourmet', valor: simNao(projeto.areaGourmet) },
  ]

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-content px-4 py-6">
      <h2 id={headingId} className="sr-only">
        Especificações técnicas
      </h2>
      <dl className="grid grid-cols-2 gap-6 rounded-lg bg-subtle p-6 sm:grid-cols-3 lg:grid-cols-6">
        {itens.map((item) => (
          <div key={item.label} className="flex flex-col items-start gap-2">
            <Icon name={item.icon} className="size-6 text-primary" strokeWidth={1.5} />
            <div>
              <dt className="text-xs text-fg-muted">{item.label}</dt>
              <dd className="font-semibold">{item.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
