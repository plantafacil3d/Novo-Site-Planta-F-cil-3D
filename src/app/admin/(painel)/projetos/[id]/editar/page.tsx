import type { Metadata } from 'next'

import { carregarProjetoAdmin } from '@/features/admin'
import { ProjetoFormAdminView } from '@/views/admin/ProjetoFormAdminView'

export const metadata: Metadata = { title: 'Editar projeto' }

type EditarProjetoPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditarProjetoPage({ params, searchParams }: EditarProjetoPageProps) {
  const { id } = await params
  const projeto = await carregarProjetoAdmin(id)
  const { criado } = await searchParams
  return <ProjetoFormAdminView projeto={projeto} recemCriado={criado === '1'} />
}
