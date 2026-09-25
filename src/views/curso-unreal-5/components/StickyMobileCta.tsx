import { Button } from '@/components/ui/Button'

import { cursoPreco, hotmartCheckoutUrl } from '../data'

/**
 * Preço e botão de matrícula fixos na base da tela, só no celular. Não reaproveita
 * `BarraCompraMobile` (feature `projetos`): aquele componente depende de `PrecoExibido`, tipo
 * específico de projeto; aqui o preço é um texto fixo do curso.
 * Precisa ser o último item da página: `sticky` para no fim do conteúdo e não cobre o rodapé.
 */
export function StickyMobileCta() {
  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-between gap-4 border-t border-border bg-page p-3 shadow-lg md:hidden">
      <div>
        <p className="text-xs text-fg-muted line-through">{cursoPreco.original}</p>
        <p className="font-heading text-lg font-bold">{cursoPreco.atual}</p>
      </div>
      <Button href={hotmartCheckoutUrl} iconLeft="cart">
        Garantir vaga
      </Button>
    </div>
  )
}
