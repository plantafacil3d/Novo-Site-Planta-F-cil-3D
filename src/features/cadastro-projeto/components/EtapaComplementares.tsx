import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/Button'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { CartaoComplementar } from './CartaoComplementar'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Aba 6 (opcional): projetos extras vendidos à parte, quantos forem necessários. */
export function EtapaComplementares({ form }: { form: FormularioProjetoApi }) {
  const { dados } = form

  return (
    <PainelDaEtapa
      titulo="Complementares"
      descricao="Opcional. Projetos extras vendidos à parte, como elétrico ou marcenaria."
    >
      <div>
        <Button variant="secondary" iconLeft="plus" onClick={form.adicionarComplementar}>
          Adicionar projeto complementar
        </Button>
      </div>

      {dados.complementares.length === 0 ? (
        <EmptyState
          icon="layers"
          title="Nenhum projeto complementar"
          description="Se este projeto tiver extras vendidos à parte, adicione-os aqui."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {dados.complementares.map((complementar, indice) => (
            <li key={complementar.id}>
              <CartaoComplementar form={form} complementar={complementar} indice={indice} />
            </li>
          ))}
        </ul>
      )}
    </PainelDaEtapa>
  )
}
