'use client'

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

import { cn } from '../ui/cn'

const ESCALA_MIN = 1
const ESCALA_MAX = 4
/** Arraste horizontal mínimo (px), sem zoom, para trocar de foto. */
const LIMIAR_DE_SWIPE = 50
/** Movimento (px) a partir do qual o toque vira arraste e deixa de ser um clique. */
const LIMIAR_DE_ARRASTO = 8
/** Duração (ms) da foto deslizando para fora ou voltando ao lugar; igual a `duration-200`. */
const DURACAO_DO_SLIDE = 200
/** Cada "clique" do scroll do mouse altera o zoom por esta fração (trackpad com pinça: 10x). */
const PASSO_DE_ZOOM = 0.0015

type Ponto = { x: number; y: number }
type Vista = { escala: number; x: number; y: number }
type Gesto =
  | { tipo: 'pinca'; distancia: number; escala: number; x: number; y: number }
  | { tipo: 'um'; inicio: Ponto; escala: number; x: number; y: number; podeDeslizar: boolean }

const VISTA_INICIAL: Vista = { escala: ESCALA_MIN, x: 0, y: 0 }

const limitarEscala = (escala: number) => Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, escala))
const distanciaEntre = (a: Ponto, b: Ponto) => Math.hypot(a.x - b.x, a.y - b.y)

type AreaComZoomProps = {
  /** Conteúdo ampliável (a foto). Fica centralizado dentro do recuo. */
  children: ReactNode
  /** Sem zoom, arrastar para o lado pede a troca: `1` = próxima, `-1` = anterior. */
  aoDeslizar?: (passo: 1 | -1) => void
  /** Clique no escuro em volta do conteúdo (não conta se foi um arraste). */
  aoClicarNoFundo?: () => void
  /**
   * De que lado a foto nova entra, quando esta área nasce de uma troca: `1` (veio da próxima) entra
   * pela direita, `-1` pela esquerda. `null` = sem animação (primeira foto aberta).
   */
  entrada?: 1 | -1 | null
  /**
   * Até `lg` o conteúdo fica girado 90° (planta deitada na tela em pé do celular): o arraste e o
   * zoom pelo ponteiro acompanham o giro. A caixa girada tem largura e altura trocadas.
   */
  girarNoCelular?: boolean
  /** Recuo ao redor do conteúdo, que reserva a faixa dos botões e do contador (classes de padding). */
  recuo: string
}

/**
 * Área de visualização com zoom e arraste, para `Lightbox` e visualizador de plantas. Zoom: pinça
 * no celular e scroll do mouse (ancorado no ponteiro: o ponto sob o cursor fica fixo). Com zoom,
 * arrastar move a foto; sem zoom, arrastar para o lado troca de foto. Ocupa o espaço do pai
 * (`absolute inset-0`). Use `key` para reiniciar o zoom a cada foto.
 *
 * Efeito de slide: sem zoom, a foto acompanha o dedo; soltando depois do limiar ela desliza para
 * fora e `aoDeslizar` troca a foto (a nova entra pelo lado oposto, ver `entrada`); soltando antes,
 * volta ao lugar.
 */
