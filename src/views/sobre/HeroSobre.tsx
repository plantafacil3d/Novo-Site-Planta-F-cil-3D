import Image from 'next/image'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { Icon } from '@/components/ui/Icon'

const foto = {
  src: '/images/sobre/foto-herkullys.webp',
  alt: 'Herkullys de Sousa Silva, arquiteto e fundador da Planta Fácil 3D',
}

export function HeroSobre() {
  return (
    <section className="bg-inverse-strong text-fg-inverse">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
        <div className="flex flex-col gap-6">
          <Eyebrow>Sobre nós</Eyebrow>
          <h1 className="text-3xl md:text-4xl">
            O Planta Fácil 3D é uma <span className="text-accent">empresa de Arquitetura</span>
          </h1>
          <p className="max-w-md text-fg-inverse/90">
            Somos uma empresa digital de arquitetura fundada por Herkullys de Sousa Silva,
            arquiteto e urbanista, com sede em Caxias, Maranhão. Nosso propósito é oferecer
            projetos arquitetônicos acessíveis, funcionais e de alta qualidade, para pessoas do
            Brasil e de diversas partes do mundo.
          </p>
          <div className="flex items-center gap-2 text-sm text-fg-inverse/80">
            <Icon name="map-pin" className="size-4 text-accent" />
            Caxias - MA, Brasil
          </div>
        </div>

        <div className="group relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg transition-shadow duration-250 ease-standard group-hover:shadow-xl">
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              priority
              sizes="(min-width: 768px) 384px, 100vw"
              className="object-cover transition-transform duration-300 ease-standard group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-4 -bottom-6 flex items-center gap-3 rounded-lg bg-accent p-4 text-fg shadow-lg transition-transform duration-200 ease-standard group-hover:-translate-y-1">
            <Icon name="user" className="size-8 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold">Herkullys de Sousa Silva</p>
              <p className="text-xs">Arquiteto e Urbanista · Fundador</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
