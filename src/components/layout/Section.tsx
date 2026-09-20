import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { useId, type ReactNode } from 'react'

import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

const sectionStyles = cva('py-12 md:py-16', {
  variants: {
    tone: {
      page: 'bg-page text-fg',
      subtle: 'bg-subtle text-fg',
      tint: 'bg-tint text-fg',
      inverse: 'bg-inverse text-fg-inverse',
    },
  },
  defaultVariants: { tone: 'page' },
})

type SectionProps = VariantProps<typeof sectionStyles> & {
  title: string
  subtitle?: string
  /** Link "Ver todos" à direita do título. */
  action?: { label: string; href: string }
  children: ReactNode
}

/** Seção da página: título (h2), subtítulo, link "Ver todos" e conteúdo. */
export function Section({ tone, title, subtitle, action, children }: SectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className={sectionStyles({ tone })}>
      <div className="mx-auto max-w-content px-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h2 id={headingId} className="text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className={tone === 'inverse' ? 'mt-1 text-fg-inverse/80' : 'mt-1 text-fg-muted'}>
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <Link
              href={action.href}
              className={cn(
                'inline-flex min-h-11 items-center gap-1 text-sm font-semibold hover:underline',
                tone === 'inverse' ? 'text-accent' : 'text-primary',
              )}
            >
              {action.label}
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