export function AreaComZoom({
  children,
  aoDeslizar,
  aoClicarNoFundo,
  entrada = null,
  girarNoCelular = false,
  recuo,
}: AreaComZoomProps) {
  const quadroRef = useRef<HTMLDivElement>(null)
  // Deslocamento lateral da foto durante o slide; `animar` liga a transição (saída e volta).
  const [lateral, setLateral] = useState({ x: 0, animar: false })
  const saindo = useRef(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // A vista vive numa ref (fonte da verdade, lida pelos eventos) e num estado (só para desenhar).
  const vistaRef = useRef<Vista>(VISTA_INICIAL)
  const [vista, setVista] = useState<Vista>(VISTA_INICIAL)
  const ponteiros = useRef(new Map<number, Ponto>())
  const gesto = useRef<Gesto | null>(null)
  const arrastou = useRef(false)

  const estaGirado = () => girarNoCelular && !window.matchMedia('(min-width: 1024px)').matches

  /** Do deslocamento na tela para o eixo do conteúdo (trocado quando girado 90°). */
  const paraEixoLocal = (dx: number, dy: number): Ponto =>
    estaGirado() ? { x: dy, y: -dx } : { x: dx, y: dy }

  /** Impede de arrastar o conteúdo para fora da tela. */
  function aplicar(proxima: Vista) {
    const quadro = quadroRef.current
    let { x, y } = proxima
    if (quadro) {
      const retangulo = quadro.getBoundingClientRect()
      const girado = estaGirado()
      const largura = girado ? retangulo.height : retangulo.width
      const altura = girado ? retangulo.width : retangulo.height
      const limiteX = (largura * (proxima.escala - 1)) / (2 * proxima.escala)
      const limiteY = (altura * (proxima.escala - 1)) / (2 * proxima.escala)
      x = Math.min(limiteX, Math.max(-limiteX, x))
      y = Math.min(limiteY, Math.max(-limiteY, y))
    }
    const final = { escala: proxima.escala, x, y }
    vistaRef.current = final
    setVista(final)
  }

  // Ouvinte nativo (não passivo) para o scroll poder bloquear o zoom da página (pinça no trackpad).
  useEffect(() => {
    const quadro = quadroRef.current
    if (!quadro) return

    function aoRolar(evento: WheelEvent) {
      evento.preventDefault()
      const atual = vistaRef.current
      const passo = evento.ctrlKey ? PASSO_DE_ZOOM * 10 : PASSO_DE_ZOOM
      const nova = limitarEscala(atual.escala - evento.deltaY * passo)
      if (nova === atual.escala) return

      if (nova === ESCALA_MIN) {
        aplicar(VISTA_INICIAL)
        return
      }

      // Mantém o ponto sob o cursor fixo na tela: o zoom cresce na direção do mouse, não do centro.
      const retangulo = quadro!.getBoundingClientRect()
      const mouse = paraEixoLocal(
        evento.clientX - retangulo.left - retangulo.width / 2,
        evento.clientY - retangulo.top - retangulo.height / 2,
      )
      const fator = 1 / nova - 1 / atual.escala
      aplicar({ escala: nova, x: atual.x + mouse.x * fator, y: atual.y + mouse.y * fator })
    }

    quadro.addEventListener('wheel', aoRolar, { passive: false })
    return () => quadro.removeEventListener('wheel', aoRolar)
    // `aplicar` e `paraEixoLocal` só leem refs e `girarNoCelular`, que não muda com o tempo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  /** Foto volta ao lugar com transição (arraste curto demais ou cancelado). */
  function voltarAoLugar() {
    setLateral((atual) => (atual.x === 0 ? atual : { x: 0, animar: true }))
  }

  /** Recomeça o gesto a partir dos ponteiros que continuam na tela. */
  function recomecarGesto(podeDeslizar: boolean) {
    const pontos = [...ponteiros.current.values()]
    const atual = vistaRef.current
    const [primeiro, segundo] = pontos
    if (primeiro && segundo) {
      gesto.current = {
        tipo: 'pinca',
        distancia: distanciaEntre(primeiro, segundo),
        escala: atual.escala,
        x: atual.x,
        y: atual.y,
      }
    } else if (primeiro) {
      gesto.current = {
        tipo: 'um',
        inicio: { ...primeiro },
        escala: atual.escala,
        x: atual.x,
        y: atual.y,
        podeDeslizar,
      }
    } else {
      gesto.current = null
    }
  }

  function aoApertar(evento: PointerEvent<HTMLDivElement>) {
    // Botões (setas, fechar) cuidam do próprio clique.
    if (evento.target instanceof Element && evento.target.closest('button')) return
    if (evento.pointerType === 'mouse' && evento.button !== 0) return
    // A foto está saindo: o próximo gesto é da foto nova.
    if (saindo.current) return

    ponteiros.current.set(evento.pointerId, { x: evento.clientX, y: evento.clientY })
    if (ponteiros.current.size === 1) arrastou.current = false
    // Um segundo dedo vira pinça: a foto que estava seguindo o primeiro dedo volta ao centro.
    if (ponteiros.current.size > 1) setLateral({ x: 0, animar: false })
    recomecarGesto(ponteiros.current.size === 1)
  }

  function aoMover(evento: PointerEvent<HTMLDivElement>) {
    if (!ponteiros.current.has(evento.pointerId)) return
    ponteiros.current.set(evento.pointerId, { x: evento.clientX, y: evento.clientY })
    const atual = gesto.current
    if (!atual) return

    if (atual.tipo === 'pinca') {
      const [primeiro, segundo] = [...ponteiros.current.values()]
      if (!primeiro || !segundo || atual.distancia === 0) return
      const fator = distanciaEntre(primeiro, segundo) / atual.distancia
      arrastou.current = true
      aplicar({ escala: limitarEscala(atual.escala * fator), x: atual.x, y: atual.y })
      return
    }

    const dx = evento.clientX - atual.inicio.x
    const dy = evento.clientY - atual.inicio.y
    if (Math.hypot(dx, dy) > LIMIAR_DE_ARRASTO) arrastou.current = true

    if (atual.escala === ESCALA_MIN) {
      // Sem zoom: a foto segue o dedo para os lados, como um slide.
      if (aoDeslizar && atual.podeDeslizar) setLateral({ x: dx, animar: false })
    } else {
      const local = paraEixoLocal(dx, dy)
      aplicar({
        escala: vistaRef.current.escala,
        x: atual.x + local.x / atual.escala,
        y: atual.y + local.y / atual.escala,
      })
    }
  }

  function aoSoltar(evento: PointerEvent<HTMLDivElement>) {
    if (!ponteiros.current.has(evento.pointerId)) return
    const atual = gesto.current
    if (
      atual?.tipo === 'um' &&
      atual.podeDeslizar &&
      atual.escala === ESCALA_MIN &&
      vistaRef.current.escala === ESCALA_MIN
    ) {
      const dx = evento.clientX - atual.inicio.x
      const dy = evento.clientY - atual.inicio.y
      if (aoDeslizar && Math.abs(dx) > LIMIAR_DE_SWIPE && Math.abs(dx) > Math.abs(dy)) {
        // Desliza a foto para fora da tela e só então troca; a foto nova entra pelo outro lado.
        const passo = dx < 0 ? 1 : -1
        const largura = quadroRef.current?.clientWidth ?? window.innerWidth
        saindo.current = true
        setLateral({ x: -passo * largura, animar: true })
        temporizador.current = setTimeout(() => aoDeslizar(passo), DURACAO_DO_SLIDE)
      } else {
        voltarAoLugar()
      }
    }
    ponteiros.current.delete(evento.pointerId)
    recomecarGesto(false)
  }

  function aoCancelar(evento: PointerEvent<HTMLDivElement>) {
    ponteiros.current.delete(evento.pointerId)
    recomecarGesto(false)
    voltarAoLugar()
  }

  return (
    <div
      ref={quadroRef}
      className="absolute inset-0 touch-none overflow-hidden"
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoCancelar}
      onClick={(evento) => {
        // Só o escuro em volta conta como "fundo": clicar na foto, ou terminar um arraste, não fecha.
        if (arrastou.current || evento.target instanceof HTMLImageElement) return
        aoClicarNoFundo?.()
      }}
    >
      {/* Camada do slide: só se move na horizontal da tela, mesmo com a planta girada por dentro. */}
      <div
        className={cn(
          'absolute inset-0',
          lateral.animar && 'transition-transform duration-200 ease-standard',
          entrada === 1 && 'animate-entrar-pela-direita',
          entrada === -1 && 'animate-entrar-pela-esquerda',
        )}
        style={{ transform: `translateX(${lateral.x}px)` }}
      >
        <div
          className={
            girarNoCelular
              ? 'absolute top-1/2 left-1/2 h-[100dvw] w-[100dvh] -translate-1/2 rotate-90 lg:inset-0 lg:h-auto lg:w-auto lg:translate-none lg:rotate-0'
              : 'absolute inset-0'
          }
        >
          <div
            className={cn('absolute inset-0 flex items-center justify-center', recuo)}
            style={{
              transform: `scale(${vista.escala}) translate(${vista.x}px, ${vista.y}px)`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
