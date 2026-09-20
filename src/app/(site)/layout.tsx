import type { ReactNode } from 'react'

import { SiteShell } from '@/views/SiteShell'

/** Páginas públicas: cabeçalho e rodapé do site. O painel do administrador tem layout próprio. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>
}
