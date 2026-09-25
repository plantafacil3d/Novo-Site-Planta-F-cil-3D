import Image from 'next/image'
import type { ReactNode } from 'react'

import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { Icon, type IconName } from '../ui/Icon'

export type ProjectSpec = { icon: IconName; label: string }

type ProjectCardProps = {
  href: string
  title: string
  /**
   * Código manual do projeto, se houver (ex.: "CASA-010"). Vira uma linha de texto acima do
   * título só no `density="default"`; no `"compact"` essa linha não existe (ver `projectCode`).
   */
  code?: string
  /**
   * Código real do projeto (ex.: "PF-05"), selo do canto superior esquerdo só no
   * `density="compact"`. Sem efeito no `"default"`, que mostra `badge` nesse canto.
   */
  projectCode?: string
  image: { src: string; alt: string }
  /** Selo (ex.: "Mais vendido", "Lançamento", "Similar"). Canto superior esquerdo só no
   * `density="default"`; no `"compact"` esse canto mostra `projectCode`, não `badge`. */
  badge?: string
  specs: ProjectSpec[]
  /** Preço já formatado (ex.: "R$ 399,00"). */
  price: string
  /** Preço riscado; omitido quando não há desconto ativo. */
  priceOriginal?: string
  /** Selo verde do desconto (ex.: "60% OFF"); omitido junto de `priceOriginal`. */
  priceDiscount?: string
  /** Coração de favoritar, pronto; quem monta o card decide de onde ele vem. */
  favorite: ReactNode
  /**
   * `compact` (padrão): card em teste, espaçamento mais justo e botão "Ver detalhes" em
   * linha própria abaixo do preço. `default`: card anterior, mantido para poder voltar a ele
   * sem recriar nada — passe explicitamente quando precisar.
   */
  density?: 'default' | 'compact'
}

/**
 * Card de projeto. O card inteiro leva a um único destino (o botão "Ver detalhes" estica o
 * link por cima do card); o coração fica acima dele para poder ser clicado sem navegar.
 */
export function ProjectCard({
  href,
  title,
  code,
  projectCode,
  image,
  badge,
  specs,
  price,
  priceOriginal,
  priceDiscount,
  favorite,
  density = 'compact',
}: ProjectCardProps) {
  const compact = density === 'compact'

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
        {compact
          ? projectCode && <Badge className="absolute top-3 left-3">{projectCode}</Badge>
          : badge && <Badge className="absolute top-3 left-3">{badge}</Badge>}
        <div className="absolute top-1 right-1 z-10">{favorite}</div>
      </div>

      <div className={cn('flex flex-1 flex-col', compact ? 'gap-3 p-3' : 'gap-4 p-4')}>
        <div>
          {!compact && code && <p className="text-xs font-medium text-fg-muted">{code}</p>}
          <h3 className="font-heading text-base font-semibold">{title}</h3>
        </div>

        {compact ? (
          <div className="flex divide-x divide-border text-xs text-fg-muted">
            <ul className="flex flex-1 flex-col gap-1.5 pr-3">
              {specs
                .filter((_, index) => index % 2 === 0)
                .map((spec) => (
                  <li key={spec.label} className="flex items-center gap-2">
                    <Icon name={spec.icon} className="size-3.5 text-primary" />
                    {spec.label}
                  </li>
                ))}
            </ul>
            <ul className="flex flex-1 flex-col gap-1.5 pl-3">
              {specs
                .filter((_, index) => index % 2 === 1)
                .map((spec) => (
                  <li key={spec.label} className="flex items-center gap-2">
                    <Icon name={spec.icon} className="size-3.5 text-primary" />
                    {spec.label}
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-fg-muted">
            {specs.map((spec) => (
              <li key={spec.label} className="flex items-center gap-2">
                <Icon name={spec.icon} className="size-4 text-primary" />
                {spec.label}
              </li>
            ))}
          </ul>
        )}

        {compact ? (
          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-3">
            <div>
              {priceOriginal && (
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm text-fg-muted line-through">{priceOriginal}</p>
                  {priceDiscount && <Badge variant="discount">{priceDiscount}</Badge>}
                </div>
              )}
              <p className="font-heading text-xl font-bold">{price}</p>
            </div>
            <Button
              href={href}
              iconRight="arrow-right"
              aria-label={`Ver detalhes de ${title}`}
              className="w-full after:absolute after:inset-0"
            >
              Ver detalhes
            </Button>
          </div>
        ) : (
          <div className="mt-auto pt-2">
            {priceOriginal && (
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-sm text-fg-muted line-through">{priceOriginal}</p>
                {priceDiscount && <Badge variant="discount">{priceDiscount}</Badge>}
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
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
        )}
      </div>
    </article>
  )
}
