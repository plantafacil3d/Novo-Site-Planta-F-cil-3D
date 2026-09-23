'use client'

import { useState, useTransition } from 'react'

import { DialogoDeConfirmacao } from '@/components/shared/DialogoDeConfirmacao'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { Icon, type IconName } from '@/components/ui/Icon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { excluirArquivosDaBiblioteca } from '../actions'
import { contarArquivos, formatarData, formatarTamanho } from '../rules'
import type { LinhaDaBibliotecaAdmin, ResultadoDaBiblioteca } from '../types'
import { DialogoDeRenomear } from './DialogoDeRenomear'

type TabelaBibliotecaAdminProps = {
  linhas: LinhaDaBibliotecaAdmin[]
}

const iconePorTipo = (tipoMime: string): IconName =>
  tipoMime.startsWith('image/') ? 'image' : 'file-text'

function rotuloDoTipo(tipoMime: string, caminho: string): string {
  if (tipoMime.startsWith('image/')) return 'Imagem'
  if (tipoMime === 'application/pdf') return 'PDF'
  if (caminho.toLowerCase().endsWith('.dwg')) return 'DWG'
  return 'Arquivo'
}

/** "1 projeto" / "3 projetos" */
const contarProjetos = (quantidade: number) =>
  `${quantidade} ${quantidade === 1 ? 'projeto' : 'projetos'}`

/**
 * Tabela da biblioteca: seleção, exclusão em massa ou por linha. Regra de negócio: excluir um
 * arquivo daqui some dele em TODOS os projetos que o usavam (o banco cuida disso por cascade), então
 * o diálogo de confirmação avisa quantos projetos cada arquivo selecionado atinge antes de apagar.
 */
export function TabelaBibliotecaAdmin({ linhas }: TabelaBibliotecaAdminProps) {
  const [selecionados, setSelecionados] = useState<ReadonlySet<string>>(new Set())
  const [aviso, setAviso] = useState<ResultadoDaBiblioteca | null>(null)
  // Quais arquivos estão esperando a confirmação de exclusão: `null` é diálogo fechado. O mesmo
  // estado serve para a ação em massa e para o botão de uma linha, que manda um id só.
  const [exclusao, setExclusao] = useState<string[] | null>(null)
  // Arquivo esperando o diálogo de renomear; `null` é fechado.
  const [renomeando, setRenomeando] = useState<LinhaDaBibliotecaAdmin | null>(null)
  const [pendente, iniciar] = useTransition()

  const quantidade = selecionados.size
  const todos = quantidade === linhas.length
  const algum = quantidade > 0
  const itensDaExclusao = exclusao ? linhas.filter((linha) => exclusao.includes(linha.id)) : []
  const emUso = itensDaExclusao.filter((item) => item.vinculos > 0)

  function alternar(id: string) {
    const proximo = new Set(selecionados)
    if (!proximo.delete(id)) proximo.add(id)
    setSelecionados(proximo)
  }

  function executar(ids: string[]) {
    iniciar(async () => {
      const resultado = await excluirArquivosDaBiblioteca(ids)
      setAviso(resultado)
      setExclusao(null)
      if (resultado.ok) setSelecionados(new Set())
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <p aria-live="polite" className="mr-auto text-sm text-fg-muted">
          {algum
            ? `${contarArquivos(quantidade)} selecionado${quantidade === 1 ? '' : 's'}`
            : 'Selecione arquivos para excluir.'}
        </p>
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

      <Table caption="Arquivos da biblioteca de exemplos">
        <TableHead>
          <tr>
            <TableHeaderCell className="w-px">
              <Checkbox
                hideLabel
                label="Selecionar todos os arquivos desta página"
                checked={todos}
                ref={(campo) => {
                  if (campo) campo.indeterminate = algum && !todos
                }}
                onChange={() =>
                  setSelecionados(todos ? new Set() : new Set(linhas.map((linha) => linha.id)))
                }
              />
            </TableHeaderCell>
            <TableHeaderCell>Arquivo</TableHeaderCell>
            <TableHeaderCell>Tipo</TableHeaderCell>
            <TableHeaderCell>Tamanho</TableHeaderCell>
            <TableHeaderCell>Em uso</TableHeaderCell>
            <TableHeaderCell>Enviado em</TableHeaderCell>
            <TableHeaderCell className="text-right">Ações</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {linhas.map((linha) => (
            <TableRow key={linha.id} data-selected={selecionados.has(linha.id)}>
              <TableCell>
                <Checkbox
                  hideLabel
                  label={`Selecionar ${linha.nomeOriginal}`}
                  checked={selecionados.has(linha.id)}
                  onChange={() => alternar(linha.id)}
                />
              </TableCell>
              <TableCell className="min-w-56 font-medium">
                <span className="flex items-center gap-2">
                  <Icon
                    name={iconePorTipo(linha.tipoMime)}
                    className="size-4 shrink-0 text-fg-muted"
                  />
                  <span className="truncate">{linha.nomeOriginal}</span>
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">
                {rotuloDoTipo(linha.tipoMime, linha.caminho)}
              </TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">
                {formatarTamanho(linha.tamanhoBytes)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {linha.vinculos > 0 ? (
                  <Badge variant="accent">{contarProjetos(linha.vinculos)}</Badge>
                ) : (
                  <span className="text-fg-muted">Não usado</span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap text-fg-muted">
                {formatarData(linha.criadoEm)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <DropdownMenu
                    // O leitor de tela ouve "Ações de fachada.pdf", não 20 menus iguais.
                    label={`Ações de ${linha.nomeOriginal}`}
                    disabled={pendente}
                    items={[
                      {
                        key: 'baixar',
                        label: 'Baixar',
                        icon: 'cloud-download',
                        // Nova aba: o link é de outro domínio (Storage), então não some da tabela.
                        onSelect: () => window.open(linha.url, '_blank', 'noopener,noreferrer'),
                      },
                      {
                        key: 'renomear',
                        label: 'Renomear',
                        icon: 'pencil',
                        onSelect: () => setRenomeando(linha),
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
        titulo={`Excluir ${contarArquivos(itensDaExclusao.length)}?`}
        descricao={
          emUso.length > 0
            ? `${contarArquivos(emUso.length)} ${emUso.length === 1 ? 'está vinculado' : 'estão vinculados'} a pelo menos um projeto — ${emUso.length === 1 ? 'ele vai sumir' : 'eles vão sumir'} de lá também. O arquivo é apagado de vez do armazenamento. Não é possível desfazer.`
            : 'O arquivo é apagado de vez do armazenamento. Não é possível desfazer.'
        }
        itens={itensDaExclusao.map((item) =>
          item.vinculos > 0
            ? `${item.nomeOriginal} — em uso em ${contarProjetos(item.vinculos)}`
            : item.nomeOriginal,
        )}
        rotuloConfirmar="Excluir definitivamente"
        carregando={pendente}
        aoConfirmar={() => exclusao && executar(exclusao)}
        // Esc e clique no fundo não podem fechar no meio da exclusão.
        aoCancelar={() => !pendente && setExclusao(null)}
      />

      <DialogoDeRenomear
        // Muda a cada arquivo diferente: o campo nasce com o nome atual dele (ver o componente).
        key={renomeando?.id ?? 'fechado'}
        arquivo={renomeando}
        aoFechar={(resultado) => {
          if (resultado) setAviso(resultado)
          setRenomeando(null)
        }}
      />
    </div>
  )
}
