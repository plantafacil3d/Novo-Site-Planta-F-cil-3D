import Image from 'next/image'

import { Button } from '@/components/ui/Button'

import { areaDeMembros, linkDeCompra } from '../data'

export function MembersAreaSection() {
  return (
    <section className="bg-page py-12 text-fg md:py-16">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-heading text-2xl font-bold md:text-3xl">{areaDeMembros.title}</h2>
          <p className="mt-4 text-fg-muted">{areaDeMembros.description}</p>
          <div className="mt-6 flex justify-center md:justify-start">
            <Button
              href={linkDeCompra}
              size="lg"
              className="bg-[var(--course-accent-deep)] text-[var(--white)] hover:bg-[var(--course-accent-strong)]"
            >
              {areaDeMembros.ctaLabel}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[3/2]">
          <Image
            src={areaDeMembros.mockupImage}
            alt="Área de membros do curso em notebook e celular"
            fill
            sizes="(min-width: 768px) 780px, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}
