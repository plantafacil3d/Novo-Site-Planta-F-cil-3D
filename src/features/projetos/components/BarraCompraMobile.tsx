import { PriceTag } from '@/components/shared/PriceTag'
import { Button } from '@/components/ui/Button'

import type { PrecoExibido } from '../rules'

type BarraCompraMobileProps = {
  preco: PrecoExibido
  /** Checkout já validado; `null` = compra indisponível. */
  checkoutUrl: string | null
}

/**
 * Preço e botão de compra fixos na base da tela, só no celular. Precisa ser o último item da
 * página: `sticky` faz a barra parar no fim do conteúdo e nunca cobrir o rodapé.
 */
export function BarraCompraMobile({ preco, checkoutUrl }: BarraCompraMobileProps) {
  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-between gap-4 border-t border-border bg-page p-3 shadow-lg md:hidden">
      <PriceTag
        price={preco.atual}
        originalPrice={preco.original}
        discountLabel={preco.desconto}
        priceClassName="text-xl"
      />
      {checkoutUrl ? (
        <Button href={checkoutUrl} iconLeft="cart">
          Comprar projeto
        </Button>
      ) : (
        <Button iconLeft="cart" disabled>
          Indisponível
        </Button>
      )}
    </div>
  )
}
