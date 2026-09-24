'use client'

import { useState } from 'react'

import { DialogoDeConfirmacao } from '@/components/shared/DialogoDeConfirmacao'
import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/FileInput'
import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { type AlcaDeArrasto, useArrastarParaReordenar } from '@/hooks/useArrastarParaReordenar'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_IMAGEM, LIMITES, nomePadraoPavimento } from '../rules'
import type { PavimentoProjeto } from '../types'
import { GradeDeImagens } from './GradeDeImagens'
import { ItemDaPlantaLinha } from './ItemDaPlantaLinha'

type BlocoColarListaProps = { form: FormularioProjetoApi; pavimentoId: string }

/** Textarea para colar uma lista crua e uma prévia para confirmar antes de os itens entrarem. */
function BlocoColarLista({ form, pavimentoId }: BlocoColarListaProps) {
  const [aberto, setAberto] = useState(false)
  const [texto, setTexto] = useState('')
  const previa = form.previaColada?.pavimentoId === pavimentoId ? form.previaColada.linhas : null

  if (previa) {
    return (
      <div className="flex flex-col gap-3 rounded-md border border-border bg-subtle p-3">
        <p className="text-sm font-medium">
          {previa.length > 0
            ? `Confira ${previa.length} ${previa.length === 1 ? 'item' : 'itens'} antes de adicionar:`
            : 'Nenhum item reconhecido nesse texto.'}
        </p>
        {previa.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm">
            {previa.map((linha, indice) => (
              <li key={indice} className="flex items-baseline justify-between gap-3">
                <span>{linha.nome}</span>
                {linha.metragem && <span className="text-fg-muted">{linha.metragem} m²</span>}
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              form.cancelarListaColada()
              setAberto(false)
              setTexto('')
            }}
          >
            Cancelar
          </Button>
          {previa.length > 0 && (
            <Button
              onClick={() => {
                form.confirmarListaColada()
                setAberto(false)
                setTexto('')
              }}
            >
              Adicionar
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!aberto) {
    return (
      <Button variant="secondary" iconLeft="file-text" onClick={() => setAberto(true)}>
        Colar lista
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder={'Uma linha por item, ex.:\nSala 24,36\nQuarto 1 12,5'}
        rows={5}
      />
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => {
            setAberto(false)
            setTexto('')
          }}
        >
          Cancelar
        </Button>
        <Button
          disabled={texto.trim() === ''}
          onClick={() => form.colarListaDeItens(pavimentoId, texto)}
        >
          Analisar
        </Button>
      </div>
    </div>
  )
}

type CartaoPavimentoProps = {
  form: FormularioProjetoApi
  pavimento: PavimentoProjeto
  /** Posição na lista: dá o nome padrão e é onde o formulário guarda os erros deste cartão. */
  indice: number
  dragHandleProps: AlcaDeArrasto
}

/** Um pavimento da aba "Planta Humanizada": nome, imagem obrigatória e informações opcionais. */
export function CartaoPavimento({
  form,
  pavimento,
  indice,
  dragHandleProps,
}: CartaoPavimentoProps) {
  const { erroDe, campo } = form
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const chaveImagem = `plantaHumanizada.${indice}.imagem`
  const nomeCampo = campo(`plantaHumanizada.${indice}.nome`)
  const imagemCampo = campo(chaveImagem)
  const { arrastando, handleProps, itemProps } = useArrastarParaReordenar({
    aoReordenar: (idOrigem, idDestino) =>
      form.reordenarItensDaPlanta(pavimento.id, idOrigem, idDestino),
  })

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={`Arrastar para reordenar o pavimento ${indice + 1}`}
          className="mt-7 shrink-0 cursor-grab touch-none rounded p-2 text-fg-muted hover:bg-subtle active:cursor-grabbing"
          {...dragHandleProps}
        >
          <Icon name="grip" />
        </button>

        <Field
          label="Nome do pavimento"
          htmlFor={nomeCampo.id}
          error={erroDe(nomeCampo.name)}
          className="flex-1"
        >
          <Input
            {...nomeCampo}
            value={pavimento.nome}
            maxLength={LIMITES.pavimentoNomeMax}
            placeholder={nomePadraoPavimento(indice)}
            autoComplete="off"
            onChange={(evento) => form.renomearPavimento(pavimento.id, evento.target.value)}
          />
        </Field>

        <div className="mt-6 flex shrink-0 gap-2">
          <IconButton
            icon="copy"
            label={`Duplicar o pavimento ${indice + 1}`}
            onClick={() => form.duplicarPavimento(pavimento.id)}
          />
          <IconButton
            icon="trash"
            label={`Excluir o pavimento ${indice + 1}`}
            onClick={() => setConfirmandoExclusao(true)}
          />
        </div>
      </div>

      <div>
        {pavimento.imagem ? (
          <GradeDeImagens
            imagens={[pavimento.imagem]}
            rotuloDeRemover={() => `Remover a imagem do pavimento ${indice + 1}`}
            aoRemover={() => form.removerImagemDoPavimento(pavimento.id)}
          />
        ) : (
          <FileInput
            id={imagemCampo.id}
            name={imagemCampo.name}
            label="Escolher a imagem da planta humanizada"
            hint="JPG, PNG ou WEBP, até 2 MB. Só 1 imagem."
            accept={ARQUIVOS_DE_IMAGEM.accept}
            invalid={imagemCampo.invalid}
            aria-describedby={imagemCampo['aria-describedby']}
            onFiles={(arquivos) => form.enviarImagemDoPavimento(pavimento.id, arquivos)}
          />
        )}
        <MensagensDeArquivo
          id={imagemCampo.id}
          erro={erroDe(chaveImagem)}
          recusas={form.avisosDeArquivo[`pavimento-${pavimento.id}`]}
        />
      </div>

      <details className="group rounded-lg border border-border">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span>Informações da planta ({pavimento.itens.length})</span>
          <Icon name="chevron-down" className="size-4 transition-transform group-open:rotate-180" />
        </summary>

        <div className="flex flex-col gap-4 border-t border-border p-4">
          {pavimento.itens.length > 0 && (
            <ul className="flex flex-col gap-2">
              {pavimento.itens.map((item, indiceDoItem) => (
                <li
                  key={item.id}
                  {...itemProps(item.id)}
                  className={arrastando === item.id ? 'opacity-50' : undefined}
                >
                  <ItemDaPlantaLinha
                    form={form}
                    pavimentoId={pavimento.id}
                    pavimentoIndice={indice}
                    item={item}
                    indice={indiceDoItem}
                    dragHandleProps={handleProps(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              iconLeft="plus"
              onClick={() => form.adicionarItemDaPlanta(pavimento.id)}
            >
              Adicionar item
            </Button>
            <BlocoColarLista form={form} pavimentoId={pavimento.id} />
          </div>
        </div>
      </details>

      <DialogoDeConfirmacao
        aberto={confirmandoExclusao}
        titulo={`Excluir o pavimento ${indice + 1}?`}
        descricao="A imagem e as informações deste pavimento são apagadas. Essa ação não pode ser desfeita."
        rotuloConfirmar="Excluir pavimento"
        aoConfirmar={() => {
          form.removerPavimento(pavimento.id)
          setConfirmandoExclusao(false)
        }}
        aoCancelar={() => setConfirmandoExclusao(false)}
      />
    </div>
  )
}
