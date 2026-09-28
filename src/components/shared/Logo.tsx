import Image from 'next/image'
import Link from 'next/link'

type LogoProps = {
  nome: string
  tagline?: string
  /** `inverse` (padrão) para fundos escuros; `default` para fundos claros. */
  tone?: 'inverse' | 'default'
}

/** Marca do site: logotipo oficial, com uma versão para cada fundo. */
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
      className="inline-flex flex-col items-start gap-1"
    >
      <Image
        src="/images/sobre/logo-fundo-escuro.png"
        alt={nome}
        width={2685}
        height={662}
        className="h-8 w-auto sm:h-10"
      />
      {tagline && <span className="hidden text-xs text-fg-inverse/80 sm:block">{tagline}</span>}
    </Link>
  )
}
