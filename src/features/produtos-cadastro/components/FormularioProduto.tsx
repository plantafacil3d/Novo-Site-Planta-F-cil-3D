'use client'

import Image from 'next/image'
import { useId, type ReactNode } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Dica } from '@/components/ui/Dica'
import { Field } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/FileInput'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'

import { origensDeProduto } from '../catalogo'
import { useFormularioProduto } from '../hooks/useFormularioProduto'
import { useOpcoesDoProduto } from '../hooks/useOpcoesDoProduto'
import { EditorDeOpcoes } from './EditorDeOpcoes'
import { LIMITES_PRODUTO, avisoDeProdutoCompartilhado } from '../rules'
import type { ProdutoLigado, ProdutoParaEditar } from '../types'
import { SeletorDeProjetos } from './SeletorDeProjetos'

/** O que fazer quando o link já é de outro produto (ex.: "Ligar a este projeto"). */
export type AcaoParaDuplicado = { rotulo: string; agir: (produto: ProdutoLigado) => void }

export type FormularioProdutoProps = {
  /** `null` = produto novo; senão, o produto já carregado para editar. */
  inicial: ProdutoParaEditar | null
  /** Mostra e grava o "Aparece nos projetos" (menu Produtos). Na aba Produtos, não. */
  comProjetos: boolean
  aoSalvar: (produto: ProdutoLigado) => void
  aoCancelar: () => void
  acaoParaDuplicado: AcaoParaDuplicado
}

/** Bloco com título curto (e dica opcional), no padrão das abas do cadastro de projeto. */
function Grupo({ titulo, dica, children }: { titulo: string; dica?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <legend className="contents">
        <span className="flex items-center gap-2 font-body text-base font-semibold">
          {titulo}
          {dica && <Dica texto={dica} />}
        </span>
      </legend>
      {children}
    </fieldset>
  )
}

/**
 * Formulário de produto: o mesmo na página do menu Produtos e dentro da aba Produtos do
 * cadastro de projeto (sem janela flutuante). Ao salvar, o produto entra (ou é atualizado) no
 * cadastro geral.
 */
