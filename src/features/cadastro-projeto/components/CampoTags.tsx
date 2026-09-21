'use client'

import { useState, type KeyboardEvent } from 'react'

import { Field } from '@/components/ui/Field'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'

import { LIMITES, adicionarTexto, semSimbolos } from '../rules'

type CampoTagsProps = {
  id: string
  tags: string[]
  onChange: (tags: string[]) => void
  error?: string
}

/** Tags para busca: digita e aperta Enter; cada tag tem um botão para remover. */
export function CampoTags({ id, tags, onChange, error }: CampoTagsProps) {
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)

  function aoTeclar(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key !== 'Enter') return
    // Enter dentro do formulário não deve enviar nada: aqui ele só adiciona a tag.
    evento.preventDefault()
    const resultado = adicionarTexto(tags, texto, {
      limite: LIMITES.tagsMax,
      repetido: 'Essa tag já foi adicionada.',
      cheio: `Você pode usar até ${LIMITES.tagsMax} tags.`,
    })
    setAviso(resultado.erro)
    if (resultado.erro) return
    onChange(resultado.lista)
    setTexto('')
  }

  const mensagem = error ?? aviso ?? undefined

  return (
    <div className="flex flex-col gap-3">
      <Field
        label="Tags para busca"
        htmlFor={id}
        error={mensagem}
        hint="Digite uma palavra e aperte Enter."
        counter={`${tags.length}/${LIMITES.tagsMax}`}
      >
        <Input
          id={id}
          value={texto}
          maxLength={LIMITES.tagTamanhoMax}
          invalid={Boolean(mensagem)}
          aria-describedby={mensagem ? `${id}-erro` : undefined}
          onChange={(evento) => {
            setTexto(semSimbolos(evento.target.value))
            setAviso(null)
          }}
          onKeyDown={aoTeclar}
          autoComplete="off"
        />
      </Field>

      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Tags adicionadas">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-border bg-tint pl-3 text-sm"
            >
              {tag}
              <IconButton
                icon="close"
                label={`Remover a tag ${tag}`}
                onClick={() => onChange(tags.filter((item) => item !== tag))}
                className="bg-transparent shadow-none"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
