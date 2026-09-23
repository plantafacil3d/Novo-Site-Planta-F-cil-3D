import type { Metadata } from 'next'

import { lerParametrosAdminBiblioteca } from '@/features/biblioteca-exemplos'
import { BibliotecaAdminView } from '@/views/admin/BibliotecaAdminView'

export const metadata: Metadata = { title: 'Biblioteca' }

type BibliotecaAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BibliotecaAdminPage({ searchParams }: BibliotecaAdminPageProps) {
  const brutos = await searchParams
  const params = lerParametrosAdminBiblioteca(brutos)
  return <BibliotecaAdminView params={params} />
}
