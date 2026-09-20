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
    <footer className="bg-inverse-strong text-fg-inverse">
      <div className="mx-auto max-w-content px-4 py-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Logo nome={nome} tagline={tagline} />

          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-fg-inverse/80 transition-colors duration-150 ease-standard hover:text-fg-inverse"
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
                  className="inline-flex size-11 items-center justify-center rounded-md text-fg-inverse transition-colors duration-150 ease-standard hover:bg-fg-inverse/10"
                >
                  <Icon name={rede.icone} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-fg-inverse/10 pt-6 text-xs text-fg-inverse/70 sm:flex-row sm:justify-between">
          <p>{direitosAutorais}</p>
          <p>{localizacao}</p>
        </div>
      </div>
    </footer>
  )
}
