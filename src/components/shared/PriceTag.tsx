import { Badge } from '../ui/Badge'
import { cn } from '../ui/cn'

type PriceTagProps = {
  /** Preço que vale, já formatado (ex.: "R$ 196,48"). */
  price: string
  /** Preço riscado; omitido quando não há desconto ativo. */
  originalPrice?: string
  /** Selo verde do desconto (ex.: "60% OFF"); omitido junto de `originalPrice`. */
  discountLabel?: string
  /** Tamanho do preço atual, na escala tipográfica de onde ele aparece (ex.: "text-3xl" no topo da página). */
  priceClassName?: string
  /** Cor do preço riscado; troque para `text-fg-inverse/70` sobre fundo escuro. */
  originalPriceClassName?: string
  className?: string
}

/**
 * Preço com desconto, no padrão Mercado Livre: original riscado acima, preço atual em destaque e
 * selo verde do desconto ao lado. Sem `originalPrice`, mostra só o preço atual.
 */
export function PriceTag({
  price,
  originalPrice,
  discountLabel,
  priceClassName = 'text-lg',
  originalPriceClassName = 'text-fg-muted',
  className,
}: PriceTagProps) {
  return (
    <div className={className}>
      {originalPrice && (
        <p className={cn('text-sm line-through', originalPriceClassName)}>{originalPrice}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <p className={cn('font-heading font-bold', priceClassName)}>{price}</p>
        {discountLabel && <Badge variant="accent">{discountLabel}</Badge>}
      </div>
    </div>
  )
}
