'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado ao abrir o cadastro de projeto. */
export default function NovoProjetoError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível abrir o cadastro"
      description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
      onRetry={reset}
    />
  )
}
