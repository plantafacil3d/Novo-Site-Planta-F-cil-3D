import { Icon } from '@/components/ui/Icon'

import { modulosDoCurso } from '../data'

/**
 * Currículo completo: 19 módulos, em cartões escuros distribuídos em colunas CSS (até 3, mesma
 * técnica do mosaico de fotos em `ProjectsMosaicSection`), cada um com sanfona própria
 * (`<details>`/`<summary>` nativos, sem JS) para os tópicos. `columns` (não `grid`) porque a
 * leitura precisa descer a coluna (01 a ~07, depois 08 no topo da próxima) e não andar pela linha
 * — como na referência visual do usuário (página de vendas original), que também traz os brilhos
 * decorativos abaixo. Não reaproveita o `Accordion` global (lista vertical, cartões claros); monta
 * a marcação à mão, mesma exceção de cor/fundo já usada no `CourseHero`/`CoursePricingSection`/
 * `BenefitBadgesStrip`.
 */
export function CourseCurriculum() {
  return (
    <section className="relative overflow-hidden bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[var(--course-glow-purple)] opacity-30 blur-3xl md:size-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-[var(--course-glow-magenta)] opacity-30 blur-3xl md:size-96"
      />

      <div className="relative mx-auto max-w-content px-4">
        <div>
          <h2 className="text-2xl md:text-3xl">+60 horas de conteúdo, dinâmico e prático</h2>
          <p className="mt-1 text-[var(--course-fg-muted)]">
            19 módulos completos, do primeiro contato com a Unreal Engine até projetos com
            Blueprints e IA.
          </p>
        </div>

        <ul className="mt-8 columns-1 gap-3 sm:columns-2 lg:columns-3">
          {modulosDoCurso.map((modulo) => {
            const [numero, ...resto] = modulo.titulo.split('. ')

            return (
              <li key={modulo.titulo} className="mb-3 break-inside-avoid">
                <details className="group rounded-md border border-[var(--course-border)] bg-[var(--course-surface)]">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 py-3 text-sm font-medium transition-colors duration-150 ease-standard hover:bg-[var(--course-accent-soft)] [&::-webkit-details-marker]:hidden">
                    <span>
                      <strong>{numero}.</strong> {resto.join('. ')}
                    </span>
                    <Icon name="plus" className="size-4 shrink-0 group-open:hidden" />
                    <Icon name="minus" className="hidden size-4 shrink-0 group-open:block" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-[var(--course-fg-muted)]">
                    <ul className="flex flex-col gap-1">
                      {modulo.topicos.map((topico) => (
                        <li key={topico}>• {topico}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
