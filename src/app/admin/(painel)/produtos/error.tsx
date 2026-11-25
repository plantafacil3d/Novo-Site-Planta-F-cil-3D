'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado ao carregar os produtos do painel. */
export default function ProdutosAdminError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar os produtos"
      description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
      onRetry={reset}
    />
  )
}
