'use client'

import { useState, type KeyboardEvent } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { LIMITES, adicionarTexto, semSimbolos } from '../rules'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Aba 4: o que o comprador recebe. A lista começa vazia; é preciso ter pelo menos 1 item. */
export function EtapaItensIncluidos({ form }: { form: FormularioProjetoApi }) {
  const { dados, erroDe } = form
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)
  const campo = form.campo('itens')
  const mensagem = aviso ?? erroDe('itens')

  function adicionar() {
    const resultado = adicionarTexto(dados.itens, texto, {
      limite: LIMITES.itensMax,
      repetido: 'Esse item já está na lista.',
      cheio: `A lista chegou ao limite de ${LIMITES.itensMax} itens.`,
    })
    setAviso(resultado.erro)
    if (resultado.erro) return
    if (resultado.lista.length > dados.itens.length) form.atualizar({ itens: resultado.lista })
    setTexto('')
    form.tocar('itens')
  }

  function aoTeclar(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key !== 'Enter') return
    evento.preventDefault()
    adicionar()
  }

  return (
    <PainelDaEtapa
      titulo="Itens Incluídos"
      descricao="Liste o que o comprador recebe. Adicione pelo menos 1 item."
    >
      <div className="flex flex-col gap-2">
        <Field label="Novo item" htmlFor={campo.id} error={mensagem}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id={campo.id}
              name={campo.name}
              value={texto}
              maxLength={LIMITES.itemMax}
              invalid={Boolean(mensagem)}
              aria-describedby={mensagem ? `${campo.id}-erro` : undefined}
              autoComplete="off"
              onChange={(evento) => {
                setTexto(semSimbolos(evento.target.value))
                setAviso(null)
              }}
              onBlur={() => form.tocar('itens')}
              onKeyDown={aoTeclar}
            />
            <Button variant="secondary" iconLeft="plus" onClick={adicionar} className="sm:shrink-0">
              Adicionar
            </Button>
          </div>
        </Field>
      </div>

      {dados.itens.length === 0 ? (
        <EmptyState
          icon="file-text"
          title="Nenhum item adicionado"
          description="Digite o que o comprador recebe e clique em Adicionar."
        />
      ) : (
        <ul className="flex flex-col gap-2" aria-label="Itens incluídos">
          {dados.itens.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-md border border-border bg-surface py-1 pr-1 pl-3"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-fg">
                <Icon name="check" className="size-3" />
              </span>
              <span className="min-w-0 flex-1 text-sm break-words">{item}</span>
              <IconButton
                icon="trash"
                label={`Remover o item ${item}`}
                onClick={() =>
                  form.atualizar({ itens: dados.itens.filter((outro) => outro !== item) })
                }
                className="bg-transparent shadow-none"
              />
            </li>
          ))}
        </ul>
      )}
    </PainelDaEtapa>
  )
}
