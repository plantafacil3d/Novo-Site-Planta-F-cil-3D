import { cn } from '../ui/cn'
import { Icon, type IconName } from '../ui/Icon'

type FeatureItemProps = {
  icon: IconName
  title: string
  description: string
  /** `inverse` para fundos escuros (hero). */
  tone?: 'default' | 'inverse'
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
