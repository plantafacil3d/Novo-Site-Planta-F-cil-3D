import type { Metadata } from 'next'

import { lerParametrosAdminProjetos } from '@/features/admin'
import { ProjetosAdminView } from '@/views/admin/ProjetosAdminView'

export const metadata: Metadata = { title: 'Projetos' }

type ProjetosAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProjetosAdminPage({ searchParams }: ProjetosAdminPageProps) {
  const params = lerParametrosAdminProjetos(await searchParams)
  return <ProjetosAdminView params={params} />
}
