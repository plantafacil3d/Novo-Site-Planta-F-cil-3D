'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

import { renomearArquivoDaBiblioteca } from '../actions'
import { NOME_MAXIMO } from '../rules'
import type { LinhaDaBibliotecaAdmin, ResultadoDaBiblioteca } from '../types'

type DialogoDeRenomearProps = {
  /** `null` fecha o diálogo. */
  arquivo: LinhaDaBibliotecaAdmin | null
  /** Chamado ao fechar; vem com o resultado só quando o servidor confirmou o novo nome. */
  aoFechar: (resultado: ResultadoDaBiblioteca | null) => void
}

/**
 * Diálogo para trocar o nome de exibição de um arquivo da biblioteca. O caminho no Storage não
 * muda (é baseado no id, não no nome) — salvar aqui já atualiza o nome em todo lugar que o mostra,
 * porque o cadastro de projeto lê o nome ao vivo, nunca guarda uma cópia (`actions.ts`).
 *
 * Quem usa dá uma `key` que muda a cada arquivo (ex.: o id) para o campo nascer com o nome atual
 * dele — sem isso precisaria de um efeito só para sincronizar prop com estado.
 */
export function DialogoDeRenomear({ arquivo, aoFechar }: DialogoDeRenomearProps) {
  const [nome, setNome] = useState(arquivo?.nomeOriginal ?? '')
  const [erro, setErro] = useState<string | null>(null)
  const [pendente, iniciar] = useTransition()

  function fechar() {
    if (!pendente) aoFechar(null)
  }

  function salvar() {
    if (!arquivo) return
    iniciar(async () => {
      const resultado = await renomearArquivoDaBiblioteca({ id: arquivo.id, nomeOriginal: nome })
      if (!resultado.ok) {
        setErro(resultado.mensagem)
        return
      }
      aoFechar(resultado)
    })
  }

  return (
    <Modal
      open={arquivo !== null}
      onClose={fechar}
      label="Renomear arquivo"
      tone="surface"
      className="mx-auto max-w-md p-6"
    >
      <div className="flex flex-col gap-4">
        <h2 className="pr-10 text-xl">Renomear arquivo</h2>

        <Field
          label="Nome de exibição"
          htmlFor="renomear-arquivo"
          error={erro ?? undefined}
          counter={`${nome.length}/${NOME_MAXIMO}`}
        >
          <Input
            id="renomear-arquivo"
            value={nome}
            maxLength={NOME_MAXIMO}
            disabled={pendente}
            invalid={!!erro}
            onChange={(evento) => setNome(evento.target.value)}
          />
        </Field>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={fechar} disabled={pendente}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={salvar} loading={pendente}>
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
