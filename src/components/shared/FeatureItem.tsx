import { cn } from '../ui/cn'
import { Icon, type IconName } from '../ui/Icon'

type FeatureItemProps = {
  icon: IconName
  title: string
  description: string
  /** `inverse` para fundos escuros (hero). */
  tone?: 'default' | 'inverse'
  /** Use `h3` quando o item estiver dentro de uma seção com h2, para não pular nível. */
  titleAs?: 'p' | 'h3'
  className?: string
}

/** Ícone + título + descrição curta, lado a lado. */
export function FeatureItem({
  icon,
  title,
  description,
  tone = 'default',
  titleAs: Title = 'p',
  className,
}: FeatureItemProps) {
  const inverse = tone === 'inverse'

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Icon
        name={icon}
        className={cn('size-8', inverse ? 'text-accent' : 'text-primary')}
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
