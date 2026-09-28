import { Button } from '@/components/ui/Button'
import { CheckList } from '@/components/shared/CheckList'
import { Icon } from '@/components/ui/Icon'

import { linkDeCompra, precoDoCurso } from '../data'

export function CoursePricingSection() {
  return (
    <section className="bg-[var(--course-bg)] py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg bg-[var(--course-card-bg)] p-8 text-center text-fg">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-md bg-[var(--course-accent-deep)]">
            <Icon name="box" className="size-6 text-[var(--course-accent)]" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold uppercase">
            {precoDoCurso.badgeTitle}
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            Não perca a chance de se tornar indispensável no mercado 3D para Archviz.
          </p>

          <div className="mt-6 text-left">
            <CheckList
              items={precoDoCurso.checklist}
              markerClassName="bg-[var(--course-accent)] text-fg"
            />
          </div>

          <div className="mt-8">
            <p className="font-semibold text-accent">De {precoDoCurso.original} por apenas</p>
            <p className="font-heading text-4xl font-bold">{precoDoCurso.atual}</p>
          </div>

          <Button href={linkDeCompra} variant="accent" size="lg" className="mt-4 w-full">
            {precoDoCurso.ctaLabel}
          </Button>

          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold">
            <Icon
              name="clock"
              className="size-4 text-[var(--course-accent-strong)]"
              strokeWidth={1.5}
            />
            {precoDoCurso.acessoLabel}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-4 rounded-lg bg-[var(--course-bg-elevated)] p-4 text-[var(--course-fg)] sm:grid-cols-4">
            {precoDoCurso.selos.map((selo) => (
              <li key={selo.label} className="flex flex-col items-center gap-2 text-center text-xs">
                <Icon
                  name={selo.icon}
                  className="size-6 text-[var(--course-accent)]"
                  strokeWidth={1.5}
                />
                {selo.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
