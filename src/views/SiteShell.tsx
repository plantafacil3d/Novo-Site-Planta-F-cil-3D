import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/navigation/SkipLink'
import { BotaoConta } from '@/features/conta'
import {
  navegacaoPrincipal,
  navegacaoRodape,
  redesSociais,
  siteConfig,
  textoDireitosAutorais,
} from '@/features/site'

/** Estrutura comum de todas as páginas: skip link, cabeçalho, conteúdo e rodapé. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink href="#conteudo">Pular para o conteúdo</SkipLink>
      <Header
        nome={siteConfig.nome}
        tagline={siteConfig.tagline}
        items={navegacaoPrincipal}
        conta={(variante, className) => <BotaoConta variante={variante} className={className} />}
      />
      <main id="conteudo">{children}</main>
      <Footer
        nome={siteConfig.nome}
        tagline={siteConfig.tagline}
        links={navegacaoRodape}
        redes={redesSociais}
        direitosAutorais={textoDireitosAutorais()}
        localizacao={siteConfig.localizacao}
      />
    </>
  )
}
