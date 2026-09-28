import type { Depoimento } from '../data'

export function TestimonialCard({ quote, name, role }: Depoimento) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-[var(--course-border)] bg-[var(--course-bg-elevated)] p-6">
      <p className="text-sm text-[var(--course-fg-muted)]">{quote}</p>
      <div className="mt-6 text-center">
        <p className="font-heading text-sm font-bold text-[var(--course-fg)]">{name}</p>
        <p className="text-xs text-[var(--course-accent)]">{role}</p>
      </div>
    </div>
  )
}
