import Image from 'next/image'

import { instrutor } from '../data'

export function InstructorBio() {
  return (
    <section className="bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      <div className="mx-auto grid max-w-content gap-8 px-4 md:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-lg bg-[var(--course-accent-strong)] p-6 text-center">
          <div className="relative mx-auto size-24 overflow-hidden rounded-full bg-[var(--course-bg-elevated)]">
            <Image
              src={instrutor.photo}
              alt={instrutor.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <p className="mt-4 font-heading text-lg font-bold">{instrutor.name}</p>
          <p className="text-sm text-[var(--white)]/80">{instrutor.role}</p>
          <p className="mt-6 inline-block rounded-md bg-[var(--course-bg-elevated)] px-3 py-2 text-xs font-semibold">
            {instrutor.badge}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--course-border)] bg-[var(--course-bg-elevated)] p-8">
          <h2 className="font-heading text-xl font-bold">{instrutor.greeting}</h2>
          <div className="mt-4 flex flex-col gap-4 text-sm text-[var(--course-fg-muted)]">
            {instrutor.paragraphs.map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
