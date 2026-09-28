import { Icon } from '@/components/ui/Icon'

import { cartoesDeDestaque } from '../data'

export function CourseHighlightCards() {
  return (
    <div className="relative overflow-hidden bg-[var(--course-bg)] px-4 pb-12 md:pb-16">
      {/* Continuação da luz magenta do Hero (mesma seção visual, sem borda entre elas) */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--course-accent)] opacity-20 blur-[120px] md:-top-20 md:-right-20 md:h-[700px] md:w-[700px] md:opacity-15 md:blur-[150px]" />

      <div className="relative mx-auto grid max-w-content gap-4 sm:grid-cols-2">
        {cartoesDeDestaque.map((card, index) => (
          <div
            key={card.title}
            className="rounded-lg border border-[var(--course-border)] bg-[var(--course-bg-elevated)] p-7"
          >
            <span
              className={
                index % 2 === 0
                  ? 'mb-5 inline-flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--course-accent-from)] to-[var(--course-accent-to)]'
                  : 'mb-5 inline-flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--course-badge-from)] to-[var(--course-badge-to)]'
              }
            >
              <Icon name={card.icon} className="size-6" color="white" strokeWidth={1.75} />
            </span>
            <h3 className="font-heading text-xl font-bold text-[var(--course-fg)]">{card.title}</h3>
            <p className="mt-3 text-sm text-[var(--course-fg-muted)]">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
