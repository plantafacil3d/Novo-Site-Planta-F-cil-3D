'use client'

import { useId, useState } from 'react'

import { cn } from './cn'

/**
 * Base do polegar: dois inputs `range` sobrepostos. O input inteiro (a trilha invisível de ponta
 * a ponta) não recebe clique — só o polegar (pseudo-elemento) — senão clicar em qualquer ponto da
 * trilha "rouba" o gesto de quem está tentando arrastar o outro polegar.
 */
const polegar = cn(
  'pointer-events-none',
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md',
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md',
  '[&::-moz-range-track]:appearance-none [&::-webkit-slider-runnable-track]:appearance-none',
  'focus-visible:outline-none focus-visible:[&::-moz-range-thumb]:ring-2 focus-visible:[&::-moz-range-thumb]:ring-ring focus-visible:[&::-moz-range-thumb]:ring-offset-2 focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-ring focus-visible:[&::-webkit-slider-thumb]:ring-offset-2',
)

const numero = new Intl.NumberFormat('pt-BR')

type RangeSliderProps = {
  /** Rótulo do grupo (ex.: "Faixa de preço"); cada polegar ganha um `aria-label` derivado dele. */
  legenda: string
  nomeMin: string
  nomeMax: string
  min: number
  max: number
  valorMin?: number
  valorMax?: number
  step?: number
  /**
   * Texto antes/depois do número no rótulo acima da trilha (ex.: `prefixo="R$ "` → "R$ 300").
   * Só texto, nunca função: o componente é de apresentação e cruza a fronteira Server → Client
   * Component (funções não passam por essa fronteira).
   */
  prefixo?: string
  sufixo?: string
}

/**
 * Faixa "De/Até" arrastável: dois polegares numa mesma trilha, cada um enviando seu valor como
 * campo do formulário (`nomeMin`/`nomeMax`), sem JS no envio — é um `<input type="range">` normal
 * por baixo, então funciona com teclado (setas) e leitor de tela.
 */
export function RangeSlider({
  legenda,
  nomeMin,
  nomeMax,
  min,
  max,
  valorMin,
  valorMax,
  step = 1,
  prefixo = '',
  sufixo = '',
}: RangeSliderProps) {
  const idBase = useId()
  const [valMin, setValMin] = useState(valorMin ?? min)
  const [valMax, setValMax] = useState(valorMax ?? max)
  const amplitude = Math.max(max - min, step)
  const pctMin = ((valMin - min) / amplitude) * 100
  const pctMax = ((valMax - min) / amplitude) * 100
  const formatar = (valor: number) => `${prefixo}${numero.format(valor)}${sufixo}`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span id={`${idBase}-legenda`} className="text-sm font-medium">
          {legenda}
        </span>
        <span className="text-sm text-fg-muted">
          {formatar(valMin)} – {formatar(valMax)}
        </span>
      </div>

      <div
        className="relative flex h-11 items-center"
        role="group"
        aria-labelledby={`${idBase}-legenda`}
      >
        <div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-border" />
        <div
          className="pointer-events-none absolute h-1.5 rounded-full bg-primary"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />

        <input
          type="range"
          name={nomeMin}
          aria-label={`${legenda}, valor mínimo`}
          min={min}
          max={max}
          step={step}
          value={valMin}
          onChange={(evento) => {
            const novo = Math.min(Number(evento.target.value), valMax)
            setValMin(novo)
          }}
          className={cn(
            'absolute inset-x-0 w-full appearance-none bg-transparent',
            polegar,
            // Quando os dois polegares se tocam, o que estiver "mais à frente" fica por cima,
            // pra sempre dar pra pegar os dois — sem isso, um deles fica preso embaixo do outro.
            pctMin > 50 ? 'z-20' : 'z-10',
          )}
        />
        <input
          type="range"
          name={nomeMax}
          aria-label={`${legenda}, valor máximo`}
          min={min}
          max={max}
          step={step}
          value={valMax}
          onChange={(evento) => {
            const novo = Math.max(Number(evento.target.value), valMin)
            setValMax(novo)
          }}
          className={cn(
            'absolute inset-x-0 w-full appearance-none bg-transparent',
            polegar,
            pctMin > 50 ? 'z-10' : 'z-20',
          )}
        />
      </div>
    </div>
  )
}
