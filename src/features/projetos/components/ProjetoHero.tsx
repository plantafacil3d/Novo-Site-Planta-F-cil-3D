import { useId } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'
import { Icon, type IconName } from '@/components/ui/Icon'
import { FavoriteButton } from '@/components/shared/FavoriteButton'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { MediaGallery } from '@/components/shared/MediaGallery'
import { PriceTag } from '@/components/shared/PriceTag'
import { TextoExpansivel } from '@/components/shared/TextoExpansivel'
import { selosDeConfianca } from '@/features/site'

import { descreverProjeto, type PrecoExibido } from '../rules'
import type { ProjetoDetalhe } from '../types'

type ProjetoHeroProps = {
  projeto: ProjetoDetalhe
  preco: PrecoExibido
  /** Checkout já validado (`checkoutSeguro`); `null` = compra indisponível. */
  checkoutUrl: string | null
}

/** Topo da página: galeria à esquerda, dados e compra à direita. */
export function ProjetoHero({ projeto, preco, checkoutUrl }: ProjetoHeroProps) {
  const headingId = useId()
  const resumo = descreverProjeto(projeto)
  const specs: { icon: IconName; label: string }[] = [
    { icon: 'ruler', label: resumo.terreno },
    { icon: 'bed-double', label: resumo.quartos },
    { icon: 'bath', label: resumo.banheiros },
    { icon: 'car', label: resumo.vagas },
  ]

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-content px-4 py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <MediaGallery
            images={projeto.galeria.map((item) => item.imagem)}
            video={projeto.video}
            label={`Fotos do ${projeto.titulo}`}
          />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4">
          {projeto.selo && (
            <Badge variant="accent" className="self-start">
              {projeto.selo}
            </Badge>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {projeto.codigoYoutube && (
              <p className="text-sm font-medium text-fg-muted">Cód. {projeto.codigoYoutube}</p>
            )}
            {projeto.perfil.categoria && <Badge variant="neutral">{projeto.perfil.categoria}</Badge>}
            {projeto.perfil.estilo && <Badge variant="neutral">{projeto.perfil.estilo}</Badge>}
          </div>
          <h1 id={headingId} className="text-3xl">
            {projeto.titulo}
          </h1>
          <TextoExpansivel texto={projeto.resumo} limite={140} className="text-fg-muted" />

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {specs.map((spec) => (
              <li key={spec.label} className="flex items-center gap-2">
                <Icon name={spec.icon} className="size-5 text-primary" />
                {spec.label}
              </li>
            ))}
          </ul>

          <div>
            <PriceTag
              price={preco.atual}
              originalPrice={preco.original}
              discountLabel={preco.desconto}
              priceClassName="text-3xl"
            />
            {preco.desconto && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-danger-solid">
                <Icon name="clock" className="size-4" />
                Promoção por tempo limitado!
              </p>
            )}
            <p className="text-sm text-fg-muted">Pagamento facilitado • Acesso imediato</p>
          </div>

          <div className="flex flex-col gap-3">
            {checkoutUrl ? (
              <Button href={checkoutUrl} size="lg" iconLeft="cart" className="w-full">
                Comprar projeto
              </Button>
            ) : (
              <Button size="lg" iconLeft="cart" disabled className="w-full">
                Compra indisponível no momento
              </Button>
            )}
            <FavoriteButton variant="button" label="Adicionar aos favoritos" />
          </div>
        </div>

        <ul
          className={cn(
            'grid gap-3 border-t border-border sm:grid-cols-3',
            'lg:col-start-2',
            'xl:col-span-2 xl:col-start-11 xl:grid-cols-1 xl:content-start xl:rounded-lg xl:border-0 xl:bg-tint xl:p-5',
          )}
        >
          {selosDeConfianca.map((selo) => (
            <li key={selo.title}>
              <FeatureItem layout="stack" className="max-sm:flex-row max-sm:gap-3" {...selo} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
