import { Icon } from '@/components/ui/Icon'

import { badgesConfianca } from '../data'

/**
 * Faixa com os selos de confiança do curso. Não reaproveita `FeatureItem`: o ícone dele só sai nas
 * cores globais (`accent`/`primary`), e aqui precisa do azul do tema local (ver `theme.css`).
 */
export function BenefitBadgesStrip() {
  return (
    <ul className="grid gap-6 bg-[var(--course-bg-elevated)] px-4 py-10 text-[var(--course-fg)] sm:grid-cols-2 lg:grid-cols-4">
      {badgesConfianca.map((badge) => (
        <li key={badge.title} className="mx-auto flex max-w-xs items-start gap-3">
          <Icon
            name={badge.icon}
            className="size-7 shrink-0 text-[var(--course-accent)]"
            strokeWidth={1.5}
          />
          <div>
            <p className="font-body text-sm font-semibold">{badge.title}</p>
            <p className="text-sm text-[var(--course-fg-muted)]">{badge.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
