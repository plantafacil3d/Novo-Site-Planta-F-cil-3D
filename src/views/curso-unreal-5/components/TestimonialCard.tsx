import Image from 'next/image'

import { Icon } from '@/components/ui/Icon'

import type { Testimonial } from '../data'

/** Depoimento de aluno: foto, nome e texto. Não existe equivalente genérico no catálogo. */
export function TestimonialCard({ nome, texto, foto }: Testimonial) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm">
      <Icon name="quote" className="size-6 text-primary" />
      <p className="grow text-sm text-fg-muted">{texto}</p>
      <div className="flex items-center gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image src={foto.src} alt="" fill sizes="40px" className="object-cover" />
        </div>
        <p className="text-sm font-semibold">{nome}</p>
      </div>
    </article>
  )
}
