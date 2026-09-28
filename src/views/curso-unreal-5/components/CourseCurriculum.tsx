import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

import {
  curriculoIntro,
  entrarNaTurmaCta,
  linkDeCompra,
  modulosDoCurso,
  type ModuloDoCurso,
} from '../data'
import { SectionEyebrow } from './SectionEyebrow'

// Pirâmide invertida: cada parágrafo do intro do currículo fica um pouco mais estreito e
// menor que o anterior, guiando o olhar até a frase de destaque.
const paragraphIntroClasses = [
  'max-w-xl text-base md:text-lg',
  'max-w-lg text-base',
  'max-w-md text-sm md:text-base',
]

function splitInThree<T>(items: T[]): T[][] {
  const size = Math.ceil(items.length / 3)
  return [items.slice(0, size), items.slice(size, size * 2), items.slice(size * 2)]
}

function conteudoDoModulo(modulo: ModuloDoCurso) {
  if (!modulo.conteudoProgramatico) {
    return <p>Conteúdo em breve.</p>
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--course-border)] pb-2 text-xs font-semibold">
        <span className="text-[var(--course-accent)]">Conteúdo programático</span>
        {modulo.duracao && <span className="text-[var(--course-fg-muted)]">{modulo.duracao}</span>}
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {modulo.conteudoProgramatico.map((aula, index) => (
          <li key={index} className="flex items-start gap-2">
            <Icon
              name="play"
              className="mt-0.5 size-3 shrink-0 fill-current text-[var(--course-accent)]"
            />
            {aula}
          </li>
        ))}
      </ul>
    </>
  )
}

export function CourseCurriculum() {
  const colunas = splitInThree(modulosDoCurso)

  return (
    <section className="bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-content px-4">
        <SectionEyebrow>{curriculoIntro.badge}</SectionEyebrow>

        <h2 className="mx-auto mt-6 max-w-2xl text-center font-heading text-2xl font-normal md:text-3xl">
          {curriculoIntro.titleBefore}
          <strong className="font-bold">{curriculoIntro.titleStrong}</strong>
          {curriculoIntro.titleAfter}
        </h2>
        <div className="mt-4 flex flex-col items-center gap-4 text-center text-[var(--course-fg-muted)]">
          {curriculoIntro.paragraphs.map((paragrafo, index) => (
            <p key={index} className={paragraphIntroClasses[index] ?? paragraphIntroClasses.at(-1)}>
              {paragrafo}
            </p>
          ))}
          <p className="mx-auto max-w-sm text-sm font-semibold text-[var(--course-fg)] md:text-base">
            {curriculoIntro.highlight}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-4 md:grid-cols-3">
          {colunas.map((coluna, colIndex) => (
            <Accordion
              key={colIndex}
              items={coluna.map((modulo) => ({
                title: `${modulo.numero} - ${modulo.titulo}`,
                content: conteudoDoModulo(modulo),
                defaultOpen: modulo.numero === '01',
              }))}
              tone="inverse"
              icon="chevron"
              className="[&_details]:border-[var(--course-border)] [&_details]:bg-[var(--course-module-bg)]"
            />
          ))}
        </div>

        <div className="mt-12 grid items-center gap-6 rounded-lg border border-[var(--course-border)] bg-[var(--course-bg-elevated)] p-8 md:grid-cols-2">
          <div>
            <h3 className="font-heading text-xl font-normal md:text-2xl">
              {entrarNaTurmaCta.titleBefore}
              <strong className="font-bold">{entrarNaTurmaCta.titleStrong}</strong>
            </h3>
            <p className="mt-3 text-sm text-[var(--course-fg-muted)]">
              {entrarNaTurmaCta.description}
            </p>
          </div>
          <Button
            href={linkDeCompra}
            size="lg"
            className="justify-self-start bg-[var(--course-fg)] text-[var(--course-bg)] hover:bg-[var(--course-fg-muted)] md:justify-self-end"
          >
            {entrarNaTurmaCta.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
