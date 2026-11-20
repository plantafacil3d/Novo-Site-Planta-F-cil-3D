import { cn } from '../ui/cn'
import { Icon, type IconName } from '../ui/Icon'

type FeatureItemProps = {
  icon: IconName
  title: string
  description: string
  /** `inverse` para fundos escuros (hero). `card`: cartão verde-claro com o ícone branco num quadrado
   *  verde (selos de confiança da página do projeto); ignora `layout`. */
  tone?: 'default' | 'inverse' | 'card'
  /** `row`: ícone ao lado do texto. `stack`: ícone em cima do texto (grades de características). */
  layout?: 'row' | 'stack'
  /** Use `h3` quando o item estiver dentro de uma seção com h2, para não pular nível. */
  titleAs?: 'p' | 'h3'
  className?: string
}

/** Ícone + título + descrição curta. */
export function FeatureItem({
  icon,
  title,
  description,
  tone = 'default',
  layout = 'row',
  titleAs: Title = 'p',
  className,
}: FeatureItemProps) {
  if (tone === 'card') {
    return (
      <div className={cn('flex h-full items-start gap-3 rounded-lg bg-tint p-4', className)}>
        <span className="inline-flex size-10.5 shrink-0 items-center justify-center rounded-md bg-feature-icon-bg text-fg-inverse">
          <Icon name={icon} className="size-5" />
        </span>
        <div>
          <Title className="font-body text-base leading-snug font-semibold">{title}</Title>
          <p className="text-sm leading-snug text-fg-muted">{description}</p>
        </div>
      </div>
    )
  }

  const inverse = tone === 'inverse'
  const stack = layout === 'stack'

  return (
    <div className={cn('flex items-start', stack ? 'flex-col gap-2' : 'gap-3', className)}>
      <Icon
        name={icon}
        className={cn(stack ? 'size-7' : 'size-8', inverse ? 'text-accent' : 'text-primary')}
        strokeWidth={1.5}
      />
      <div>
        <Title className="font-body text-sm font-semibold">{title}</Title>
        <p className={cn('text-sm', inverse ? 'text-fg-inverse/80' : 'text-fg-muted')}>
          {description}
        </p>
      </div>
    </div>
  )
}
