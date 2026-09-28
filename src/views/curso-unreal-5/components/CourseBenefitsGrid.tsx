import { Icon } from '@/components/ui/Icon'

import { beneficiosDoCurso } from '../data'

export function CourseBenefitsGrid() {
  return (
    <section className="bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-content px-4 text-center">
        <p className="text-sm font-medium text-[var(--course-fg-muted)]">
          {beneficiosDoCurso.badge}
        </p>
        <h2 className="mt-4 font-heading text-2xl md:text-3xl">
          {beneficiosDoCurso.titleBefore}
          <strong className="font-bold">{beneficiosDoCurso.titleStrong}</strong>
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-content gap-x-12 gap-y-8 px-4 md:grid-cols-2">
        {beneficiosDoCurso.itens.map((item) => (
          <div key={item.title} className="flex gap-4">
            <span className="curso-btn-brilho flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name={item.icon} className="size-6 text-white" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="flex flex-wrap items-center gap-2 font-heading font-bold">
                {item.title}
                {item.flags && (
                  <span className="flex items-center gap-1">
                    {item.flags.map((flag) => (
                      <Icon key={flag} name={flag} className="size-4 rounded-xs" />
                    ))}
                  </span>
                )}
              </h3>
              <p className="mt-1 text-sm text-[var(--course-fg-muted)]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
