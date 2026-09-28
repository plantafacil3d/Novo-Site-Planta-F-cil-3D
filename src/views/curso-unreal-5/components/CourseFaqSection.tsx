import { Accordion } from '@/components/ui/Accordion'

import { faqBadge, faqItens, faqSubtitle, faqTitle } from '../data'
import { SectionEyebrow } from './SectionEyebrow'

export function CourseFaqSection() {
  return (
    <section className="bg-linear-to-b from-[var(--course-accent-deep)] to-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <SectionEyebrow>{faqBadge}</SectionEyebrow>
        <h2 className="mt-6 font-heading text-2xl font-bold md:text-3xl">{faqTitle}</h2>
        <p className="mt-3 text-[var(--course-fg-muted)]">{faqSubtitle}</p>

        <div className="mt-8 text-left">
          <Accordion
            items={faqItens.map((item) => ({ title: item.title, content: item.content }))}
            tone="inverse"
          />
        </div>
      </div>
    </section>
  )
}
