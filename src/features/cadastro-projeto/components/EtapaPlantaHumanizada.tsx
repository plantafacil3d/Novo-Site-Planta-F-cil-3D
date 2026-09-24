import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/Button'
import { useArrastarParaReordenar } from '@/hooks/useArrastarParaReordenar'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { CartaoPavimento } from './CartaoPavimento'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Aba 2.1 (opcional): a planta humanizada de cada pavimento — imagem e, se quiser, a lista de
 *  informações que aparece do lado dela na página pública. */
export function EtapaPlantaHumanizada({ form }: { form: FormularioProjetoApi }) {
  const { dados } = form
  const { arrastando, handleProps, itemProps } = useArrastarParaReordenar({
    aoReordenar: form.reordenarPavimentos,
  })

  return (
    <PainelDaEtapa
      titulo="Planta Humanizada"
      descricao="Opcional. Cadastre a planta de cada pavimento para mostrar na página do projeto, com a imagem de um lado e as informações do outro."
    >
      <div>
        <Button variant="secondary" iconLeft="plus" onClick={form.adicionarPavimento}>
          Adicionar pavimento
        </Button>
      </div>

      {dados.plantaHumanizada.length === 0 ? (
        <EmptyState
          icon="layout-grid"
          title="Nenhum pavimento cadastrado"
          description="Se quiser mostrar a planta humanizada deste projeto, adicione o primeiro pavimento."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {dados.plantaHumanizada.map((pavimento, indice) => (
            <li
              key={pavimento.id}
              {...itemProps(pavimento.id)}
              className={arrastando === pavimento.id ? 'opacity-50' : undefined}
            >
              <CartaoPavimento
                form={form}
                pavimento={pavimento}
                indice={indice}
                dragHandleProps={handleProps(pavimento.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </PainelDaEtapa>
  )
}
