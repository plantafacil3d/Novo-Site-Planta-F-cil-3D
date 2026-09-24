import Image from 'next/image'

import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Icon, type IconName } from '../ui/Icon'
import { FavoriteButton } from './FavoriteButton'

export type ProjectSpec = { icon: IconName; label: string }

type ProjectCardProps = {
  href: string
  title: string
  /** Código manual do projeto, se houver (ex.: "CASA-010"). */
  code?: string
  image: { src: string; alt: string }
  badge?: string
  specs: ProjectSpec[]
  /** Preço já formatado (ex.: "R$ 399,00"). */
  price: string
  /** Preço riscado; omitido quando não há desconto ativo. */
  priceOriginal?: string
  /** Selo verde do desconto (ex.: "60% OFF"); omitido junto de `priceOriginal`. */
  priceDiscount?: string
  favoriteLabel: string
}

/**
 * Card de projeto. O card inteiro leva a um único destino (o botão "Ver detalhes" estica o
 * link por cima do card); o coração fica acima dele para poder ser clicado sem navegar.
 */
export function ProjectCard({
  href,
  title,
  code,
  image,
  badge,
  specs,
  price,
  priceOriginal,
  priceDiscount,
  favoriteLabel,
}: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow duration-250 ease-standard hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-250 ease-standard group-hover:scale-105"
        />
        {badge && <Badge className="absolute top-3 left-3">{badge}</Badge>}
        <div className="absolute top-1 right-1 z-10">
          <FavoriteButton label={favoriteLabel} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          {code && <p className="text-xs font-medium text-fg-muted">{code}</p>}
          <h3 className="font-heading text-base font-semibold">{title}</h3>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-fg-muted">
          {specs.map((spec) => (
            <li key={spec.label} className="flex items-center gap-2">
              <Icon name={spec.icon} className="size-4 text-primary" />
              {spec.label}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2">
          {priceOriginal && (
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-sm text-fg-muted line-through">{priceOriginal}</p>
              {priceDiscount && <Badge variant="discount">{priceDiscount}</Badge>}
            </div>
          )}
          <div className="flex items-end justify-between gap-3">
            <p className="font-heading text-lg font-bold">{price}</p>
            <Button
              href={href}
              iconRight="arrow-right"
              aria-label={`Ver detalhes de ${title}`}
              className="after:absolute after:inset-0"
            >
              Ver detalhes
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
