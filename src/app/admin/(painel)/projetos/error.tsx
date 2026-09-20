'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado ao carregar os projetos do painel. */
export default function ProjetosAdminError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar os projetos"
      description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
      onRetry={reset}
    />
  )
}
