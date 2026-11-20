import type { ReactNode } from 'react'

import { Dica } from '@/components/ui/Dica'

type PainelDaEtapaProps = {
  titulo: string
  descricao?: string
  /** Explicação escondida num ícone "i" ao lado do título, no lugar da `descricao` sempre visível. */
  dica?: string
  children: ReactNode
}

/** Moldura de uma aba: cartão branco com título e uma linha de apoio (ou uma dica no "i"). */
export function PainelDaEtapa({ titulo, descricao, dica, children }: PainelDaEtapaProps) {
  return (
    <section className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-4 sm:p-6">
      <header>
        <h2 className="flex items-center gap-2 text-xl">
          {titulo}
          {dica && <Dica texto={dica} />}
        </h2>
        {descricao && <p className="mt-1 text-sm text-fg-muted">{descricao}</p>}
      </header>
      {children}
    </section>
  )
}
