import type { ReactNode } from 'react'

/** Pill escuro usado acima dos títulos desta página (ex.: "Conteúdo do curso 🔥"). */
export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--course-border)] bg-[var(--course-bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--course-fg)]">
      {children}
    </span>
  )
}
