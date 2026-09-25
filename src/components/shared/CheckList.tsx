import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../ui/cn'
import { Icon } from '../ui/Icon'

const checkListStyles = cva('gap-3', {
  variants: {
    columns: {
      1: 'flex flex-col',
      2: 'grid sm:grid-cols-2',
    },
  },
  defaultVariants: { columns: 1 },
})

type CheckListProps = VariantProps<typeof checkListStyles> & {
  items: readonly string[]
  className?: string
}

/** Lista com marcador de check. O verde vivo é só o preenchimento do círculo; o check é preto. */
export function CheckList({ items, columns, className }: CheckListProps) {
  return (
    <ul className={cn(checkListStyles({ columns }), className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-fg">
            <Icon name="check" className="size-3" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
