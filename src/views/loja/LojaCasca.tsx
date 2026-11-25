import type { ReactNode } from 'react'

import { Breadcrumb } from '@/components/navigation/Breadcrumb'

/**
 * Casca da página `/loja` (trilha, título e texto): a mesma no `loading.tsx` e no `Suspense` da
 * página, para só o miolo trocar quando os dados chegam. Mesmo desenho de "Projetos prontos".
 */
export function LojaCasca({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="mx-auto max-w-content px-4 pt-2">
        <Breadcrumb items={[{ label: 'Início', href: '/' }, { label: 'Loja' }]} />
      </div>

      <div className="mx-auto max-w-content px-4 pt-4 pb-12 md:pb-16">
        <h1 className="text-3xl">Loja</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Móveis, iluminação, acabamentos e ferramentas para construir e decorar a sua casa —
          selecionados pela equipe Planta Fácil 3D.
        </p>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}
