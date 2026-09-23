import type { ReactNode } from 'react'

import { SidebarNav, type SidebarItem } from '@/components/navigation/SidebarNav'
import { SkipLink } from '@/components/navigation/SkipLink'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { sairDoPainel } from '@/features/admin'
import { siteConfig } from '@/features/site'

// Os outros itens (sem Projetos e Biblioteca) aparecem como estáticos ("Em breve").
const itensDoMenu: SidebarItem[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Projetos', icon: 'folder', href: '/admin/projetos' },
  { label: 'Biblioteca', icon: 'layers', href: '/admin/biblioteca' },
  { label: 'Vendas', icon: 'cart' },
  { label: 'Analytics', icon: 'chart' },
]

/** Estrutura do painel do administrador: menu lateral (faixa no celular) e conteúdo ao lado. */
export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-subtle lg:grid lg:grid-cols-[16rem_1fr]">
      <SkipLink href="#conteudo">Pular para o conteúdo</SkipLink>

      <aside className="flex flex-col gap-4 bg-inverse p-4 text-fg-inverse lg:sticky lg:top-0 lg:h-screen lg:gap-8 lg:p-6">
        <Logo nome={siteConfig.nome} tagline="Painel do administrador" />
        <SidebarNav items={itensDoMenu} label="Painel do administrador" />

        <div className="flex flex-col gap-3 border-t border-fg-inverse/20 pt-4 lg:mt-auto">
          <p className="text-sm break-all text-fg-inverse/80">{email}</p>
          <form action={sairDoPainel}>
            <Button type="submit" variant="secondary-inverse" iconLeft="log-out" className="w-full">
              Sair
            </Button>
          </form>
        </div>
      </aside>

      <main id="conteudo" className="min-w-0 p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}
