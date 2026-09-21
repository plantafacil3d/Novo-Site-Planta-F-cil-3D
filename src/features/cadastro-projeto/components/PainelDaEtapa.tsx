import type { ReactNode } from 'react'

type PainelDaEtapaProps = {
  titulo: string
  descricao?: string
  children: ReactNode
}

/** Moldura de uma aba: cartão branco com título e uma linha de apoio. */
export function PainelDaEtapa({ titulo, descricao, children }: PainelDaEtapaProps) {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-4 sm:p-6">
      <header>
        <h2 className="text-xl">{titulo}</h2>
        {descricao && <p className="mt-1 text-sm text-fg-muted">{descricao}</p>}
      </header>
      {children}
    </section>
  )
}
