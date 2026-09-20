'use client'

import { useEffect, useId, useRef } from 'react'

import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'

type SearchBarProps = {
  /** Destino do GET (ex.: "/projetos"). Funciona sem JavaScript. */
  action: string
  placeholder: string
  /** Rótulo para leitores de tela (o placeholder não substitui rótulo). */
  label: string
  name?: string
  /** Texto já digitado (ex.: a busca atual da URL). Dê uma `key` que mude com ele. */
  defaultValue?: string
}

export function SearchBar({
  action,
  placeholder,
  label,
  name = 'q',
  defaultValue,
}: SearchBarProps) {
  const inputId = useId()
  const campo = useRef<HTMLInputElement>(null)

  // O "X" nativo do campo só apaga o texto e não envia o formulário. Se havia uma busca aplicada,
  // enviamos o campo vazio para voltar à lista completa. Enter já envia sozinho (evita envio duplo).
  useEffect(() => {
    const input = campo.current
    if (!input || !defaultValue) return
    let apertouEnter = false
    const aoTeclar = (evento: KeyboardEvent) => {
      apertouEnter = evento.key === 'Enter'
    }
    const aoBuscar = () => {
      if (input.value === '' && !apertouEnter) input.form?.requestSubmit()
    }
    input.addEventListener('keydown', aoTeclar)
    input.addEventListener('search', aoBuscar)
    return () => {
      input.removeEventListener('keydown', aoTeclar)
      input.removeEventListener('search', aoBuscar)
    }
  }, [defaultValue])

  return (
    <form
      role="search"
      action={action}
      method="get"
      className="flex items-center gap-2 rounded-lg bg-surface p-2 shadow-md"
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative flex-1">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg"
        />
        <Input
          ref={campo}
          id={inputId}
          name={name}
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="border-transparent pl-10"
        />
      </div>
      <Button type="submit">Buscar</Button>
    </form>
  )
}
