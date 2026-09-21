'use client'

import { useState, useTransition } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'

import { duplicarProjetos, moverParaRascunho } from '../actions'
import { contarProjetos, rotuloDeStatus } from '../rules'
import type { LinhaProjetoAdmin, ResultadoAcao } from '../types'

type TabelaProjetosAdminProps = {
  linhas: LinhaProjetoAdmin[]
}

/**
 * Tabela de projetos com seleção e ações em massa (duplicar, mover para rascunho).
 * Quem usa dá uma `key` que muda a cada página ou busca, para a seleção começar vazia.
 */
export function TabelaProjetosAdmin({ linhas }: TabelaProjetosAdminProps) {
  const [selecionados, setSelecionados] = useState<ReadonlySet<string>>(new Set())
  const [aviso, setAviso] = useState<ResultadoAcao | null>(null)
  const [pendente, iniciar] = useTransition()

  const quantidade = selecionados.size
  const todos = quantidade === linhas.length
  const algum = quantidade > 0

  function alternar(id: string) {
    const proximo = new Set(selecionados)
    if (!proximo.delete(id)) proximo.add(id)
    setSelecionados(proximo)
  }

  function executar(acao: (ids: string[]) => Promise<ResultadoAcao>) {
    iniciar(async () => {
      const resultado = await acao([...selecionados])
      setAviso(resultado)
      if (resultado.ok) setSelecionados(new Set())
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <p aria-live="polite" className="mr-auto text-sm text-fg-muted">
          {algum
            ? `${contarProjetos(quantidade)} selecionado${quantidade === 1 ? '' : 's'}`
            : 'Selecione projetos para usar as ações.'}
        </p>
        <Button
          variant="secondary"
          iconLeft="copy"
          disabled={!algum}
          loading={pendente}
          onClick={() => executar(duplicarProjetos)}
        >
          Duplicar
        </Button>
        <Button
          variant="secondary"
          iconLeft="file-pen"
          disabled={!algum}
          loading={pendente}
          onClick={() => executar(moverParaRascunho)}
        >
          Mover para rascunho
        </Button>
      </div>

      {aviso && (
        <p
          role={aviso.ok ? 'status' : 'alert'}
          className={
            aviso.ok
              ? 'rounded-md border border-notification-success-border bg-notification-success-bg px-4 py-3 text-sm text-notification-success-fg'
              : 'rounded-md border border-notification-error-border bg-notification-error-bg px-4 py-3 text-sm text-notification-error-fg'
          }
        >
          {aviso.mensagem}
        </p>
      )}

      <Table caption="Projetos cadastrados">
        <TableHead>
          <tr>
            <TableHeaderCell className="w-px">
              <Checkbox
                hideLabel
                label="Selecionar todos os projetos desta página"
                checked={todos}
                ref={(campo) => {
                  if (campo) campo.indeterminate = algum && !todos
                }}
                onChange={() =>
                  setSelecionados(todos ? new Set() : new Set(linhas.map((linha) => linha.id)))
                }
              />
            </TableHeaderCell>
            <TableHeaderCell>Código</TableHeaderCell>
            <TableHeaderCell>Projeto</TableHeaderCell>
            <TableHeaderCell>Tipo</TableHeaderCell>
            <TableHeaderCell>Preço</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Criado em</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {linhas.map((linha) => (
            <TableRow key={linha.id} data-selected={selecionados.has(linha.id)}>
              <TableCell>
                <Checkbox
                  hideLabel
                  label={`Selecionar ${linha.titulo}`}
                  checked={selecionados.has(linha.id)}
                  onChange={() => alternar(linha.id)}
                />
              </TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">{linha.codigo}</TableCell>
              <TableCell className="min-w-56 font-medium">{linha.titulo}</TableCell>
              <TableCell className="whitespace-nowrap">{linha.tipoRotulo}</TableCell>
              <TableCell className="whitespace-nowrap">{linha.precoFormatado}</TableCell>
              <TableCell>
                <Badge variant={linha.status === 'publicado' ? 'success' : 'draft'}>
                  {rotuloDeStatus[linha.status]}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">
                {linha.criadoEmRotulo}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
