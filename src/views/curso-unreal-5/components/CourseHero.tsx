import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

import { softwaresCompativeis } from '../data'

const videoDeApresentacao = 'https://www.youtube.com/watch?v=AhjhjsUPkVU&t=19s'

/**
 * Endereço de embed "limpo": domínio `youtube-nocookie.com` (menos rastreamento), sem marca
 * d'água grande (`modestbranding`), sem vídeos sugeridos de outros canais ao pausar (`rel=0`) e
 * sem anotações (`iv_load_policy=3`). Início no mesmo ponto do link original (`&t=19s`).
 */
function embedLimpo(url: string): string {
  const alvo = new URL(url)
  const id = alvo.searchParams.get('v') ?? alvo.pathname.split('/').pop()
  const inicioEmSegundos = alvo.searchParams.get('t')?.replace(/\D/g, '')

  const parametros = new URLSearchParams({
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    playsinline: '1',
  })
  if (inicioEmSegundos) parametros.set('start', inicioEmSegundos)

  return `https://www.youtube-nocookie.com/embed/${id}?${parametros}`
}

/** Topo da landing: headline e CTA à esquerda, vídeo de apresentação em destaque à direita. */
export function CourseHero() {
  return (
    <section className="bg-[var(--course-bg)] text-[var(--course-fg)]">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--course-accent)] uppercase">
            Curso Unreal Engine 5.6
          </p>
          <h1 className="text-3xl md:text-4xl">
            Domine a Unreal Engine 5.6 e leve suas visualizações ao extraordinário
          </h1>
          <p className="max-w-md text-lg text-[var(--course-fg-muted)]">
            O mercado já mudou. A pergunta é: você vai mudar junto ou ficar pra trás?
          </p>
          <Button
            href="#matricula"
            size="lg"
            iconRight="arrow-right"
            className="text-white bg-[var(--course-accent)] hover:bg-[var(--course-accent-hover)]"
          >
            Garantir minha vaga agora
          </Button>

          <div className="mt-2 w-full">
            <p className="text-center text-sm text-[var(--course-fg-muted)] lg:text-left">
              Compatível com
            </p>
            {/* Nomes por extenso para quem usa leitor de tela; a faixa animada abaixo é decorativa. */}
            <p className="sr-only">
              {softwaresCompativeis.map((software) => software.nome).join(', ')}
            </p>
            <div aria-hidden="true" className="curso-marquee-mascara mt-4 overflow-hidden">
              <div className="curso-marquee-trilho flex w-max items-center gap-10">
                {[...softwaresCompativeis, ...softwaresCompativeis].map((software, indice) => (
                  <span
                    key={`${software.nome}-${indice}`}
                    className="flex shrink-0 items-center gap-3"
                  >
                    {software.icon && (
                      <Icon
                        name={software.icon}
                        className="size-10 text-[var(--course-fg-muted)]"
                      />
                    )}
                    <span className="text-lg font-semibold text-[var(--course-fg)]">
                      {software.nome}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*
          Vídeo vertical (formato Shorts/Reels): limitado pela ALTURA da tela (`h-[...]`), não pela
          largura da coluna — numa proporção 9:16, limitar só a largura deixava a altura disparar e
          cortava em telas de notebook mais baixas. A largura sai sozinha do `aspect-9/16`.
        */}
        <div className="relative mx-auto aspect-9/16 h-[min(80vh,640px)] justify-self-center overflow-hidden rounded-xl border border-[var(--course-border)] shadow-[0_0_60px_-20px_var(--course-accent)] lg:justify-self-end">
          <iframe
            src={embedLimpo(videoDeApresentacao)}
            title="Vídeo de apresentação do curso Unreal Engine 5.6"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    </section>
  )
}
