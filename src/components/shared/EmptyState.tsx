import { Button } from '../ui/Button'
import { Icon, type IconName } from '../ui/Icon'

type EmptyStateProps = {
  icon?: IconName
  title: string
  description?: string
  /** Próximo passo para o usuário (ex.: "Limpar filtros"). */
  action?: { label: string; href: string }
}

/** Lista sem resultado: diz o que aconteceu e oferece um caminho, nunca uma tela vazia. */
export function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-subtle px-6 py-12 text-center">
      <Icon name={icon} className="size-10 text-fg-muted" strokeWidth={1.5} />
      <p className="font-heading text-lg font-bold">{title}</p>
      {description && <p className="max-w-md text-fg-muted">{description}</p>}
      {action && (
        <Button href={action.href} variant="secondary" className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}
