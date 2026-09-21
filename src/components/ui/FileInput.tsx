import type { ChangeEvent, ComponentProps } from 'react'

import { cn } from './cn'
import { Icon } from './Icon'

type FileInputProps = Omit<ComponentProps<'input'>, 'type' | 'onChange' | 'value' | 'children'> & {
  /** Texto principal da área (ex.: "Escolher imagens"). É também o nome acessível do campo. */
  label: string
  /** Linha de apoio abaixo do texto (ex.: "JPG, PNG ou WEBP, até 2 MB cada"). */
  hint?: string
  invalid?: boolean
  /** Recebe os arquivos escolhidos (ou soltos sobre a área). A validação é de quem usa. */
  onFiles: (arquivos: File[]) => void
}

/**
 * Área tracejada para escolher arquivos. O `<input type="file">` fica invisível por cima de tudo:
 * clicar, usar o teclado e arrastar arquivos para dentro funcionam nativamente.
 */
export function FileInput({
  label,
  hint,
  invalid,
  onFiles,
  className,
  disabled,
  ...props
}: FileInputProps) {
  function aoEscolher(evento: ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(evento.currentTarget.files ?? [])
    // Limpa a escolha: assim dá para enviar de novo o mesmo arquivo depois de removê-lo.
    evento.currentTarget.value = ''
    if (arquivos.length > 0) onFiles(arquivos)
  }

  return (
    <label
      className={cn(
        'relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-surface px-4 py-6 text-center transition-colors duration-150 ease-standard hover:bg-subtle has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:bg-surface has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2',
        invalid ? 'border-danger' : 'border-border-strong',
        className,
      )}
    >
      <Icon name="upload" className="size-6 text-fg-muted" />
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="text-sm text-fg-muted">{hint}</span>}
      <input
        type="file"
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onChange={aoEscolher}
        className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
    </label>
  )
}
