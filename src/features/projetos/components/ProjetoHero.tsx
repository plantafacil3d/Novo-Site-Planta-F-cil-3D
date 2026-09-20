import { useId } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { CheckList } from '@/components/shared/CheckList'
import { FavoriteButton } from '@/components/shared/FavoriteButton'
import { FeatureItem } from '@/components/shared/FeatureItem'
import { MediaGallery } from '@/components/shared/MediaGallery'
import { selosDeConfianca } from '@/features/site'

import { entregaveis } from '../conteudo'
import { resumirProjeto } from '../rules'
import type { ProjetoDetalhe } from '../types'

type ProjetoHeroProps = {
  projeto: ProjetoDetalhe
  /** Preço já formatado (ex.: "R$ 299,90"). */
  preco: string
  /** Checkout já validado (`checkoutSeguro`); `null` = compra indisponível. */
  checkoutUrl: string | null
}

/** Topo da página: galeria à esquerda, dados e compra no meio e resumo do que está incluso. */
export function ProjetoHero({ projeto, preco, checkoutUrl }: ProjetoHeroProps) {
  const headingId = useId()
  const resumo = resumirProjeto(projeto)
  const specs: { icon: IconName; label: string }[] = [
    { icon: 'bed-double', label: resumo.suites },
    ...(resumo.quartoExtra ? [{ icon: 'bed-single' as const, label: resumo.quartoExtra }] : []),
    { icon: 'bath', label: resumo.banheiros },
    { icon: 'car', label: resumo.vagas },
  ]

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-content px-4 py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <MediaGallery
            images={projeto.galeria.map((item) => item.imagem)}
            video={{ src: projeto.video.src }}
            label={`Fotos do ${projeto.titulo}`}
          />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-4">
          {projeto.selo && (
            <Badge variant="accent" className="self-start">
              {projeto.selo}
            </Badge>
          )}
          <h1 id={headingId} className="text-3xl">
            {projeto.titulo}
          </h1>
          <p className="font-medium">{projeto.resumo}</p>
          <p className="text-sm text-fg-muted">{projeto.descricao}</p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {specs.map((spec) => (
              <li key={spec.label} className="flex items-center gap-2">
                <Icon name={spec.icon} className="size-5 text-primary" />
                {spec.label}
              </li>
            ))}
          </ul>

          <div>
            <p className="font-heading text-3xl font-bold">{preco}</p>
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

          <ul className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3 xl:grid-cols-1">
            {selosDeConfianca.map((selo) => (
              <li key={selo.title}>
                <FeatureItem {...selo} />
              </li>
            ))}
          </ul>
        </div>

        <aside
          aria-label="O que está incluso"
          className="h-fit rounded-lg bg-tint p-6 lg:col-span-2 xl:col-span-3"
        >
          <p className="font-heading text-lg font-bold">O que está incluso</p>
          <div className="mt-4">
            <CheckList items={entregaveis.map((entregavel) => entregavel.titulo)} />
          </div>
        </aside>
      </div>
    </section>
  )
}
