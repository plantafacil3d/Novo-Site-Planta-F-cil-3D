import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

type ErrorStateProps = {
  title: string
  description?: string
  /** Chamada ao clicar em "Tentar novamente". Sem ela, o botão não aparece. */
  onRetry?: () => void
}

/** Algo falhou: linguagem simples, sem detalhe técnico, e uma forma de tentar de novo. */
export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-notification-error-border bg-notification-error-bg px-6 py-12 text-center text-notification-error-fg"
    >
      <Icon name="info" className="size-10 text-notification-error-icon" strokeWidth={1.5} />
      <p className="font-heading text-lg font-bold">{title}</p>
      {description && <p className="max-w-md">{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
