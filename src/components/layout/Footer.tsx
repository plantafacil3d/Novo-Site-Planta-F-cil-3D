import Link from 'next/link'

import type { NavItem } from '../navigation/MainNav'
import { Logo } from '../shared/Logo'
import { Icon, type IconName } from '../ui/Icon'

type SocialLink = { label: string; href: string; icone: IconName }

type FooterProps = {
  nome: string
  tagline?: string
  links: NavItem[]
  redes: readonly SocialLink[]
  direitosAutorais: string
  localizacao: string
}

export function Footer({
  nome,
  tagline,
  links,
  redes,
  direitosAutorais,
  localizacao,
}: FooterProps) {
  return (
    <footer className="border-t border-border bg-page text-fg">
      <div className="mx-auto max-w-content px-4 py-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Logo nome={nome} tagline={tagline} tone="default" />

          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-fg-muted transition-colors duration-150 ease-standard hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-1">
            {redes.map((rede) => (
              <li key={rede.label}>
                <a
                  href={rede.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={rede.label}
                  className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors duration-150 ease-standard hover:bg-subtle"
                >
                  <Icon name={rede.icone} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-border pt-6 text-xs text-fg-muted sm:flex-row sm:justify-between">
          <p>{direitosAutorais}</p>
          <p>{localizacao}</p>
        </div>
      </div>
    </footer>
  )
}
