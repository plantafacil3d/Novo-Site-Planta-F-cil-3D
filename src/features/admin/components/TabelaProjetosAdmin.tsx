'use client'

import { useState, useTransition } from 'react'

import { DialogoDeConfirmacao } from '@/components/shared/DialogoDeConfirmacao'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { duplicarProjetos, excluirProjetos, moverParaRascunho, publicarProjetos } from '../actions'
import { contarProjetos, rotuloDeStatus } from '../rules'
import type { LinhaProjetoAdmin, ResultadoAcao } from '../types'

type TabelaProjetosAdminProps = {
  linhas: LinhaProjetoAdmin[]
}

/**
 * Tabela de projetos com seleção, ações em massa (duplicar, mover para rascunho, excluir) e as
 * ações de cada linha. Quem usa dá uma `key` que muda a cada página ou busca, para a seleção
 * começar vazia.
 */
export function TabelaProjetosAdmin({ linhas }: TabelaProjetosAdminProps) {
  const [selecionados, setSelecionados] = useState<ReadonlySet<string>>(new Set())
  const [aviso, setAviso] = useState<ResultadoAcao | null>(null)
  // Quais projetos estão esperando a confirmação de exclusão: `null` é diálogo fechado. O mesmo
  // estado serve para a ação em massa e para o botão de uma linha, que manda um id só.
  const [exclusao, setExclusao] = useState<string[] | null>(null)
  const [pendente, iniciar] = useTransition()

  const quantidade = selecionados.size
  const todos = quantidade === linhas.length
  const algum = quantidade > 0
  const titulosDaExclusao = exclusao
    ? linhas.filter((linha) => exclusao.includes(linha.id)).map((linha) => linha.titulo)
    : []

  function alternar(id: string) {
    const proximo = new Set(selecionados)
    if (!proximo.delete(id)) proximo.add(id)
    setSelecionados(proximo)
  }

  function executar(
    acao: (ids: string[]) => Promise<ResultadoAcao>,
    ids: string[] = [...selecionados],
  ) {
    iniciar(async () => {
      const resultado = await acao(ids)
      setAviso(resultado)
      // Só fecha ao terminar: até lá o diálogo fica aberto com o spinner. Nas ações em massa já
      // está fechado, então aqui não muda nada.
      setExclusao(null)
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
        <Button
          variant="secondary"
          iconLeft="trash"
          disabled={!algum}
          loading={pendente}
          onClick={() => setExclusao([...selecionados])}
        >
          Excluir
        </Button>
      </div>

      {aviso && <Alert variant={aviso.ok ? 'success' : 'error'}>{aviso.mensagem}</Alert>}

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
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Preço</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Criado em</TableHeaderCell>
            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
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
              <TableCell className="whitespace-nowrap">{linha.categoriaRotulo}</TableCell>
              <TableCell className="whitespace-nowrap">{linha.precoFormatado}</TableCell>
              <TableCell>
                <Badge variant={linha.status === 'publicado' ? 'success' : 'draft'}>
                  {rotuloDeStatus[linha.status]}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">
                {linha.criadoEmRotulo}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <DropdownMenu
                    // O leitor de tela ouve "Ações de Sobrado com Piscina", não 20 menus iguais.
                    label={`Ações de ${linha.titulo}`}
                    disabled={pendente}
                    items={[
                      {
                        key: 'editar',
                        label: 'Editar projeto',
                        icon: 'pencil',
                        href: `/admin/projetos/${linha.id}/editar`,
                      },
                      linha.status === 'rascunho'
                        ? {
                            key: 'publicar',
                            label: 'Publicar projeto',
                            icon: 'check',
                            onSelect: () => executar(publicarProjetos, [linha.id]),
                          }
                        : {
                            key: 'rascunho',
                            label: 'Salvar como rascunho',
                            icon: 'file-pen',
                            onSelect: () => executar(moverParaRascunho, [linha.id]),
                          },
                      {
                        key: 'excluir',
                        label: 'Excluir',
                        icon: 'trash',
                        tone: 'danger',
                        onSelect: () => setExclusao([linha.id]),
                      },
                    ]}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DialogoDeConfirmacao
        aberto={exclusao !== null}
        titulo={`Excluir ${contarProjetos(titulosDaExclusao.length)}?`}
        descricao="As imagens, os arquivos de entrega e os projetos complementares também serão apagados. Não é possível desfazer."
        itens={titulosDaExclusao}
        rotuloConfirmar="Excluir definitivamente"
        carregando={pendente}
        aoConfirmar={() => exclusao && executar(excluirProjetos, exclusao)}
        // Esc e clique no fundo não podem fechar no meio da exclusão.
        aoCancelar={() => !pendente && setExclusao(null)}
      />
    </div>
  )
}
