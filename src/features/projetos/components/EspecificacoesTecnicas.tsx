import { useId } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'

import { formatarArea, formatarMetros, simNao, totalDeQuartos } from '../rules'
import type { ProjetoDetalhe } from '../types'

type Item = { icon: IconName; label: string; valor: string }

/**
 * Faixa com as medidas do terreno e da construção, cada uma com seu ícone.
 * No Cadastro, 0 significa "o projeto não tem" (ver `EtapaCaracteristicas`), então esses campos
 * somem daqui — exceto Piscina, que sempre aparece como Sim/Não.
 */
export function EspecificacoesTecnicas({ projeto }: { projeto: ProjetoDetalhe }) {
  const headingId = useId()
  const quartos = totalDeQuartos(projeto)

  const candidatos: (Item | false)[] = [
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
    quartos > 0 && { icon: 'bed-single', label: 'Quartos', valor: String(quartos) },
    projeto.suites > 0 && { icon: 'bed-double', label: 'Suítes', valor: String(projeto.suites) },
    projeto.banheiros > 0 && {
      icon: 'bath',
      label: 'Banheiros',
      valor: String(projeto.banheiros),
    },
    projeto.vagas > 0 && {
      icon: 'car',
      label: 'Vagas de garagem',
      valor: String(projeto.vagas),
    },
    { icon: 'layers', label: 'Pavimentos', valor: String(projeto.pavimentos) },
    { icon: 'waves', label: 'Piscina', valor: simNao(projeto.piscina) },
    projeto.areaGourmet && { icon: 'utensils', label: 'Área gourmet', valor: 'Sim' },
  ]
  const itens = candidatos.filter((item): item is Item => item !== false)

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
