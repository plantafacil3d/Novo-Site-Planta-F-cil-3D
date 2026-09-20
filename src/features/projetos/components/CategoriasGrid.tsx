import { CategoryTile } from '@/components/shared/CategoryTile'
import type { IconName } from '@/components/ui/Icon'

import { hrefCategoria } from '../rules'
import type { Categoria, CategoriaSlug } from '../types'

const iconePorCategoria: Record<CategoriaSlug, IconName> = {
  sobrados: 'building2',
  'casas-terreas': 'house',
  'casas-pequenas': 'warehouse',
  'casas-de-campo': 'trees',
  modernas: 'building',
  'com-1-suite': 'bed-single',
  'com-2-suites': 'bed-double',
  'com-piscina': 'waves',
  mais: 'layout-grid',
}

export function CategoriasGrid({ categorias }: { categorias: Categoria[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
      {categorias.map((categoria) => (
        <li key={categoria.slug} className="grid">
          <CategoryTile
            href={hrefCategoria(categoria)}
            label={categoria.rotulo}
            icon={iconePorCategoria[categoria.slug]}
          />
        </li>
      ))}
    </ul>
  )
}
