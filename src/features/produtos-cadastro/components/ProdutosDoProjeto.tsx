'use client'

import Image from 'next/image'
import { useId, useState, type ReactNode } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useArrastarParaReordenar, type AlcaDeArrasto } from '@/hooks/useArrastarParaReordenar'

import { useBuscaDeProdutos } from '../hooks/useBuscasDoCadastro'
import { useProdutoParaEditar } from '../hooks/useProdutoParaEditar'
import {
  LIMITES_PRODUTO,
  avisoDeProdutoCompartilhado,
  listarAmbientes,
  moverProduto,
} from '../rules'
import type { ProdutoLigado } from '../types'
import { FormularioProduto, type FormularioProdutoProps } from './FormularioProduto'

function LinhaDoProduto({
  produto,
  alca,
  acoes,
}: {
  produto: ProdutoLigado
  alca?: AlcaDeArrasto & { 'aria-label': string }
  acoes: ReactNode
}) {
  const aviso = avisoDeProdutoCompartilhado(produto.projetos)
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-md border border-border bg-surface p-2">
      {alca && (
        <button
          type="button"
          className="shrink-0 cursor-grab touch-none rounded p-2 text-fg-muted hover:bg-subtle active:cursor-grabbing"
          {...alca}
        >
          <Icon name="grip" />
        </button>
      )}
      <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-subtle">
        <Image src={produto.fotoUrl} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{produto.nome}</span>
        <span className="truncate text-sm text-fg-muted">
          {produto.categoria} · {listarAmbientes(produto.ambientes)}
          {aviso && ` · ${aviso}`}
        </span>
      </span>
      {!produto.ativo && <Badge variant="neutral">Inativo</Badge>}
      {acoes}
    </div>
  )
}

/** Edição de um produto já cadastrado: carrega os dados de agora antes de montar o formulário. */
function EdicaoNaAba({
  produtoId,
  ...props
}: Omit<FormularioProdutoProps, 'inicial'> & { produtoId: string }) {
  const produto = useProdutoParaEditar(produtoId)
  if (produto.isPending) {
    return (
      <div role="status" aria-busy="true" className="flex flex-col gap-4">
        <span className="sr-only">Carregando o produto…</span>
        <div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
          <Skeleton className="aspect-square" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    )
  }
  if (produto.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Alert variant="error">{produto.error.message}</Alert>
        <Button variant="secondary" iconLeft="chevron-left" onClick={props.aoCancelar}>
          Voltar aos produtos
        </Button>
      </div>
    )
  }
  return <FormularioProduto inicial={produto.data} {...props} />
}

/** Formulário dentro da aba: fechado, produto novo ou edição de um produto da lista. */
type Edicao = { aberta: false } | { aberta: true; produtoId: string | null }

/**
 * Produtos ligados a um projeto (aba "Produtos" do cadastro): busca no cadastro geral, cadastro
 * de produto novo (que já entra na lista), ordem por arraste, remover e editar. A lista é estado
 * do formulário do projeto: as ligações são gravadas quando o projeto é salvo.
 */
