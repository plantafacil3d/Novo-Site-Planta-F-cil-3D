'use client'

import { useState } from 'react'

import { ProjectCard } from '@/components/shared/ProjectCard'

import { alternarSelecaoComparacao, COMPARACAO_MAXIMO } from '../rules'
import type { CardFavorito } from '../types'
import { FavoriteToggle } from './FavoriteToggle'
import { TabelaComparacao } from './TabelaComparacao'

/**
 * Grade de favoritos com seleção para comparar (até `COMPARACAO_MAXIMO` de cada vez). Recebe os
 * cards já prontos (`CardFavorito`, montados em `PainelFavoritosView`): este arquivo é client e não
 * pode importar `features/projetos`/`features/conta`, que arrastam código `server-only`.
 */
export function GradeFavoritos({ cards }: { cards: CardFavorito[] }) {
  const [selecionados, setSelecionados] = useState<string[]>([])
  const selecionadosData = cards.filter((card) => selecionados.includes(card.id))

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const selecionado = selecionados.includes(card.id)
          return (
            <li key={card.id} className="grid gap-2">
              <ProjectCard
                href={card.href}
                title={card.titulo}
                code={card.code}
                image={card.image}
                specs={card.specs}
                price={card.price}
                priceOriginal={card.priceOriginal}
                priceDiscount={card.priceDiscount}
                favorite={
                  <FavoriteToggle
                    projetoId={card.id}
                    label={`Remover ${card.titulo} dos favoritos`}
                    entrarComGoogleAction={card.entrarComGoogleAction}
                  />
                }
              />
              <label className="flex min-h-11 items-center gap-2 text-sm text-fg-muted">
                <input
                  type="checkbox"
                  checked={selecionado}
                  disabled={!selecionado && selecionados.length >= COMPARACAO_MAXIMO}
                  onChange={() =>
                    setSelecionados((atual) => alternarSelecaoComparacao(atual, card.id))
                  }
                  className="size-4 rounded border-border accent-primary"
                />
                Comparar
              </label>
            </li>
          )
        })}
      </ul>

      {selecionadosData.length >= 2 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl">Comparar projetos selecionados</h2>
          <TabelaComparacao itens={selecionadosData} />
        </div>
      )}
    </div>
  )
}
