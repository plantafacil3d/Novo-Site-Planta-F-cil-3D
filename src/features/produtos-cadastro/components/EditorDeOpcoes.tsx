'use client'

import { useId, useState } from 'react'

import { DialogoDeConfirmacao } from '@/components/shared/DialogoDeConfirmacao'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'

import { tiposDeOpcao, type TipoDeOpcao } from '../catalogo'
import { useOpcoesDoProduto } from '../hooks/useOpcoesDoProduto'
import { LIMITES_PRODUTO, nomeJaExiste } from '../rules'
import { schemaNomeDaOpcao } from '../schemas'
import type { OpcaoDoProduto } from '../types'

const contarProdutos = (n: number) => `${n} ${n === 1 ? 'produto' : 'produtos'}`

/**
 * "Editar categorias" / "Editar ambientes": abre logo abaixo (sem janela flutuante) a lista com
 * adicionar e apagar. O que for criado aqui fica disponível para todos os produtos.
 */
export function EditorDeOpcoes({
  tipo,
  opcoes,
  aoCriar,
  aoExcluir,
}: {
  tipo: TipoDeOpcao
  opcoes: OpcaoDoProduto[]
  /** Recém-criada: o formulário já a marca/escolhe. */
  aoCriar: (opcao: OpcaoDoProduto) => void
  /** Apagada: o formulário a tira do produto que está sendo editado. */
  aoExcluir: (opcao: OpcaoDoProduto) => void
}) {
  const id = useId()
  const textos = tiposDeOpcao.find((item) => item.valor === tipo)!
  const { criar, excluir } = useOpcoesDoProduto()
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [paraApagar, setParaApagar] = useState<OpcaoDoProduto | null>(null)

  function adicionar() {
    const lido = schemaNomeDaOpcao.safeParse(nome)
    if (!lido.success) return setErro(lido.error.issues[0]?.message ?? 'Nome inválido.')
    if (nomeJaExiste(lido.data, opcoes)) return setErro(`“${lido.data}” já está na lista.`)
    setErro(null)
    criar.mutate(
      { tipo, nome: lido.data },
      {
        onSuccess: (opcao) => {
          setNome('')
          aoCriar(opcao)
        },
        onError: (falha) => setErro(falha.message),
      },
    )
  }

  function apagar() {
    if (!paraApagar) return
    const opcao = paraApagar
    excluir.mutate(opcao.id, {
      onSuccess: () => {
        setParaApagar(null)
        aoExcluir(opcao)
      },
      onError: (falha) => {
        setParaApagar(null)
        setErro(falha.message)
      },
    })
  }

  if (!aberto) {
    return (
      <div>
        <Button variant="ghost" iconLeft="pencil" onClick={() => setAberto(true)}>
          Editar {textos.rotulo.toLowerCase()}
        </Button>
      </div>
    )
  }

  const descricaoDoApagar =
    paraApagar && paraApagar.produtos > 0
      ? `Ele sai de ${contarProdutos(paraApagar.produtos)}. Não dá para desfazer.`
      : 'Não dá para desfazer.'

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-subtle p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{textos.rotulo}</p>
        <Button variant="ghost" onClick={() => setAberto(false)}>
          Fechar
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-nome`} className="sr-only">
          Nome {tipo === 'categoria' ? 'da nova categoria' : 'do novo ambiente'}
        </label>
        <div className="flex gap-2">
          <Input
            id={`${id}-nome`}
            value={nome}
            maxLength={LIMITES_PRODUTO.opcaoNomeMax}
            autoComplete="off"
            invalid={Boolean(erro)}
            aria-describedby={erro ? `${id}-erro` : undefined}
            placeholder={tipo === 'categoria' ? 'Nova categoria' : 'Novo ambiente'}
            onChange={(evento) => {
              setNome(evento.target.value)
              setErro(null)
            }}
            onKeyDown={(evento) => {
              // Enter adiciona (e não envia o formulário do projeto, quando está dentro dele).
              if (evento.key === 'Enter') {
                evento.preventDefault()
                adicionar()
              }
            }}
          />
          <Button variant="secondary" iconLeft="plus" onClick={adicionar} loading={criar.isPending}>
            Adicionar
          </Button>
        </div>
        {erro && (
          <p id={`${id}-erro`} className="text-sm text-danger-fg" role="alert">
            {erro}
          </p>
        )}
      </div>

      {opcoes.length > 0 && (
        <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto" aria-label={textos.rotulo}>
          {opcoes.map((opcao) => {
            // Categoria em uso não pode ser apagada: o produto precisa de uma.
            const travada = tipo === 'categoria' && opcao.produtos > 0
            return (
              <li
                key={opcao.id}
                className="flex min-h-11 items-center gap-3 rounded-md bg-surface pr-1 pl-3"
              >
                <span className="min-w-0 flex-1 truncate text-sm">{opcao.nome}</span>
                {opcao.produtos > 0 && (
                  <span className="shrink-0 text-xs text-fg-muted">
                    {contarProdutos(opcao.produtos)}
                  </span>
                )}
                <IconButton
                  icon="trash"
                  tone="quiet"
                  label={
                    travada
                      ? `${opcao.nome} está em uso e não pode ser apagada`
                      : `Apagar ${opcao.nome}`
                  }
                  title={travada ? 'Em uso: troque a categoria desses produtos antes' : undefined}
                  disabled={travada}
                  onClick={() => setParaApagar(opcao)}
                />
              </li>
            )
          })}
        </ul>
      )}

      <DialogoDeConfirmacao
        aberto={paraApagar !== null}
        titulo={`Apagar ${tipo === 'categoria' ? 'a categoria' : 'o ambiente'} “${paraApagar?.nome ?? ''}”?`}
        descricao={descricaoDoApagar}
        rotuloConfirmar="Apagar"
        carregando={excluir.isPending}
        aoConfirmar={apagar}
        aoCancelar={() => setParaApagar(null)}
      />
    </div>
  )
}
