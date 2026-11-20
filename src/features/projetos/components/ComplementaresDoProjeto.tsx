import { SecaoDestacada } from '@/components/layout/SecaoDestacada'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { IconeEmBloco } from '@/components/ui/IconeEmBloco'

import { checkoutSeguro, formatarPreco } from '../rules'
import type { ComplementarDoProjeto } from '../types'

/** Acima disto (em caracteres), a descrição pode não caber numa linha: ganha a setinha para abrir. */
const DESCRICAO_DE_UMA_LINHA = 70

/** Descrição numa linha, como na referência; se for maior, a setinha abre o cartão e mostra o resto
 *  (`<details>` nativo, sem JavaScript). */
function Descricao({ texto }: { texto: string }) {
  if (!texto) return null
  if (texto.length <= DESCRICAO_DE_UMA_LINHA) {
    return <p className="mt-0.5 text-sm text-fg-muted">{texto}</p>
  }
  return (
    <details className="group mt-0.5">
      <summary className="flex cursor-pointer list-none items-start gap-1 text-sm text-fg-muted [&::-webkit-details-marker]:hidden">
        <span className="line-clamp-1 group-open:line-clamp-none">{texto}</span>
        <Icon
          name="chevron-down"
          className="mt-0.5 size-4 shrink-0 transition-transform duration-150 ease-standard group-open:rotate-180"
        />
        <span className="sr-only">Mostrar a descrição inteira</span>
      </summary>
    </details>
  )
}

/**
 * "Projetos complementares": cartões dentro da moldura de destaque (`SecaoDestacada`), cada um com o
 * ícone colorido escolhido no cadastro (aba "Complementares"), título, descrição curta, preço e
 * "Comprar". Layout igual à referência enviada pelo usuário (2026-11-20). Sem nenhum complementar, a
 * seção não aparece.
 */
export function ComplementaresDoProjeto({
  complementares,
}: {
  complementares: ComplementarDoProjeto[]
}) {
  if (complementares.length === 0) return null

  return (
    <SecaoDestacada
      selo="Projetos complementares"
      title="Projetos complementares"
      subtitle="Complete sua obra com os projetos que acompanham este modelo."
    >
      <ul className="mt-8 flex flex-col gap-4">
        {complementares.map((complementar) => {
          const checkout = checkoutSeguro(complementar.checkoutUrl)
          return (
            <li
              key={complementar.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:gap-6 md:px-5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                <IconeEmBloco
                  icon={complementar.icone.nome}
                  tone={complementar.icone.tom}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg">{complementar.titulo}</h3>
                  <Descricao texto={complementar.descricao} />
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
                {complementar.precoCentavos !== null && (
                  <p className="font-heading text-xl font-bold">
                    {formatarPreco(complementar.precoCentavos)}
                  </p>
                )}
                {checkout && (
                  <Button href={checkout} aria-label={`Comprar ${complementar.titulo}`}>
                    Comprar
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </SecaoDestacada>
  )
}
