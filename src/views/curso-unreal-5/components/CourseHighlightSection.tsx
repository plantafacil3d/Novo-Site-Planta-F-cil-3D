import { Accordion } from '@/components/ui/Accordion'

import { destaqueAccordion, destaqueMercado } from '../data'
import { UnrealEngineBadge } from './UnrealEngineBadge'

export function CourseHighlightSection() {
  return (
    <section className="bg-subtle py-12 text-fg md:py-16">
      <div className="mx-auto max-w-content px-4">
        <UnrealEngineBadge label={destaqueMercado.badge} />

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-normal md:text-3xl">
              {destaqueMercado.titleBefore}
              <strong className="font-bold">{destaqueMercado.titleStrong}</strong>
              {destaqueMercado.titleAfter}
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-fg-muted">
              {destaqueMercado.paragraphs.map((paragrafo, index) => (
                <p
                  key={index}
                  className={
                    index === destaqueMercado.paragraphs.length - 2 ? 'font-semibold' : undefined
                  }
                >
                  {paragrafo}
                </p>
              ))}
              <p className="font-semibold text-fg">{destaqueMercado.closing}</p>
            </div>
          </div>

          <Accordion
            items={destaqueAccordion.map((item, index) => ({
              title: item.title,
              content: item.content,
              defaultOpen: index === 0,
            }))}
            tone="inverse"
            icon="chevron"
            className="[&_details]:border-[var(--course-accordion-bg)] [&_details]:bg-[var(--course-accordion-bg)]"
          />
        </div>

        <div className="mt-10 max-w-sm rounded-lg bg-[var(--course-card-bg)] p-6">
          <span className="curso-btn-brilho mb-4 inline-flex size-10 items-center justify-center rounded-xl font-serif text-xl text-white italic">
            u
          </span>
          <h3 className="font-heading text-lg font-bold">{destaqueMercado.cardTitle}</h3>
          <p className="mt-2 text-sm text-fg-muted">{destaqueMercado.cardDescription}</p>
        </div>
      </div>
    </section>
  )
}
