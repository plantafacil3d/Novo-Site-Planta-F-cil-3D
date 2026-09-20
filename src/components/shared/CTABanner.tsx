import Image from 'next/image'
import { useId } from 'react'

import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Icon } from '../ui/Icon'

type BannerAction = {
  label: string
  href: string
  variant?: 'primary' | 'secondary-inverse' | 'whatsapp'
}

type InverseBannerProps = {
  variant: 'inverse'
  eyebrow: string
  title: string
  description: string
  image: { src: string; alt: string }
  action: BannerAction
}

type BrandBannerProps = {
  variant: 'brand'
  title: string
  description: string
  action: BannerAction
}

type CTABannerProps = InverseBannerProps | BrandBannerProps

/**
 * Faixa de chamada para ação.
 * `inverse`: imagem à esquerda e painel escuro à direita. `brand`: faixa sem imagem com ícone de casa.
 */
export function CTABanner(props: CTABannerProps) {
  const headingId = useId()
  const { title, description, action } = props

  if (props.variant === 'brand') {
    return (
      <section aria-labelledby={headingId} className="bg-inverse text-fg-inverse">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Icon name="house" className="size-12 text-accent" strokeWidth={1.5} />
            <div>
              <h2 id={headingId} className="text-xl">
                {title}
              </h2>
              <p className="text-fg-inverse/80">{description}</p>
            </div>
          </div>
          <Button href={action.href} variant={action.variant ?? 'whatsapp'} size="lg">
            {action.label}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby={headingId} className="grid bg-inverse text-fg-inverse md:grid-cols-2">
      <div className="relative min-h-56 md:min-h-72">
        <Image
          src={props.image.src}
          alt={props.image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-start justify-center gap-4 px-4 py-10 md:px-12">
        <Eyebrow>{props.eyebrow}</Eyebrow>
        <h2 id={headingId} className="text-2xl md:text-3xl">
          {title}
        </h2>
        <p className="max-w-md text-fg-inverse/80">{description}</p>
        <Button href={action.href} variant={action.variant ?? 'primary'} iconRight="arrow-right">
          {action.label}
        </Button>
      </div>
    </section>
  )
}
