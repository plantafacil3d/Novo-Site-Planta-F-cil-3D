'use client'

import { ErrorState } from '@/components/shared/ErrorState'

/** Erro inesperado na listagem ou na página de um projeto. */
export default function ProjetosError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-content px-4 py-12">
      <ErrorState
        title="Não foi possível carregar esta página"
        description="Aconteceu um problema do nosso lado. Tente novamente em instantes."
        onRetry={reset}
      />
    </div>
  )
}
