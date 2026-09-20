import Form from 'next/form'
import { useId, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

import {
  estilosArquitetonicos,
  faixasDeArea,
  opcoesDeQuantidade,
  ordenacoesDeProjetos,
  tiposDeProjeto,
} from '../catalogo'
import { temFiltros } from '../rules'
import type { ParametrosListagem } from '../types'

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

function SelectDeMinimo({
  rotulo,
  name,
  opcoes,
  valor,
}: {
  rotulo: string
  name: string
  opcoes: readonly number[]
  valor: number | undefined
}) {
  return (
    <Campo rotulo={rotulo}>
      {(id) => (
        <Select id={id} name={name} defaultValue={valor?.toString() ?? ''}>
          <option value="">Qualquer</option>
          {opcoes.map((quantidade) => (
            <option key={quantidade} value={quantidade}>
              {quantidade} ou mais
            </option>
          ))}
        </Select>
      )}
    </Campo>
  )
}

/**
 * Filtros da listagem. É um formulário GET: aplicar leva a `/projetos?tipo=...`, então o estado
 * fica na URL (link compartilhável, botão "voltar" funciona) e a página é renderizada no servidor.
 * Como os campos são "não controlados", quem usa deve dar uma `key` (no formulário ou num
 * elemento acima dele) que mude com os filtros, para os campos refletirem a URL depois de
 * remover um filtro pelas etiquetas.
 */
export function FormularioDeFiltros({ params }: { params: ParametrosListagem }) {
  return (
    <Form
      action="/projetos"
      role="search"
      aria-label="Filtrar projetos"
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4"
    >
      {/* A categoria vem dos cartões da home e não tem campo aqui; sem isto, aplicar a apagaria. */}
      {params.categoria && <input type="hidden" name="categoria" value={params.categoria} />}

      <Campo rotulo="Nome ou código do projeto">
        {(id) => (
          <Input
            id={id}
            name="q"
            type="search"
            maxLength={100}
            autoComplete="off"
            defaultValue={params.q}
            placeholder="Ex.: PF-012 ou sobrado moderno"
          />
        )}
      </Campo>

      <Campo rotulo="Ordenar por">
        {(id) => (
          <Select id={id} name="ordem" defaultValue={params.ordem}>
            {ordenacoesDeProjetos.map((ordem) => (
              <option key={ordem.valor} value={ordem.valor}>
                {ordem.rotulo}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <Campo rotulo="Tipo de projeto">
        {(id) => (
          <Select id={id} name="tipo" defaultValue={params.tipo ?? ''}>
            <option value="">Todos</option>
            {tiposDeProjeto.map((tipo) => (
              <option key={tipo.valor} value={tipo.valor}>
                {tipo.rotulo}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <Campo rotulo="Estilo arquitetônico">
        {(id) => (
          <Select id={id} name="estilo" defaultValue={params.estilo ?? ''}>
            <option value="">Todos</option>
            {estilosArquitetonicos.map((estilo) => (
              <option key={estilo.valor} value={estilo.valor}>
                {estilo.rotulo}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <SelectDeMinimo
        rotulo="Quartos"
        name="quartos"
        opcoes={opcoesDeQuantidade.quartos}
        valor={params.quartos}
      />
      <SelectDeMinimo
        rotulo="Suítes"
        name="suites"
        opcoes={opcoesDeQuantidade.suites}
        valor={params.suites}
      />
      <SelectDeMinimo
        rotulo="Vagas de garagem"
        name="vagas"
        opcoes={opcoesDeQuantidade.vagas}
        valor={params.vagas}
      />

      <Campo rotulo="Área construída">
        {(id) => (
          <Select id={id} name="area" defaultValue={params.area ?? ''}>
            <option value="">Qualquer</option>
            {faixasDeArea.map((faixa) => (
              <option key={faixa.valor} value={faixa.valor}>
                {faixa.rotulo}
              </option>
            ))}
          </Select>
        )}
      </Campo>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Meu terreno (em metros)</legend>
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Frente">
            {(id) => (
              <Input
                id={id}
                name="largura"
                type="number"
                inputMode="decimal"
                min={1}
                max={500}
                step="any"
                defaultValue={params.largura}
                placeholder="Ex.: 10"
              />
            )}
          </Campo>
          <Campo rotulo="Fundo">
            {(id) => (
              <Input
                id={id}
                name="profundidade"
                type="number"
                inputMode="decimal"
                min={1}
                max={500}
                step="any"
                defaultValue={params.profundidade}
                placeholder="Ex.: 25"
              />
            )}
          </Campo>
        </div>
        <p className="text-xs text-fg-muted">Mostra só os projetos que cabem no seu terreno.</p>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-sm font-medium">Diferenciais</legend>
        <Checkbox name="piscina" value="1" label="Com piscina" defaultChecked={params.piscina} />
        <Checkbox
          name="gourmet"
          value="1"
          label="Com área gourmet"
          defaultChecked={params.gourmet}
        />
      </fieldset>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full">
          Aplicar filtros
        </Button>
        {temFiltros(params) && (
          <Button href="/projetos" variant="ghost" className="w-full">
            Limpar filtros
          </Button>
        )}
      </div>
    </Form>
  )
}