export function FormularioProduto({
  inicial,
  comProjetos,
  aoSalvar,
  aoCancelar,
  acaoParaDuplicado,
}: FormularioProdutoProps) {
  const form = useFormularioProduto({ inicial, comProjetos, aoSalvar })
  const id = useId()
  const campo = (nome: string) => `${id}-${nome}`
  const aviso = inicial ? avisoDeProdutoCompartilhado(inicial.projetos.length) : null
  const { campos, erros } = form
  const { consulta: opcoes } = useOpcoesDoProduto()
  const categorias = opcoes.data?.categorias ?? []
  const ambientes = opcoes.data?.ambientes ?? []

  return (
    // Não é um <form>: na aba Produtos ele fica dentro do formulário do projeto, e formulário
    // dentro de formulário não funciona. Salva pelo botão, como o cadastro de projeto.
    <div className="flex flex-col gap-6">
      {aviso && <Alert variant="warning">{aviso} Mudar aqui muda em todos.</Alert>}

      <Grupo
        titulo="Dados do produto"
        dica="O produto é cadastrado uma vez só e pode aparecer em vários projetos e na Loja. O link abre em nova aba."
      >
        <Field
          label="Link"
          htmlFor={campo('link')}
          error={erros.link}
          hint="Cole o link e clique em Preencher: o nome e a foto vêm sozinhos."
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              className="sm:flex-1"
              id={campo('link')}
              type="url"
              inputMode="url"
              value={campos.link}
              maxLength={LIMITES_PRODUTO.linkMax}
              invalid={Boolean(erros.link)}
              aria-describedby={erros.link ? `${campo('link')}-erro` : undefined}
              onChange={(evento) => form.atualizar({ link: evento.target.value })}
              onBlur={() => void form.conferirLink()}
              placeholder="https://"
            />
            <Button
              variant="secondary"
              iconLeft="sparkles"
              onClick={() => void form.preencherPeloLink()}
              loading={form.lendoLink}
              disabled={form.enviandoFoto || campos.link.trim() === ''}
            >
              {form.lendoLink ? 'Buscando…' : 'Preencher'}
            </Button>
          </div>
        </Field>

        {form.avisoDoLink && <Alert variant="warning">{form.avisoDoLink}</Alert>}

        {form.duplicado && (
          <Alert variant="warning">
            <div className="flex flex-col items-start gap-2">
              <p>
                Este produto já está cadastrado ({form.duplicado.nome}). {acaoParaDuplicado.rotulo}?
              </p>
              <Button
                variant="secondary"
                onClick={() => form.duplicado && acaoParaDuplicado.agir(form.duplicado)}
              >
                {acaoParaDuplicado.rotulo}
              </Button>
            </div>
          </Alert>
        )}

        <div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
          <div className="flex flex-col gap-2">
            {form.foto ? (
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface">
                <Image
                  src={form.foto.url}
                  alt="Foto do produto"
                  fill
                  sizes="192px"
                  className="object-contain p-2"
                />
              </div>
            ) : (
              <FileInput
                label={form.enviandoFoto ? 'Enviando…' : 'Escolher foto'}
                accept="image/jpeg,image/png,image/webp"
                disabled={form.enviandoFoto}
                invalid={Boolean(erros.foto)}
                onFiles={([arquivo]) => arquivo && void form.escolherFoto(arquivo)}
                className="aspect-square"
              />
            )}
            {form.foto && (
              <FileInput
                label={form.enviandoFoto ? 'Enviando…' : 'Trocar foto'}
                accept="image/jpeg,image/png,image/webp"
                disabled={form.enviandoFoto}
                onFiles={([arquivo]) => arquivo && void form.escolherFoto(arquivo)}
                className="min-h-11 flex-row py-2"
              />
            )}
            {erros.foto && (
              <p className="text-sm text-danger-fg" role="alert">
                {erros.foto}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Field label="Nome" htmlFor={campo('nome')} error={erros.nome}>
              <Input
                id={campo('nome')}
                value={campos.nome}
                maxLength={LIMITES_PRODUTO.nomeMax}
                invalid={Boolean(erros.nome)}
                aria-describedby={erros.nome ? `${campo('nome')}-erro` : undefined}
                onChange={(evento) => form.atualizar({ nome: evento.target.value })}
                placeholder="Ex.: Pendente de vidro fumê para bancada"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoria" htmlFor={campo('categoria')} error={erros.categoria}>
                <Select
                  id={campo('categoria')}
                  value={campos.categoria}
                  invalid={Boolean(erros.categoria)}
                  disabled={!opcoes.data}
                  onChange={(evento) => form.atualizar({ categoria: evento.target.value })}
                >
                  <option value="">{opcoes.data ? 'Escolha' : 'Carregando…'}</option>
                  {/* Categoria que foi apagada continua visível até a pessoa trocar. */}
                  {campos.categoria !== '' &&
                    !categorias.some((categoria) => categoria.nome === campos.categoria) && (
                      <option value={campos.categoria}>{campos.categoria}</option>
                    )}
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.nome}>
                      {categoria.nome}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Origem" htmlFor={campo('origem')} error={erros.origem}>
                <Select
                  id={campo('origem')}
                  value={campos.origem}
                  onChange={(evento) =>
                    form.atualizar({ origem: evento.target.value as typeof campos.origem })
                  }
                >
                  {origensDeProduto.map((origem) => (
                    <option key={origem.valor} value={origem.valor}>
                      {origem.rotulo}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {opcoes.data && (
              <EditorDeOpcoes
                tipo="categoria"
                opcoes={categorias}
                aoCriar={(opcao) => form.atualizar({ categoria: opcao.nome })}
                aoExcluir={(opcao) => form.esquecerOpcao('categoria', opcao.nome)}
              />
            )}

            {/* `self-start`: só a caixa e o texto são clicáveis, não o vazio da linha inteira. */}
            <Checkbox
              label="Ativo (aparece no site)"
              className="self-start"
              checked={campos.ativo}
              onChange={(evento) => form.atualizar({ ativo: evento.target.checked })}
            />
          </div>
        </div>
      </Grupo>

      <Grupo
        titulo="Ambientes (opcional)"
        dica="Onde o produto combina. Na página do projeto, vira o filtro da seção “Decore como no projeto”."
      >
        {opcoes.isError && (
          <Alert variant="error">Não foi possível carregar as categorias e os ambientes.</Alert>
        )}
        {!opcoes.data && !opcoes.isError && <Skeleton className="h-11 w-full" />}
        {opcoes.data && (
          <>
            {ambientes.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
                {ambientes.map((ambiente) => (
                  <Checkbox
                    key={ambiente.id}
                    label={ambiente.nome}
                    checked={campos.ambientes.includes(ambiente.nome)}
                    onChange={() => form.alternarAmbiente(ambiente.nome)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-fg-muted">Nenhum ambiente cadastrado ainda.</p>
            )}
            <EditorDeOpcoes
              tipo="ambiente"
              opcoes={ambientes}
              aoCriar={(opcao) => form.atualizar({ ambientes: [...campos.ambientes, opcao.nome] })}
              aoExcluir={(opcao) => form.esquecerOpcao('ambiente', opcao.nome)}
            />
          </>
        )}
      </Grupo>

      {comProjetos && (
        <Grupo
          titulo="Aparece nos projetos"
          dica="O produto entra na seção “Decore como no projeto” destes projetos, no fim da lista. A ordem se ajusta na aba Produtos de cada projeto."
        >
          <span className="flex items-center gap-2 self-start">
            <Checkbox
              label="Em todos os projetos"
              checked={campos.emTodosProjetos}
              onChange={(evento) => form.atualizar({ emTodosProjetos: evento.target.checked })}
            />
            <Dica texto="Entra em todos os projetos de hoje e em cada projeto novo que você cadastrar. Para tirar de um projeto só, use a aba Produtos daquele projeto." />
          </span>
          {!campos.emTodosProjetos && (
            <SeletorDeProjetos projetos={form.projetos} aoMudar={form.setProjetos} />
          )}
        </Grupo>
      )}

      {form.erroGeral && <Alert variant="error">{form.erroGeral}</Alert>}

      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-6">
        <Button variant="secondary" onClick={aoCancelar} disabled={form.salvando}>
          Cancelar
        </Button>
        <Button
          iconLeft="check"
          onClick={() => void form.salvar()}
          loading={form.salvando}
          disabled={form.enviandoFoto}
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
