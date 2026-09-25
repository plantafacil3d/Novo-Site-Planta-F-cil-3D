import Image from 'next/image'
import Link from 'next/link'

import { Icon } from '../ui/Icon'

type LogoProps = {
  nome: string
  tagline?: string
  /** `inverse` (padrão) para fundos escuros; `default` para fundos claros. */
  tone?: 'inverse' | 'default'
}

/**
 * Marca do site. `default` (cabeçalho, rodapé) usa o logotipo oficial.
 * `inverse` (fundo escuro, só o painel admin) ainda é provisório: a arte oficial
 * tem texto preto, ilegível em fundo escuro — falta uma versão clara.
 */
export function Logo({ nome, tagline, tone = 'inverse' }: LogoProps) {
  const inverse = tone === 'inverse'

  if (!inverse) {
    return (
      <Link href="/" aria-label={`${nome}: página inicial`} className="inline-flex items-center">
        <Image
          src="/images/logo/Logo_03.png"
          alt={nome}
          width={2248}
          height={765}
          className="h-8 w-auto sm:hidden"
        />
        <Image
          src="/images/logo/logo_02.png"
          alt={nome}
          width={2508}
          height={528}
          className="hidden h-10 w-auto sm:block"
        />
      </Link>
    )
  }

  return (
    <Link
      href="/"
      aria-label={`${nome}: página inicial`}
      className="inline-flex items-center gap-2 text-fg-inverse"
    >
      <Icon name="house" className="size-8 text-accent sm:size-10" strokeWidth={1.5} />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-lg font-bold whitespace-nowrap sm:text-xl">{nome}</span>
        {tagline && (
          <span className="hidden text-xs text-fg-inverse/80 sm:block">{tagline}</span>
        )}
      </span>
    </Link>
  )
}
