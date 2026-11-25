'use client'

import { useState, type ReactNode } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { useBuscaDeProjetos, useVariacoesAutomaticas } from '../hooks/useVariacoesDoCadastro'
import { LIMITES } from '../rules'
import type { ProjetoVinculado } from '../types'
import { PainelDaEtapa } from './PainelDaEtapa'

/** Uma linha de projeto: código · título, selo "Rascunho" e uma ação opcional à direita. */
function LinhaDoProjeto({ projeto, acao }: { projeto: ProjetoVinculado; acao?: ReactNode }) {
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

/** Três linhas cinzas enquanto a lista carrega. */
function CarregandoLista() {
  return (
    <div className="flex flex-col gap-2" role="status" aria-busy="true">
      <span className="sr-only">Carregando projetos…</span>
      {[0, 1, 2].map((indice) => (
        <Skeleton key={indice} className="h-12 w-full" />
      ))}
    </div>
  )
}

function Subtitulo({ children }: { children: ReactNode }) {
  return <h3 className="font-body text-base font-semibold">{children}</h3>
}

/**
 * Aba "Variações" (opcional): a mesma casa em outros tamanhos de terreno. Os projetos de
 * mesmo "Código do projeto" entram sozinhos; aqui também dá para ligar outros à mão.
 */
export function EtapaVariacoes({ form }: { form: FormularioProjetoApi }) {
  const { dados, projetoId } = form
  const [busca, setBusca] = useState('')
  const automaticas = useVariacoesAutomaticas(dados.codigoYoutube, projetoId)
  const resultados = useBuscaDeProjetos(busca)

  const escolhidas = dados.variacoesManuais
  const noLimite = escolhidas.length >= LIMITES.variacoesMax
  // Quem já está ligado (sozinho ou à mão) e o próprio projeto não aparecem como opção.
  const jaLigados = new Set([
    ...(projetoId ? [projetoId] : []),
    ...escolhidas.map((projeto) => projeto.id),
    ...(automaticas.data ?? []).map((projeto) => projeto.id),
  ])
  const opcoes = (resultados.data ?? []).filter((projeto) => !jaLigados.has(projeto.id))

  const adicionar = (projeto: ProjetoVinculado) =>
    form.atualizar({ variacoesManuais: [...escolhidas, projeto] })
  const remover = (id: string) =>
    form.atualizar({ variacoesManuais: escolhidas.filter((projeto) => projeto.id !== id) })

  const erro = form.erroDe('variacoesManuais')

  return (
    <PainelDaEtapa
      titulo="Variações"
      dica="A mesma casa em outros tamanhos de terreno. Aparecem na página do projeto, do menor para o maior terreno. Rascunhos não aparecem no site."
    >
      <section className="flex flex-col gap-3">
        <Subtitulo>Pelo código do projeto</Subtitulo>
        {automaticas.codigo === '' ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-fg-muted">Sem código, nenhum projeto entra sozinho.</p>
            <Button variant="secondary" onClick={() => form.irParaEtapa('informacoes')}>
              Preencher o código
            </Button>
          </div>
        ) : automaticas.isPending ? (
          <CarregandoLista />
        ) : automaticas.isError ? (
          <Alert variant="error">{automaticas.error.message}</Alert>
        ) : automaticas.data.length === 0 ? (
          <p className="text-sm text-fg-muted">
            Nenhum outro projeto com o código {automaticas.codigo}.
          </p>
        ) : (
          <ul
            className="flex flex-col gap-2"
            aria-label={`Projetos com o código ${automaticas.codigo}`}
          >
            {automaticas.data.map((projeto) => (
              <LinhaDoProjeto key={projeto.id} projeto={projeto} />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <Subtitulo>Escolhidos à mão</Subtitulo>

        {escolhidas.length > 0 && (
          <ul className="flex flex-col gap-2" aria-label="Projetos escolhidos à mão">
            {escolhidas.map((projeto) => (
              <LinhaDoProjeto
                key={projeto.id}
                projeto={projeto}
                acao={
                  <IconButton
                    icon="trash"
                    tone="quiet"
                    label={`Remover ${projeto.codigo} das variações`}
                    onClick={() => remover(projeto.id)}
                  />
                }
              />
            ))}
          </ul>
        )}
        {erro && <Alert variant="error">{erro}</Alert>}

        {noLimite ? (
          <p className="text-sm text-fg-muted">
            Limite de {LIMITES.variacoesMax} projetos escolhidos à mão.
          </p>
        ) : (
          <>
            <Field
              label="Buscar projeto"
              htmlFor="campo-busca-variacoes"
              hint="Nome ou código, a partir de 2 letras."
            >
              <Input
                id="campo-busca-variacoes"
                type="search"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                maxLength={LIMITES.buscaDeVariacoesTextoMax}
                autoComplete="off"
              />
            </Field>

            {resultados.ativa &&
              (resultados.isPending ? (
                <CarregandoLista />
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
                          aria-label={`Adicionar ${projeto.codigo} às variações`}
                          onClick={() => adicionar(projeto)}
                        >
                          Adicionar
                        </Button>
                      }
                    />
                  ))}
                </ul>
              ))}
          </>
        )}
      </section>
    </PainelDaEtapa>
  )
}
