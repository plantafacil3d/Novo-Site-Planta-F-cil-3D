import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { exigirAdmin } from '@/features/admin'
import { dadosDeProjetoNovo } from '@/features/cadastro-projeto'
import { ProjetoFormAdminView } from '@/views/admin/ProjetoFormAdminView'

export const metadata: Metadata = { title: 'Cadastrar projeto' }

export default async function NovoProjetoPage() {
  await exigirAdmin()
  const projetoInicial = await dadosDeProjetoNovo()
  if (!projetoInicial) notFound()
  return <ProjetoFormAdminView projetoInicial={projetoInicial} />
}
