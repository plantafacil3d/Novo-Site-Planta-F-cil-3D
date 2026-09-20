import Image from 'next/image'
import { useId } from 'react'

import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { Icon } from '../ui/Icon'

type BannerAction = {
  label: string
  href: string
  variant?: 'accent' | 'secondary-inverse' | 'whatsapp'
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

type CardBannerProps = {
  variant: 'card'
  eyebrow: string
  title: string
  description: string
  image: { src: string; alt: string }
  /** Preço já formatado (ex.: "R$ 299,90") e a condição de pagamento. */
  price: { value: string; note: string }
  action: BannerAction & { iconLeft?: 'cart' }
}

type CTABannerProps = InverseBannerProps | BrandBannerProps | CardBannerProps

/**
 * Faixa de chamada para ação.
 * `inverse`: imagem à esquerda e painel escuro à direita. `brand`: faixa sem imagem com ícone de casa.
 * `card`: cartão escuro dentro da largura da página, com imagem ao fundo, preço e botão de compra.
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

  if (props.variant === 'card') {
    return (
      <section aria-labelledby={headingId} className="py-12 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="relative isolate overflow-hidden rounded-lg bg-inverse text-fg-inverse">
            <Image
              src={props.image.src}
              alt={props.image.alt}
              fill
              sizes="(min-width: 1200px) 1168px, 100vw"
              className="-z-20 object-cover object-right"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-inverse/85 md:bg-transparent md:bg-linear-to-r md:from-inverse md:via-inverse/80 md:to-transparent"
            />

            <div className="flex flex-col items-start gap-4 p-6 md:max-w-2xl md:p-10">
              <Eyebrow>{props.eyebrow}</Eyebrow>
              <h2 id={headingId} className="text-2xl md:text-3xl">
                {title}
              </h2>
              <p className="max-w-md text-fg-inverse/80">{description}</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <p className="font-heading text-2xl font-bold">{props.price.value}</p>
                  <p className="text-sm text-fg-inverse/80">{props.price.note}</p>
                </div>
                <Button
                  href={action.href}
                  variant={action.variant ?? 'accent'}
                  size="lg"
                  iconLeft={props.action.iconLeft}
                >
                  {action.label}
                </Button>
              </div>
            </div>
          </div>
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
        <Button href={action.href} variant={action.variant ?? 'accent'} iconRight="arrow-right">
          {action.label}
        </Button>
      </div>
    </section>
  )
}
