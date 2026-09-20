import { Button } from '@/components/ui/Button'

type BarraCompraMobileProps = {
  /** Preço já formatado (ex.: "R$ 299,90"). */
  preco: string
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
      <p className="font-heading text-xl font-bold">{preco}</p>
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
