'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'

import { DialogoDeConfirmacao } from '@/components/shared/DialogoDeConfirmacao'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'

import { excluirProduto } from '../actions'
import { contarProjetos, listarAmbientes, rotuloDaOrigem } from '../rules'
import type { LinhaProdutoAdmin, ResultadoProduto } from '../types'

/**
 * Tabela do menu Produtos. Editar abre a página do produto (como em Projetos). Excluir só existe
 * aqui: o produto sai da Loja e de todos os projetos, então a confirmação diz quantos projetos usa.
 */
export function TabelaProdutosAdmin({ linhas }: { linhas: LinhaProdutoAdmin[] }) {
  const [exclusao, setExclusao] = useState<LinhaProdutoAdmin | null>(null)
  const [aviso, setAviso] = useState<ResultadoProduto | null>(null)
  const [pendente, iniciar] = useTransition()

  function excluir(produto: LinhaProdutoAdmin) {
    iniciar(async () => {
      const resultado = await excluirProduto(produto.id)
      setAviso(resultado)
      setExclusao(null)
    })
  }

  if (linhas.length === 0 && !aviso) return null

  return (
    <div className="flex flex-col gap-4">
      {aviso && <Alert variant={aviso.ok ? 'success' : 'error'}>{aviso.mensagem}</Alert>}

      {linhas.length > 0 && (
        <Table caption="Produtos cadastrados">
          <TableHead>
            <tr>
              <TableHeaderCell>Produto</TableHeaderCell>
              <TableHeaderCell>Categoria</TableHeaderCell>
              <TableHeaderCell>Ambientes</TableHeaderCell>
              <TableHeaderCell>Origem</TableHeaderCell>
              <TableHeaderCell>Situação</TableHeaderCell>
              <TableHeaderCell>Projetos</TableHeaderCell>
              <TableHeaderCell className="text-right">Ações</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {linhas.map((linha) => (
              <TableRow key={linha.id}>
                <TableCell className="min-w-64 font-medium">
                  <span className="flex items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-subtle">
                      <Image
                        src={linha.fotoUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <span className="line-clamp-2">{linha.nome}</span>
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-fg-muted">{linha.categoria}</TableCell>
                <TableCell className="min-w-40 text-fg-muted">
                  {listarAmbientes(linha.ambientes)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-fg-muted">
                  {rotuloDaOrigem(linha.origem)}
                </TableCell>
                <TableCell>
                  {linha.ativo ? (
                    <Badge variant="success">Ativo</Badge>
                  ) : (
                    <Badge variant="neutral">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-fg-muted">
                  {contarProjetos(linha.projetos)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu
                    label={`Ações de ${linha.nome}`}
                    disabled={pendente}
                    items={[
                      {
                        key: 'editar',
                        label: 'Editar produto',
                        icon: 'pencil',
                        href: `/admin/produtos/${linha.id}/editar`,
                      },
                      {
                        key: 'excluir',
                        label: 'Excluir',
                        icon: 'trash',
                        tone: 'danger',
                        onSelect: () => setExclusao(linha),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DialogoDeConfirmacao
        aberto={exclusao !== null}
        titulo="Excluir este produto?"
        descricao={
          exclusao && exclusao.projetos > 0
            ? `Ele sai da Loja e de ${contarProjetos(exclusao.projetos)}. Não dá para desfazer.`
            : 'Ele sai da Loja. Não dá para desfazer.'
        }
        itens={exclusao ? [exclusao.nome] : undefined}
        rotuloConfirmar="Excluir produto"
        carregando={pendente}
        aoConfirmar={() => exclusao && excluir(exclusao)}
        aoCancelar={() => setExclusao(null)}
      />
    </div>
  )
}
