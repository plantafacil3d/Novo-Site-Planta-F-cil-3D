'use client'

import Image from 'next/image'
import { useState, type TouchEvent } from 'react'

import { Section } from '@/components/layout/Section'
import { Tabs } from '@/components/navigation/Tabs'
import { VisualizadorPlantaFullscreen } from '@/components/shared/VisualizadorPlantaFullscreen'
import { cn } from '@/components/ui/cn'
import { IconButton } from '@/components/ui/IconButton'

import type { ItemInformacaoPavimento, PavimentoPublico } from '../types'

/** Arraste horizontal mínimo (px), no celular, para trocar de pavimento. */
const LIMIAR_DE_SWIPE = 50

const formatarMetragem = (metragemM2: number) =>
  `${metragemM2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`

/** Uma linha do painel de informações: o estilo depende do que foi preenchido (ver skill design-system). */
function LinhaDeInformacao({ item }: { item: ItemInformacaoPavimento }) {
  const comBolinha = item.numeroBolinha !== null
  const comMetragem = item.metragemM2 !== null

  if (!comBolinha && !comMetragem) {
    return <p className="mt-4 font-bold first:mt-0">{item.nome}</p>
  }

  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className={comBolinha ? 'font-bold underline' : 'font-bold'}>
        {comBolinha ? `${item.numeroBolinha}.${item.nome}:` : `${item.nome}:`}
      </span>
      {item.metragemM2 !== null && (
        <span className="font-normal text-fg-muted">{formatarMetragem(item.metragemM2)}</span>
      )}
    </div>
  )
}

type PainelDoPavimentoProps = {
  pavimento: PavimentoPublico
  indice: number
  total: number
  /** Reserva a coluna do painel em todos os pavimentos quando pelo menos um deles tem informações,
   *  para a imagem não mudar de tamanho ao trocar de pavimento. */
  reservarPainel: boolean
  aoIr: (indice: number) => void
  aoAmpliar: () => void
}

function PainelDoPavimento({
  pavimento,
  indice,
  total,
  reservarPainel,
  aoIr,
  aoAmpliar,
}: PainelDoPavimentoProps) {
  const [inicioDoToque, setInicioDoToque] = useState<number | null>(null)

  function aoTocarInicio(evento: TouchEvent) {
    const toque = evento.touches[0]
    if (toque) setInicioDoToque(toque.clientX)
  }

  function aoTocarFim(evento: TouchEvent) {
    const toque = evento.changedTouches[0]
    if (inicioDoToque === null || !toque) return
    const deltaX = toque.clientX - inicioDoToque
    setInicioDoToque(null)
    if (Math.abs(deltaX) < LIMIAR_DE_SWIPE) return
    aoIr(indice + (deltaX < 0 ? 1 : -1))
  }

  return (
    <div className={cn('grid gap-6', reservarPainel && 'lg:grid-cols-[1fr_20rem]')}>
      <div>
        <div
          className="relative aspect-4/3 overflow-hidden rounded-lg bg-subtle"
          onTouchStart={aoTocarInicio}
          onTouchEnd={aoTocarFim}
        >
          <Image
            src={pavimento.imagem.src}
            alt={pavimento.imagem.alt}
            fill
            unoptimized
            className="object-contain"
          />
          <button
            type="button"
            aria-label={`Ampliar a planta: ${pavimento.nome}`}
            onClick={aoAmpliar}
            className="absolute inset-0 lg:hidden"
          />

          {total > 1 && (
            <>
              <IconButton
                icon="chevron-left"
                label="Pavimento anterior"
                onClick={() => aoIr(indice - 1)}
                className="absolute top-1/2 left-2 -translate-y-1/2"
              />
              <IconButton
                icon="chevron-right"
                label="Próximo pavimento"
                onClick={() => aoIr(indice + 1)}
                className="absolute top-1/2 right-2 -translate-y-1/2"
              />
            </>
          )}
        </div>
        {total > 1 && (
          <p aria-live="polite" className="mt-2 text-center text-sm text-fg-muted">
            {indice + 1} / {total}
          </p>
        )}
      </div>

      {reservarPainel && pavimento.itens.length > 0 && (
        <div>
          {pavimento.itens.map((item) => (
            <LinhaDeInformacao key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Galeria da planta humanizada: a imagem de um pavimento de um lado, as informações do outro.
 * Com 1 pavimento só, sem abas nem setas. Com 2+, abas no topo (reaproveita `Tabs`, que já cuida
 * do teclado) + setas sobre a imagem, sincronizadas com a aba ativa.
 */
export function GaleriaPlantaHumanizada({ pavimentos }: { pavimentos: PavimentoPublico[] }) {
  const [indiceAtivo, setIndiceAtivo] = useState(0)
  const [indiceEmTelaCheia, setIndiceEmTelaCheia] = useState<number | null>(null)
  const total = pavimentos.length

  if (total === 0) return null

  const reservarPainel = pavimentos.some((pavimento) => pavimento.itens.length > 0)

  function irPara(indice: number) {
    setIndiceAtivo(((indice % total) + total) % total)
  }

  const paineis = pavimentos.map((pavimento, indice) => (
    <PainelDoPavimento
      key={pavimento.id}
      pavimento={pavimento}
      indice={indice}
      total={total}
      reservarPainel={reservarPainel}
      aoIr={irPara}
      aoAmpliar={() => setIndiceEmTelaCheia(indice)}
    />
  ))

  return (
    <Section title="Planta humanizada" subtitle="Veja a distribuição de cada pavimento do projeto.">
      {total === 1 ? (
        paineis[0]
      ) : (
        <Tabs
          label="Pavimentos do projeto"
          items={pavimentos.map((pavimento, indice) => ({
            id: pavimento.id,
            label: pavimento.nome,
            content: paineis[indice],
          }))}
          value={pavimentos[indiceAtivo]?.id}
          onValueChange={(id) => {
            const indice = pavimentos.findIndex((pavimento) => pavimento.id === id)
            if (indice !== -1) setIndiceAtivo(indice)
          }}
        />
      )}

      <VisualizadorPlantaFullscreen
        images={pavimentos.map((pavimento) => pavimento.imagem)}
        index={indiceEmTelaCheia}
        onIndexChange={(indice) => {
          setIndiceEmTelaCheia(indice)
          setIndiceAtivo(indice)
        }}
        onClose={() => setIndiceEmTelaCheia(null)}
        label="Planta humanizada em tela cheia"
      />
    </Section>
  )
}