export function ProdutosDoProjeto({
  produtos,
  aoMudar,
  erro,
}: {
  produtos: ProdutoLigado[]
  aoMudar: (produtos: ProdutoLigado[]) => void
  erro?: string
}) {
  const idDaBusca = useId()
  const [busca, setBusca] = useState('')
  const [edicao, setEdicao] = useState<Edicao>({ aberta: false })
  const resultados = useBuscaDeProdutos(busca)
  const { arrastando, handleProps, itemProps } = useArrastarParaReordenar({
    aoReordenar: (origem, destino) => aoMudar(moverProduto(produtos, origem, destino)),
  })

  const ligados = new Set(produtos.map((produto) => produto.id))
  const opcoes = (resultados.data ?? []).filter((produto) => !ligados.has(produto.id))
  const noLimite = produtos.length >= LIMITES_PRODUTO.porProjetoMax

  /** Entra no fim da lista; se já estava, só atualiza os dados (ex.: depois de editar). */
  function incluir(produto: ProdutoLigado) {
    aoMudar(
      ligados.has(produto.id)
        ? produtos.map((item) => (item.id === produto.id ? produto : item))
        : [...produtos, produto],
    )
  }

  // Cadastrar ou editar abre o formulário aqui mesmo, no lugar da lista (sem janela flutuante):
  // "Cancelar" ou "Salvar" volta à lista, sem sair do cadastro do projeto.
  if (edicao.aberta) {
    const fechar = () => setEdicao({ aberta: false })
    const props: Omit<FormularioProdutoProps, 'inicial'> = {
      comProjetos: false,
      aoCancelar: fechar,
      aoSalvar: (produto) => {
        incluir(produto)
        fechar()
      },
      acaoParaDuplicado: {
        rotulo: 'Ligar a este projeto',
        agir: (produto) => {
          incluir(produto)
          fechar()
        },
      },
    }
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" iconLeft="chevron-left" onClick={fechar}>
            Produtos deste projeto
          </Button>
          <h3 className="font-body text-base font-semibold">
            {edicao.produtoId ? 'Editar produto' : 'Cadastrar novo produto'}
          </h3>
        </div>
        {edicao.produtoId ? (
          <EdicaoNaAba key={edicao.produtoId} produtoId={edicao.produtoId} {...props} />
        ) : (
          <FormularioProduto inicial={null} {...props} />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-body text-base font-semibold">Produtos deste projeto</h3>
          {!noLimite && (
            <Button
              variant="secondary"
              iconLeft="plus"
              onClick={() => setEdicao({ aberta: true, produtoId: null })}
            >
              Cadastrar novo produto
            </Button>
          )}
        </div>

        {produtos.length === 0 ? (
          <p className="text-sm text-fg-muted">Nenhum produto ligado.</p>
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Produtos deste projeto">
            {produtos.map((produto, indice) => (
              <li
                key={produto.id}
                {...itemProps(produto.id)}
                className={arrastando === produto.id ? 'opacity-50' : undefined}
              >
                <LinhaDoProduto
                  produto={produto}
                  alca={{
                    ...handleProps(produto.id),
                    'aria-label': `Arrastar para mudar a posição de ${produto.nome} (posição ${indice + 1})`,
                  }}
                  acoes={
                    <span className="flex shrink-0">
                      <IconButton
                        icon="pencil"
                        tone="quiet"
                        label={`Editar ${produto.nome}`}
                        onClick={() => setEdicao({ aberta: true, produtoId: produto.id })}
                      />
                      <IconButton
                        icon="close"
                        tone="quiet"
                        label={`Remover ${produto.nome} do projeto`}
                        onClick={() => aoMudar(produtos.filter((item) => item.id !== produto.id))}
                      />
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        )}
        {erro && <Alert variant="error">{erro}</Alert>}
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <label htmlFor={idDaBusca} className="font-body text-base font-semibold">
          Adicionar produto
        </label>
        {noLimite ? (
          <p className="text-sm text-fg-muted">
            Limite de {LIMITES_PRODUTO.porProjetoMax} produtos por projeto.
          </p>
        ) : (
          <Input
            id={idDaBusca}
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            maxLength={LIMITES_PRODUTO.buscaTextoMax}
            autoComplete="off"
            placeholder="Buscar no cadastro de produtos"
          />
        )}

        {!noLimite &&
          resultados.ativa &&
          (resultados.isPending ? (
            <div role="status" aria-busy="true" className="flex flex-col gap-2">
              <span className="sr-only">Buscando produtos…</span>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : resultados.isError ? (
            <Alert variant="error">{resultados.error.message}</Alert>
          ) : opcoes.length === 0 ? (
            <p className="text-sm text-fg-muted" role="status">
              Nenhum produto encontrado.
            </p>
          ) : (
            <ul className="flex flex-col gap-2" aria-label="Resultados da busca">
              {opcoes.map((produto) => (
                <li key={produto.id}>
                  <LinhaDoProduto
                    produto={produto}
                    acoes={
                      <Button
                        variant="secondary"
                        iconLeft="plus"
                        aria-label={`Adicionar ${produto.nome} ao projeto`}
                        onClick={() => incluir(produto)}
                      >
                        Adicionar
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          ))}
      </section>
    </div>
  )
}
