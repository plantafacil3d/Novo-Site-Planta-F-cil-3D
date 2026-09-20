import type { ComponentProps } from 'react'

import { cn } from './cn'

type TableProps = ComponentProps<'table'> & {
  /** Nome da tabela para leitores de tela (não aparece na tela). */
  caption: string
}

/** Tabela de dados. Em telas estreitas rola na horizontal dentro da moldura, não a página. */
export function Table({ caption, className, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className={cn('w-full text-left text-sm', className)} {...props}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ className, ...props }: ComponentProps<'thead'>) {
  return <thead className={cn('border-b border-border bg-subtle', className)} {...props} />
}

export function TableBody(props: ComponentProps<'tbody'>) {
  return <tbody {...props} />
}

/** Linha do corpo. Com `data-selected="true"` ganha o fundo de linha selecionada. */
export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'border-b border-border last:border-b-0 data-[selected=true]:bg-tint',
        className,
      )}
      {...props}
    />
  )
}

export function TableHeaderCell({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      scope="col"
      className={cn('px-4 py-3 font-semibold whitespace-nowrap text-fg-muted', className)}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('px-4 py-2 align-middle', className)} {...props} />
}
