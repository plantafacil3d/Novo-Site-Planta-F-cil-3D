import type { ReactNode } from 'react'

import { exigirAdmin } from '@/features/admin'
import { AdminShell } from '@/views/admin/AdminShell'

export default async function PainelLayout({ children }: { children: ReactNode }) {
  const usuario = await exigirAdmin()
  return <AdminShell email={usuario.email}>{children}</AdminShell>
}
