import Image from 'next/image'

import { Section } from '@/components/layout/Section'
import { Carousel } from '@/components/shared/Carousel'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

import {
  descreverProjeto,
  exibirPreco,
  formatarAreaCurta,
  formatarTerrenoCurto,
  hrefProjeto,
} from '../rules'
import type { Projeto } from '../types'

/** Largura real da foto: 288px no celular (`w-72`); do `lg` em diante, 1/4 da faixa (até ~280px). */
const SIZES_DO_CARD = '(min-width: 1200px) 280px, (min-width: 1024px) 23vw, 288px'

/** Código que o cliente vê (ex.: "P18"), o mesmo dos projetos relacionados. */
function codigoDoProjeto(projeto: Projeto): string {
  return projeto.codigoYoutube ?? projeto.codigo
}

/** Card exclusivo desta seção: foto com a medida do terreno, nome curto, quartos/vagas/área e preço. */
function CardVariacao({ projeto, atual }: { projeto: Projeto; atual: boolean }) {
  const terreno = formatarTerrenoCurto(projeto.larguraM, projeto.profundidadeM)
  const titulo = `${codigoDoProjeto(projeto)} · Terreno ${terreno}`
  const texto = descreverProjeto(projeto)

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-surface',
        atual
          ? 'border-primary'
          : 'border-border shadow-sm transition-shadow duration-250 ease-standard hover:shadow-md',
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={projeto.imagem.src}
          alt={projeto.imagem.alt}
          fill
          sizes={SIZES_DO_CARD}
          quality={70}
          draggable={false}
          className={cn(
            'object-cover',
            !atual && 'transition-transform duration-250 ease-standard group-hover:scale-105',
          )}
        />
        <Badge size="md" className="absolute top-3 left-3">
          {terreno}
        </Badge>
        {atual && (
          <Badge variant="surface" className="absolute top-3 right-3">
            Você está vendo
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-body text-base font-medium">{titulo}</h3>
        <p className="mt-1.5 text-label text-fg-muted">
          {texto.quartos} · {texto.vagas} · {formatarAreaCurta(projeto.areaConstruidaM2)}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold">{exibirPreco(projeto).atual}</p>
          {atual ? (
            <p className="text-sm text-fg-muted">Projeto atual</p>
          ) : (
            <Button
              href={hrefProjeto(projeto)}
              aria-label={`Ver detalhes de ${titulo}`}
              draggable={false}
              // `sm` fica abaixo dos 44px de toque; pode porque o link estica sobre o card todo.
              size="sm"
              className="after:absolute after:inset-0"
            >
              Ver detalhes
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * "Mesmo projeto, outros terrenos": a mesma casa em outros tamanhos de lote, do menor para o maior,
 * com o projeto aberto marcado. Sem outra variação além dele, a seção não aparece.
 */
export function VariacoesDoProjeto({
  projeto,
  variacoes,
}: {
  projeto: Projeto
  /** Já ordenadas (`ordenarVariacoes`), incluindo o próprio `projeto`. */
  variacoes: Projeto[]
}) {
  if (variacoes.length < 2) return null

  return (
    <Section
      tone="subtle"
      contentSpacing="tight"
      eyebrow="Mesmo projeto, outros terrenos"
      title="Seu terreno é maior? Este projeto também está disponível em:"
      subtitle={`A mesma casa ${codigoDoProjeto(projeto)}, com implantação, recuos e área externa ajustados para cada tamanho de lote.`}
    >
      <Carousel
        label="Outros tamanhos de terreno"
        itemClassName="w-72"
        desktopColumns={4}
        dragToScroll
      >
        {variacoes.map((variacao) => (
          <CardVariacao key={variacao.id} projeto={variacao} atual={variacao.id === projeto.id} />
        ))}
      </Carousel>
    </Section>
  )
}
