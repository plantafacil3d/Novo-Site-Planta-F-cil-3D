import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Área privada: fora do Google. As páginas leem cookies, então nunca vão para cache compartilhado.
export const metadata: Metadata = {
  title: { default: 'Painel do administrador', template: '%s | Painel' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children
}
