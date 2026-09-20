import { Icon } from '../ui/Icon'

/** Lista com marcador de check. O verde vivo é só o preenchimento do círculo; o check é preto. */
export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3">
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
