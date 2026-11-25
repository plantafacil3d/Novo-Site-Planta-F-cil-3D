import Image from 'next/image'

import { Button } from '@/components/ui/Button'

import type { ProdutoResumo } from '../types'

type ProdutoCardProps = {
  produto: ProdutoResumo
  /** Linha cinza acima do nome (ex.: "Cozinha" ou "Iluminação · Cozinha"). */
  rotulo: string
  /** Endereço do "Ver oferta" (`hrefDaOferta`): passa pelo site, que anota o clique. */
  hrefOferta: string
  /** `sizes` da foto, conforme a largura do card onde ele é usado. */
  imageSizes: string
}

/**
 * Card de produto (Loja e "Decore como no projeto"): foto quadrada, rótulo, nome e "Ver oferta ↗".
 * Sem preço e sem nome de loja. A oferta abre em nova aba, para o site continuar aberto.
 */
export function ProdutoCard({ produto, rotulo, hrefOferta, imageSizes }: ProdutoCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      {/* Foto inteira, sem cortar (`contain`), sobre fundo branco como nas lojas. */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={produto.foto.src}
          alt={produto.foto.alt}
          fill
          sizes={imageSizes}
          quality={75}
          draggable={false}
          className="object-contain p-2"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="truncate text-sm text-fg-muted">{rotulo}</p>
        <h3 className="line-clamp-2 flex-1 font-body text-sm font-medium sm:text-base">
          {produto.nome}
        </h3>
        <Button
          href={hrefOferta}
          target="_blank"
          rel="sponsored nofollow noopener"
          iconRight="arrow-up-right"
          aria-label={`Ver oferta: ${produto.nome} (abre em uma nova aba)`}
          draggable={false}
          className="mt-2 w-full"
        >
          Ver oferta
        </Button>
      </div>
    </article>
  )
}
