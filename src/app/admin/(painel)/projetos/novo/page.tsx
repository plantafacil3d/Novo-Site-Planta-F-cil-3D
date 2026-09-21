import type { Metadata } from 'next'

import { exigirAdmin } from '@/features/admin'
import { ProjetoFormAdminView } from '@/views/admin/ProjetoFormAdminView'

export const metadata: Metadata = { title: 'Cadastrar projeto' }

export default async function NovoProjetoPage() {
  await exigirAdmin()
  return <ProjetoFormAdminView />
}
