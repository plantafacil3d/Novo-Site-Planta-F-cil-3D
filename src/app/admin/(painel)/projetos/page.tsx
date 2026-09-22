import type { Metadata } from 'next'

import { lerParametrosAdminProjetos } from '@/features/admin'
import { ProjetosAdminView } from '@/views/admin/ProjetosAdminView'

export const metadata: Metadata = { title: 'Projetos' }

type ProjetosAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProjetosAdminPage({ searchParams }: ProjetosAdminPageProps) {
  const brutos = await searchParams
  const params = lerParametrosAdminProjetos(brutos)
  // Fora do schema de paginação/busca de propósito: não deve "grudar" nos links de página/busca.
  const salvo = brutos.salvo === '1'
  return <ProjetosAdminView params={params} salvo={salvo} />
}
