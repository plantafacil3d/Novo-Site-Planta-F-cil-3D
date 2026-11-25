import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { useId, type ReactNode } from 'react'

import { cn } from '../ui/cn'
import { Eyebrow } from '../ui/Eyebrow'
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

/** Distância entre o cabeçalho (título/subtítulo) e o conteúdo. */
const contentStyles = cva('', {
  variants: {
    contentSpacing: {
      default: 'mt-8',
      /** Conteúdo mais perto do subtítulo (ex.: "Mesmo projeto, outros terrenos"). */
      tight: 'mt-6',
    },
  },
  defaultVariants: { contentSpacing: 'default' },
})

type SectionProps = VariantProps<typeof sectionStyles> &
  VariantProps<typeof contentStyles> & {
    /** Rótulo curto em caixa alta acima do título (ex.: "Mesmo projeto, outros terrenos"). */
    eyebrow?: string
    title: string
    subtitle?: string
    /** Link "Ver todos" à direita do título. */
    action?: { label: string; href: string }
    children: ReactNode
  }

/** Seção da página: título (h2), subtítulo, link "Ver todos" e conteúdo. */
export function Section({
  tone,
  contentSpacing,
  eyebrow,
  title,
  subtitle,
  action,
  children,
}: SectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className={sectionStyles({ tone })}>
      <div className="mx-auto max-w-content px-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            {eyebrow && (
              <Eyebrow tone={tone === 'inverse' ? 'onDark' : 'onLight'} className="mb-1.5">
                {eyebrow}
              </Eyebrow>
            )}
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
        <div className={contentStyles({ contentSpacing })}>{children}</div>
      </div>
    </section>
  )
}
