import { ProjetosSkeleton } from '@/features/projetos'

/** Mostrada na hora do clique em "Projetos", enquanto o servidor monta a página: título e cards em branco. */
export function ProjetosCarregando() {
  return (
    <div className="mx-auto max-w-content px-4 pt-6 pb-12 md:pb-16">
      <h1 className="text-3xl">Projetos prontos</h1>
      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-9 lg:col-start-4">
          <ProjetosSkeleton />
        </div>
      </div>
    </div>
  )
}
