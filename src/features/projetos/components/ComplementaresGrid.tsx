import { MediaCard } from '@/components/shared/MediaCard'

import { formatarPreco, hrefComplementar } from '../rules'
import type { Complementar } from '../types'

export function ComplementaresGrid({ complementares }: { complementares: Complementar[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {complementares.map((complementar) => (
        <li key={complementar.id} className="grid">
          <MediaCard
            href={hrefComplementar(complementar)}
            title={complementar.titulo}
            image={complementar.imagem}
            price={formatarPreco(complementar.precoCentavos)}
          />
        </li>
      ))}
    </ul>
  )
}
