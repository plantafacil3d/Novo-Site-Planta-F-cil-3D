import type { Metadata } from 'next'

import { exigirAdmin } from '@/features/admin'
import { ProdutoFormAdminView } from '@/views/admin/ProdutoFormAdminView'

export const metadata: Metadata = { title: 'Cadastrar produto' }

export default async function NovoProdutoPage() {
  await exigirAdmin()
  return <ProdutoFormAdminView />
}
