import Form from 'next/form'
import { useId, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

import { opcoesDoFiltro, temFiltrosNaLoja } from '../rules'
import type { FiltrosDaLoja, ParametrosLoja } from '../types'

/** Rótulo sempre visível + campo, ligados pelo `id` (o placeholder não substitui rótulo). */
function Campo({ rotulo, children }: { rotulo: string; children: (id: string) => ReactNode }) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </label>
      {children(id)}
    </div>
  )
}

/**
 * Filtros da Loja, na horizontal a partir de `lg` (empilhados no celular). Mesmo visual e mesmo
 * funcionamento dos filtros de `/projetos`: formulário GET, então o estado fica na URL e aplicar
 * um filtro volta à página 1 (o formulário não envia `pagina`). Quem usa dá uma `key` que muda com
 * os filtros, para os campos (não controlados) refletirem a URL.
 */
export function FormularioDeFiltrosLoja({
  params,
  filtros,
}: {
  params: ParametrosLoja
  filtros: FiltrosDaLoja
}) {
  const categorias = opcoesDoFiltro(filtros.categorias, params.categoria)
  const ambientes = opcoesDoFiltro(filtros.ambientes, params.ambiente)

  return (
    <Form
      action="/loja"
      role="search"
      aria-label="Filtrar produtos"
      className="grid gap-4 rounded-lg border border-border bg-surface p-4 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end"
    >
      <Campo rotulo="Nome do produto">
        {(id) => (
          <Input
            id={id}
            name="q"
            type="search"
            maxLength={100}
            autoComplete="off"
            defaultValue={params.q}
            placeholder="Ex.: pendente, sofá, porcelanato"
          />
        )}
      </Campo>

      <Campo rotulo="Categoria">
        {(id) => (
          <Select id={id} name="categoria" defaultValue={params.categoria ?? ''}>
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <Campo rotulo="Ambiente">
        {(id) => (
          <Select id={id} name="ambiente" defaultValue={params.ambiente ?? ''}>
            <option value="">Todos</option>
            {ambientes.map((ambiente) => (
              <option key={ambiente} value={ambiente}>
                {ambiente}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit">Aplicar filtros</Button>
        {temFiltrosNaLoja(params) && (
          <Button href="/loja" variant="ghost">
            Limpar filtros
          </Button>
        )}
      </div>
    </Form>
  )
}
