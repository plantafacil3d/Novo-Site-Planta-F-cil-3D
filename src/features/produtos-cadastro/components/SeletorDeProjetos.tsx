'use client'

import { useId, useState, type ReactNode } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

import { useBuscaDeProjetosParaProduto } from '../hooks/useBuscasDoCadastro'
import { LIMITES_PRODUTO } from '../rules'
import type { ProjetoParaLigar } from '../types'

function LinhaDoProjeto({ projeto, acao }: { projeto: ProjetoParaLigar; acao: ReactNode }) {
  return (
    <li className="flex min-h-12 items-center gap-3 rounded-md border border-border bg-surface py-1 pr-1 pl-3">
      <span className="min-w-0 flex-1 truncate text-sm">
        <span className="font-semibold">{projeto.codigo}</span>
        <span className="text-fg-muted"> · {projeto.titulo}</span>
      </span>
      {!projeto.publicado && <Badge variant="neutral">Rascunho</Badge>}
      {acao}
    </li>
  )
}

/** "Aparece nos projetos": os escolhidos, com remover, e uma busca para acrescentar outros. */
export function SeletorDeProjetos({
  projetos,
  aoMudar,
}: {
  projetos: ProjetoParaLigar[]
  aoMudar: (projetos: ProjetoParaLigar[]) => void
}) {
  const idDaBusca = useId()
  const [busca, setBusca] = useState('')
  const resultados = useBuscaDeProjetosParaProduto(busca)
  const escolhidos = new Set(projetos.map((projeto) => projeto.id))
  const opcoes = (resultados.data ?? []).filter((projeto) => !escolhidos.has(projeto.id))
  const noLimite = projetos.length >= LIMITES_PRODUTO.projetosMax

  return (
    <div className="flex flex-col gap-3">
      {projetos.length > 0 && (
        <ul
          className="flex max-h-56 flex-col gap-2 overflow-y-auto"
          aria-label="Projetos escolhidos"
        >
          {projetos.map((projeto) => (
            <LinhaDoProjeto
              key={projeto.id}
              projeto={projeto}
              acao={
                <IconButton
                  icon="trash"
                  tone="quiet"
                  label={`Tirar ${projeto.codigo} da lista`}
                  onClick={() => aoMudar(projetos.filter((item) => item.id !== projeto.id))}
                />
              }
            />
          ))}
        </ul>
      )}

      {!noLimite && (
        <>
          <label htmlFor={idDaBusca} className="sr-only">
            Buscar projeto por nome ou código
          </label>
          <Input
            id={idDaBusca}
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            maxLength={LIMITES_PRODUTO.buscaTextoMax}
            autoComplete="off"
            placeholder="Buscar projeto (nome ou código)"
          />
        </>
      )}

      {resultados.ativa &&
        (resultados.isPending ? (
          <div role="status" aria-busy="true" className="flex flex-col gap-2">
            <span className="sr-only">Buscando projetos…</span>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : resultados.isError ? (
          <Alert variant="error">{resultados.error.message}</Alert>
        ) : opcoes.length === 0 ? (
          <p className="text-sm text-fg-muted" role="status">
            Nenhum projeto encontrado.
          </p>
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Resultados da busca">
            {opcoes.map((projeto) => (
              <LinhaDoProjeto
                key={projeto.id}
                projeto={projeto}
                acao={
                  <Button
                    variant="secondary"
                    iconLeft="plus"
                    aria-label={`Adicionar ${projeto.codigo}`}
                    onClick={() => aoMudar([...projetos, projeto])}
                  >
                    Adicionar
                  </Button>
                }
              />
            ))}
          </ul>
        ))}
    </div>
  )
}
