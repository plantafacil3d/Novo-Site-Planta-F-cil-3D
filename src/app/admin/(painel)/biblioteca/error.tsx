'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado ao carregar a biblioteca do painel. */
export default function BibliotecaAdminError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar a biblioteca"
      description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
      onRetry={reset}
    />
  )
}
