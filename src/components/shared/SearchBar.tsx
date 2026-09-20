import { useId } from 'react'

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
