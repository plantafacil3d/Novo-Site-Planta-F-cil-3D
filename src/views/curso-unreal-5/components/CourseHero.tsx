import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

import { heroCopy, linkDeCompra, linkVideoHero, selosDeConfiancaHero } from '../data'
import { SoftwareLogosMarquee } from './SoftwareLogosMarquee'
import { VideoEmbed } from './VideoEmbed'

export function CourseHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--course-bg)] py-12 text-[var(--course-fg)] md:py-16">
      {/* Luz magenta na direita inferior */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[var(--course-accent)] opacity-20 blur-[120px] md:-bottom-20 md:-right-20 md:h-[700px] md:w-[700px] md:opacity-15 md:blur-[150px]" />

      {/* Luz azul na esquerda superior */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--course-glow-blue)] opacity-40 blur-[100px] md:-left-20 md:-top-20 md:h-[700px] md:w-[700px] md:opacity-30 md:blur-[130px]" />

      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 md:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-6 inline-block rounded-md bg-[var(--course-bg-elevated)] px-4 py-3 text-sm text-[var(--course-fg)]">
            {heroCopy.quote}
          </p>
          <h1 className="font-heading text-3xl leading-tight font-bold md:text-4xl">
            {heroCopy.headline}
          </h1>
          <p className="mt-4 text-[var(--course-fg-muted)]">{heroCopy.description}</p>

          <p className="mt-6 text-sm font-semibold">{heroCopy.softwareLabel}</p>
          <div className="mt-4">
            <SoftwareLogosMarquee />
          </div>

          <Button
            href={linkDeCompra}
            size="lg"
            className="curso-btn-brilho mt-8 flex w-full md:w-fit"
          >
            {heroCopy.ctaLabel}
          </Button>
        </div>

        <div className="flex min-w-0 flex-col gap-8 md:flex-row">
          <ul className="flex shrink-0 flex-row flex-nowrap justify-center gap-2 md:flex-col md:justify-start md:gap-8">
            {selosDeConfiancaHero.map((selo) => (
              <li
                key={selo.label}
                className="flex w-16 flex-col items-center gap-1.5 text-center text-xs md:w-auto md:max-w-32 md:gap-2"
              >
                <Icon
                  name={selo.icon}
                  className="size-5 text-[var(--course-accent)] md:size-7"
                  strokeWidth={1.5}
                />
                {selo.label}
              </li>
            ))}
          </ul>

          <VideoEmbed
            href={linkVideoHero}
            thumbnail="/images/curso-unreal-5/hero-video-thumb.jpg"
            title="NOVO Curso de Unreal Engine 5.6"
            orientation="vertical"
            className="curso-video-brilho mx-auto w-full max-w-80 md:mx-0"
          />
        </div>
      </div>
    </section>
  )
}
