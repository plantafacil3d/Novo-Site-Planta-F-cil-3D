import { Section } from '@/components/layout/Section'
import { CheckList } from '@/components/shared/CheckList'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { Icon } from '@/components/ui/Icon'

import { avisosImportantes, entregaveis } from '../conteudo'

/** "O que está incluso": entregáveis do pacote e o aviso "Importante saber". */
export function IncluidoNoProjeto() {
  return (
    <Section
      title="O que está incluso"
      subtitle="Tudo o que você precisa para começar seu projeto."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-4">
          {entregaveis.map((entregavel) => (
            <li key={entregavel.titulo} className="rounded-lg border border-border bg-surface p-4">
              <FeatureItem
                layout="stack"
                titleAs="h3"
                icon={entregavel.icon}
                title={entregavel.titulo}
                description={entregavel.detalhe}
              />
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-lg bg-tint p-6">
          <h3 className="flex items-center gap-2 text-lg">
            <Icon name="info" className="size-5" />
            Importante saber
          </h3>
          <div className="mt-4">
            <CheckList items={avisosImportantes} />
          </div>
        </div>
      </div>
    </Section>
  )
}
