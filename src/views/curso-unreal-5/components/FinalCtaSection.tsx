import { ctaFinal } from '../data'

export function FinalCtaSection() {
  return (
    <section className="bg-[var(--course-bg)] py-12 text-center text-[var(--course-fg)] md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-heading text-2xl md:text-3xl">
          Do zero ao realismo que encanta clientes em{' '}
          <strong className="font-bold">tempo real</strong>
        </h2>
        <p className="mt-4 text-[var(--course-fg-muted)]">{ctaFinal.description}</p>
        <p className="mt-6 font-semibold">{ctaFinal.proof}</p>
      </div>
    </section>
  )
}
