import type { KeyboardEvent } from 'react'

import { Field } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { type AlcaDeArrasto } from '@/hooks/useArrastarParaReordenar'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { LIMITES } from '../rules'
import type { ItemDaPlanta } from '../types'

type ItemDaPlantaLinhaProps = {
  form: FormularioProjetoApi
  pavimentoId: string
  /** Posição do pavimento no cadastro: os erros do formulário são guardados por posição. */
  pavimentoIndice: number
  item: ItemDaPlanta
  indice: number
  dragHandleProps: AlcaDeArrasto
}

/** Uma linha da lista "Informações da planta": nome, metragem e número da bolinha, todos opcionais
 *  menos o nome. Enter no campo de metragem cria a próxima linha, com o cursor no nome dela. */
export function ItemDaPlantaLinha({
  form,
  pavimentoId,
  pavimentoIndice,
  item,
  indice,
  dragHandleProps,
}: ItemDaPlantaLinhaProps) {
  const { erroDe, campo } = form
  const chave = (nome: string) => `plantaHumanizada.${pavimentoIndice}.itens.${indice}.${nome}`
  const nomeCampo = campo(chave('nome'))
  const metragemCampo = campo(chave('metragem'))
  const numeroCampo = campo(chave('numeroBolinha'))

  function aoTeclarNaMetragem(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key !== 'Enter') return
    evento.preventDefault()
    form.adicionarItemDaPlanta(pavimentoId)
  }

  return (
    <div className="flex items-start gap-2">
      <button
        type="button"
        aria-label={`Arrastar para reordenar o item ${indice + 1}`}
        className="mt-7 shrink-0 cursor-grab touch-none rounded p-2 text-fg-muted hover:bg-subtle active:cursor-grabbing"
        {...dragHandleProps}
      >
        <Icon name="grip" />
      </button>

      <div className="grid flex-1 grid-cols-[1fr_7rem_5rem] gap-2">
        <Field label="Nome" htmlFor={nomeCampo.id} error={erroDe(chave('nome'))}>
          <Input
            {...nomeCampo}
            value={item.nome}
            maxLength={LIMITES.itemDaPlantaNomeMax}
            placeholder="Ex.: Sala"
            autoComplete="off"
            onChange={(evento) =>
              form.atualizarItemDaPlanta(pavimentoId, item.id, { nome: evento.target.value })
            }
          />
        </Field>
        <Field label="Metragem" htmlFor={metragemCampo.id} error={erroDe(chave('metragem'))}>
          <Input
            {...metragemCampo}
            value={item.metragem}
            inputMode="decimal"
            placeholder="24,36"
            autoComplete="off"
            onKeyDown={aoTeclarNaMetragem}
            onChange={(evento) =>
              form.atualizarItemDaPlanta(pavimentoId, item.id, { metragem: evento.target.value })
            }
          />
        </Field>
        <Field label="Nº" htmlFor={numeroCampo.id} error={erroDe(chave('numeroBolinha'))}>
          <Input
            {...numeroCampo}
            value={item.numeroBolinha}
            inputMode="numeric"
            placeholder="1"
            autoComplete="off"
            onChange={(evento) =>
              form.atualizarItemDaPlanta(pavimentoId, item.id, {
                numeroBolinha: evento.target.value.replace(/\D/g, ''),
              })
            }
          />
        </Field>
      </div>

      <IconButton
        icon="trash"
        label={`Remover o item ${indice + 1}`}
        onClick={() => form.removerItemDaPlanta(pavimentoId, item.id)}
        className="mt-6"
      />
    </div>
  )
}
