import Link from 'next/link'

import { MainNav, type NavItem } from '../navigation/MainNav'
import { MobileMenu } from '../navigation/MobileMenu'
import { Logo } from '../shared/Logo'
import { Button } from '../ui/Button'
import { Icon, type IconName } from '../ui/Icon'

type HeaderProps = {
  nome: string
  tagline?: string
  items: NavItem[]
  cta: NavItem
  /** Quantidade no carrinho; o carrinho ainda não existe, então o padrão é 0. */
  carrinhoQuantidade?: number
}

const actionLink =
  'relative inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-150 ease-standard hover:bg-subtle'

export function Header({ nome, tagline, items, cta, carrinhoQuantidade = 0 }: HeaderProps) {
  const actions: { href: string; label: string; icon: IconName }[] = [
    { href: '/projetos', label: 'Buscar projetos', icon: 'search' },
    { href: '/favoritos', label: 'Lista de desejos', icon: 'heart' },
  ]

  return (
    <header className="relative z-40 border-b border-border bg-page text-fg">
      <div className="mx-auto flex min-h-16 max-w-content items-center gap-2 px-4 sm:gap-4 lg:gap-8">
        <Logo nome={nome} tagline={tagline} tone="default" />

        <div className="hidden lg:mx-auto lg:block">
          <MainNav items={items} />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              aria-label={action.label}
              className={actionLink}
            >
              <Icon name={action.icon} />
            </Link>
          ))}
          <Link
            href="/carrinho"
            aria-label={`Carrinho, ${carrinhoQuantidade} ${carrinhoQuantidade === 1 ? 'item' : 'itens'}`}
            className={actionLink}
          >
            <Icon name="cart" />
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-accent text-xs font-semibold text-fg"
            >
              {carrinhoQuantidade}
            </span>
          </Link>
          <Button href={cta.href} className="ml-2 hidden sm:inline-flex lg:ml-4">
            {cta.label}
          </Button>
          <MobileMenu items={items} cta={cta} />
        </div>
      </div>
    </header>
  )
}
