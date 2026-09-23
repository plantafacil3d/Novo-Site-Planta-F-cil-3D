'use client'

import { useState } from 'react'

import { MensagensDeArquivo } from '@/components/shared/MensagensDeArquivo'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { FileInput } from '@/components/ui/FileInput'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

import type { FormularioProjetoApi } from '../hooks/useFormularioProjeto'
import { ARQUIVOS_DE_PDF, LIMITES, filtrarPreco } from '../rules'
import type { ComplementarProjeto, EntregaComplementar } from '../types'
import { ListaDeAnexos } from './ListaDeAnexos'

const CAMPOS = ['titulo', 'valor', 'descricao', 'entrega', 'link', 'pdf'] as const

type CartaoComplementarProps = {
  form: FormularioProjetoApi
  complementar: ComplementarProjeto
  /** Posição na lista: os erros do formulário são guardados por posição. */
  indice: number
}

/** Projeto complementar: cartão que abre e fecha, com os campos e o botão de remover. */
export function CartaoComplementar({ form, complementar, indice }: CartaoComplementarProps) {
  const { erroDe, campo } = form
  const [aberto, setAberto] = useState(form.complementarNovo === complementar.id)
  const chave = (nome: (typeof CAMPOS)[number]) => `complementares.${indice}.${nome}`
  const temErro = CAMPOS.some((nome) => erroDe(chave(nome)))
  // Um cartão com erro depois do "Salvar" abre sozinho: o campo com problema precisa estar à vista.
  const mostrarAberto = aberto || (form.tentouSalvar && temErro)
  const titulo = complementar.titulo || `Projeto complementar ${indice + 1}`
  const pdf = campo(chave('pdf'))

  function mudarEntrega(entrega: EntregaComplementar) {
    // Cada forma de entrega tem os seus dados: trocar limpa os da outra.
    form.atualizarComplementar(complementar.id, {
      entrega,
      ...(entrega === 'link' ? { pdf: null } : { link: '' }),
    })
  }

  return (
    <details
      open={mostrarAberto}
      onToggle={(evento) => setAberto(evento.currentTarget.open)}
      className="group rounded-lg border border-border bg-surface"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 truncate">{titulo}</span>
        <span className="flex shrink-0 items-center gap-3">
          {temErro && (
            <span className="flex items-center gap-1 text-xs text-danger-fg">
              <Icon name="circle-alert" className="size-4" />
              Faltam dados
            </span>
          )}
          <Icon name="chevron-down" className="size-4 transition-transform group-open:rotate-180" />
        </span>
      </summary>

      <div className="flex flex-col gap-6 border-t border-border p-4">
        <Field
          label="Título *"
          htmlFor={campo(chave('titulo')).id}
          error={erroDe(chave('titulo'))}
          counter={`${complementar.titulo.length}/${LIMITES.complementarTituloMax}`}
        >
          <Input
            {...campo(chave('titulo'))}
            value={complementar.titulo}
            maxLength={LIMITES.complementarTituloMax}
            autoComplete="off"
            onChange={(evento) =>
              form.atualizarComplementar(complementar.id, { titulo: evento.target.value })
            }
          />
        </Field>

        <Field
          label="Valor (R$) *"
          htmlFor={campo(chave('valor')).id}
          error={erroDe(chave('valor'))}
        >
          <Input
            {...campo(chave('valor'))}
            value={complementar.valor}
            inputMode="decimal"
            placeholder="0,00"
            autoComplete="off"
            onChange={(evento) =>
              form.atualizarComplementar(complementar.id, {
                valor: filtrarPreco(evento.target.value),
              })
            }
          />
        </Field>

        <Field
          label="Pequena descrição *"
          htmlFor={campo(chave('descricao')).id}
          error={erroDe(chave('descricao'))}
          hint={`Mínimo de ${LIMITES.complementarDescricaoMin} caracteres.`}
          counter={`${complementar.descricao.length}/${LIMITES.complementarDescricaoMax}`}
        >
          <Textarea
            {...campo(chave('descricao'))}
            value={complementar.descricao}
            rows={3}
            maxLength={LIMITES.complementarDescricaoMax}
            onChange={(evento) =>
              form.atualizarComplementar(complementar.id, { descricao: evento.target.value })
            }
          />
        </Field>

        <Field
          label="Entrega *"
          htmlFor={campo(chave('entrega')).id}
          error={erroDe(chave('entrega'))}
        >
          <Select
            {...campo(chave('entrega'))}
            value={complementar.entrega}
            onChange={(evento) => mudarEntrega(evento.target.value as EntregaComplementar)}
          >
            <option value="">Selecione</option>
            <option value="link">Link externo</option>
            <option value="pdf">Upload de PDF</option>
          </Select>
        </Field>

        {complementar.entrega === 'link' && (
          <Field
            label="Link externo *"
            htmlFor={campo(chave('link')).id}
            error={erroDe(chave('link'))}
            hint="Google Drive, Dropbox ou outro endereço que comece com https://"
          >
            <Input
              {...campo(chave('link'))}
              value={complementar.link}
              type="url"
              inputMode="url"
              maxLength={LIMITES.linkMax}
              placeholder="https://"
              onChange={(evento) =>
                form.atualizarComplementar(complementar.id, { link: evento.target.value })
              }
            />
          </Field>
        )}

        {complementar.entrega === 'pdf' && (
          <div className="flex flex-col gap-3">
            {complementar.pdf ? (
              <ListaDeAnexos
                anexos={[complementar.pdf]}
                rotuloDeRemover={(anexo) => `Remover ${anexo.nomeArquivo}`}
                aoRemover={() => form.removerPdfDoComplementar(complementar.id)}
              />
            ) : (
              <FileInput
                id={pdf.id}
                name={pdf.name}
                label="Escolher o PDF"
                hint="PDF de até 20 MB"
                accept={ARQUIVOS_DE_PDF.accept}
                invalid={pdf.invalid}
                aria-describedby={pdf['aria-describedby']}
                onFiles={(arquivos) => form.enviarPdfDoComplementar(complementar.id, arquivos)}
              />
            )}
            <MensagensDeArquivo
              id={pdf.id}
              erro={erroDe(chave('pdf'))}
              recusas={form.avisosDeArquivo[`pdf-${complementar.id}`]}
            />
          </div>
        )}

        <div>
          <Button
            variant="ghost"
            iconLeft="trash"
            onClick={() => form.removerComplementar(complementar.id)}
          >
            Remover projeto complementar
          </Button>
        </div>
      </div>
    </details>
  )
}
