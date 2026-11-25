'use client'

import { useState } from 'react'

import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/shared/Carousel'
import { Button } from '@/components/ui/Button'

import { ambientesDosProdutos, hrefDaOferta, rotuloDoProduto } from '../rules'
import { AVISO_DE_AFILIADO } from '../textos'
import type { ProdutoResumo } from '../types'
import { ProdutoCard } from './ProdutoCard'

/** Largura real da foto: ~40% da tela no celular (2,5 cards); do `lg` em diante, 1/6 da faixa. */
const SIZES_DO_CARD = '(min-width: 1200px) 185px, (min-width: 1024px) 16vw, 40vw'

/**
 * "Decore como no projeto": produtos parecidos com os das imagens do projeto, num carrossel com
 * filtro por ambiente. Sem produto ativo ligado, a seção não aparece.
 */
export function DecoreComoNoProjeto({
  projetoId,
  codigo,
  produtos,
}: {
  projetoId: string
  /** Código que o cliente vê (ex.: "P18"). */
  codigo: string
  produtos: ProdutoResumo[]
}) {
  // `null` = "Todos".
  const [ambiente, setAmbiente] = useState<string | null>(null)
  if (produtos.length === 0) return null

  const ambientes = ambientesDosProdutos(produtos)
  const visiveis = ambiente
    ? produtos.filter((produto) => produto.ambientes.includes(ambiente))
    : produtos
  const opcoes: { valor: string | null; rotulo: string }[] = [
    { valor: null, rotulo: 'Todos' },
    ...ambientes.map((valor) => ({ valor, rotulo: valor })),
  ]

  return (
    <Section
      tone="tint"
      contentSpacing="tight"
      title="Decore como no projeto"
      subtitle={`Móveis e iluminação parecidos com os que aparecem nas imagens do ${codigo}.`}
    >
      {ambientes.length > 1 && (
        <div role="group" aria-label="Filtrar por ambiente" className="mb-6 flex flex-wrap gap-2">
          {opcoes.map((opcao) => (
            <Button
              key={opcao.valor ?? 'todos'}
              variant={ambiente === opcao.valor ? 'primary' : 'secondary'}
              aria-pressed={ambiente === opcao.valor}
              onClick={() => setAmbiente(opcao.valor)}
            >
              {opcao.rotulo}
            </Button>
          ))}
        </div>
      )}

      {/* A `key` remonta a faixa ao trocar de filtro: a lista volta ao início. */}
      <Carousel
        key={ambiente ?? 'todos'}
        label="Produtos para decorar como no projeto"
        itemClassName="w-[calc((100%-2rem)/2.5)] sm:w-[calc((100%-3rem)/3.5)] md:w-[calc((100%-4rem)/4.5)]"
        desktopColumns={6}
        dragToScroll
      >
        {visiveis.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            rotulo={rotuloDoProduto(produto, 'ambiente', ambiente ?? undefined)}
            hrefOferta={hrefDaOferta(produto.id, { pagina: 'projeto', projetoId })}
            imageSizes={SIZES_DO_CARD}
          />
        ))}
      </Carousel>

      <p className="mt-6 text-sm text-fg-muted">{AVISO_DE_AFILIADO}</p>
    </Section>
  )
}
