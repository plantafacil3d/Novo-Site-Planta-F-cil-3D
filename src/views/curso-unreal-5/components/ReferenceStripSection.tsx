import Image from 'next/image'

import { imagensTira, secaoReferencia } from '../data'

export function ReferenceStripSection() {
  return (
    <section className="bg-page py-12 text-fg md:py-16">
      <div className="mx-auto max-w-content px-4 text-center">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">{secaoReferencia.title}</h2>
        <p className="mt-3 text-fg-muted">{secaoReferencia.description}</p>
      </div>

      <div className="mt-10 flex [scrollbar-width:none] gap-2 overflow-x-auto px-2 pb-2 [&::-webkit-scrollbar]:hidden">
        {imagensTira.map((src) => (
          <div
            key={src}
            className="relative h-40 w-56 shrink-0 overflow-hidden rounded-md md:h-48 md:w-72"
          >
            <Image
              src={src}
              alt="Projeto realizado pela DVIZ"
              fill
              sizes="288px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
