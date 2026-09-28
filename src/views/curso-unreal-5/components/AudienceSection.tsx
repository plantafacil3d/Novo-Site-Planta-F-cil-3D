import { Icon } from '@/components/ui/Icon'

import { publicoAlvo, publicoAlvoItens } from '../data'

export function AudienceSection() {
  return (
    <section className="bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-content px-4 text-center">
        <p className="text-sm font-medium text-[var(--course-eyebrow)]">{publicoAlvo.badge}</p>
        <h2 className="mt-4 font-heading text-2xl md:text-3xl">
          <strong className="font-bold">{publicoAlvo.titleStrong}</strong>
          {publicoAlvo.titleAfter}
        </h2>
        <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-4">
          <p className="font-semibold">{publicoAlvo.paragraphs[0]}</p>
          <p className="text-[var(--course-fg-muted)]">{publicoAlvo.paragraphs[1]}</p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {publicoAlvoItens.map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center gap-3 rounded-lg border border-[var(--course-border)] bg-[var(--course-bg-elevated)] p-6 transition-colors hover:border-[var(--course-accent)]"
            >
              <span className="curso-btn-brilho flex size-12 items-center justify-center rounded-xl">
                <Icon name={item.icon} className="size-6 text-white" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
