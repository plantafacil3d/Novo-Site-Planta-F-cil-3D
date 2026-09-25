import Image from 'next/image'

import { FeatureItem } from '@/components/shared/FeatureItem'
import { SearchBar } from '@/components/shared/SearchBar'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Icon } from '@/components/ui/Icon'
import { selosDeConfianca } from '@/features/site'

const imagemHero = {
  src: '/images/home/imagem_01.png',
  alt: 'Casa moderna de dois pavimentos com vidros e madeira, iluminada ao entardecer',
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-inverse-strong text-fg-inverse">
      <Image
        src={imagemHero.src}
        alt={imagemHero.alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-right"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-inverse-strong/80 md:bg-transparent md:bg-linear-to-r md:from-inverse-strong md:via-inverse-strong/70 md:to-transparent"
      />

      <div className="mx-auto flex max-w-content flex-col justify-center px-4 py-12 md:min-h-120 md:py-16">
        <div className="flex max-w-2xl flex-col gap-6">
          <Eyebrow>Projetos arquitetônicos prontos</Eyebrow>
          <h1 className="max-w-xl text-3xl md:text-4xl">
            Encontre o projeto ideal para o <span className="text-accent">seu sonho</span>
          </h1>
          <p className="max-w-md text-fg-inverse/90">
            Plantas baixas, fachadas, imagens 3D e tudo o que você precisa para construir ou
            investir com segurança.
          </p>

          <SearchBar
            action="/projetos"
            label="Buscar projetos"
            placeholder="Busque por tipo de projeto, metragem ou número de quartos..."
          />

          <ul className="grid gap-4 sm:grid-cols-3">
            {selosDeConfianca.map((selo) => (
              <li key={selo.title}>
                <FeatureItem tone="inverse" {...selo} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 hidden max-w-64 items-center gap-3 bg-accent p-5 text-fg md:flex">
        <Icon name="house" className="size-10" strokeWidth={1.5} />
        <p className="text-sm font-medium">
          Projetos prontos, com qualidade profissional e preço acessível.
        </p>
      </div>
    </section>
  )
}
