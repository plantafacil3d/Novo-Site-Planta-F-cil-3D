import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

import { checkoutSeguro, formatarPreco } from '../rules'
import type { ComplementarDoProjeto } from '../types'

/**
 * "Projetos complementares": lista enxuta (uma linha por complementar: título e valor) do Cadastro
 * (aba "Complementares"). A descrição fica escondida e abre ao clicar no título (`<details>`
 * nativo, como a sanfona de perguntas); preço e botão de compra ficam fora da área que abre. Sem
 * nenhum complementar, a seção não aparece.
 */
export function ComplementaresDoProjeto({
  complementares,
}: {
  complementares: ComplementarDoProjeto[]
}) {
  if (complementares.length === 0) return null

  return (
    <Section
      title="Projetos complementares"
      subtitle="Projetos extras que combinam com este e podem ser adquiridos à parte."
    >
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {complementares.map((complementar) => {
          const checkout = checkoutSeguro(complementar.checkoutUrl)
          return (
            <li
              key={complementar.id}
              className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
            >
              {complementar.descricao ? (
                <details className="group min-w-0 flex-1">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
                    {complementar.titulo}
                    <Icon
                      name="chevron-right"
                      className="size-4 shrink-0 text-fg-muted transition-transform duration-150 ease-standard group-open:rotate-90"
                    />
                  </summary>
                  <p className="pb-2 text-sm text-fg-muted">{complementar.descricao}</p>
                </details>
              ) : (
                <p className="flex min-h-11 flex-1 items-center font-semibold">
                  {complementar.titulo}
                </p>
              )}
              <div className="flex shrink-0 items-center justify-between gap-4 sm:min-h-11 sm:justify-end">
                {complementar.precoCentavos !== null && (
                  <p className="font-semibold">{formatarPreco(complementar.precoCentavos)}</p>
                )}
                {checkout && (
                  <Button
                    href={checkout}
                    variant="secondary"
                    iconLeft="cart"
                    aria-label={`Comprar ${complementar.titulo}`}
                  >
                    Comprar
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
