import { ProjetoDetalheSkeleton } from '@/features/projetos'

/** Mostrada na hora do clique em um projeto, enquanto o servidor monta a página. */
export function ProjetoCarregando() {
  return (
    <div className="mx-auto max-w-content px-4 py-6 md:py-8">
      <ProjetoDetalheSkeleton />
    </div>
  )
}
