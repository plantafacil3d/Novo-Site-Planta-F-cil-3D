'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado ao carregar a Loja. */
export default function LojaError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-content px-4 py-12">
      <ErrorState
        title="Não foi possível carregar a Loja"
        description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
        onRetry={reset}
      />
    </div>
  )
}
