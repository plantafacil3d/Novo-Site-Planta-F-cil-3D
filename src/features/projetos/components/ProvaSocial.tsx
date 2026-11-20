import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/components/ui/cn'

import { avataresSorteados } from '../avatares'
import type { ProvaSocialDoProjeto } from '../types'

const ESTRELAS = [1, 2, 3, 4, 5]

const formatarClientes = (clientes: number) => clientes.toLocaleString('pt-BR')
const formatarNota = (nota: number) =>
  nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/**
 * Faixa lilás do topo da página do projeto: "★★★★★ 4,9 · 128 clientes já compraram este projeto", com
 * três avatares decorativos (iniciais e cores sorteadas por projeto, sempre as mesmas) e um "+". A
 * quantidade e a nota vêm da aba "Marketing" do cadastro; os textos são fixos. Sem nota, ficam só os
 * avatares e o texto. Layout igual à referência enviada pelo usuário (2026-11-20).
 */
export function ProvaSocial({
  provaSocial,
  semente,
}: {
  provaSocial: ProvaSocialDoProjeto | null
  /** Slug do projeto: decide o sorteio dos avatares. */
  semente: string
}) {
  if (!provaSocial) return null
  const { clientes, nota } = provaSocial
  const cheias = nota === null ? 0 : Math.round(nota)
  const frase =
    clientes === 1
      ? '1 cliente já comprou este projeto'
      : `${formatarClientes(clientes)} clientes já compraram este projeto`

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-highlight-subtle px-4 py-3 text-sm">
      <div aria-hidden="true" className="flex -space-x-2">
        {avataresSorteados(semente).map((avatar) => (
          <Avatar
            key={avatar.iniciais}
            iniciais={avatar.iniciais}
            tone={avatar.tom}
            className="ring-2 ring-surface"
          />
        ))}
        <Avatar iniciais="+" tone="highlight" className="ring-2 ring-surface" />
      </div>
      <p className="flex flex-wrap items-center gap-x-1.5">
        {nota !== null && (
          <>
            <span
              role="img"
              aria-label={`Nota ${formatarNota(nota)} de 5`}
              className="flex items-center text-rating"
            >
              {ESTRELAS.map((estrela) => (
                <Icon
                  key={estrela}
                  name="star"
                  strokeWidth={1.5}
                  className={cn('size-4', estrela <= cheias && 'fill-current')}
                />
              ))}
            </span>
            <strong aria-hidden="true" className="ml-1 text-base font-bold">
              {formatarNota(nota)}
            </strong>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span>{frase}</span>
      </p>
    </div>
  )
}
