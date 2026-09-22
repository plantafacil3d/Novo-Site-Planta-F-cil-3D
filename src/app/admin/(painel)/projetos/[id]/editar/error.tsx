'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado ao abrir a edição de projeto. */
export default function EditarProjetoError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível abrir a edição"
      description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
      onRetry={reset}
    />
  )
}
