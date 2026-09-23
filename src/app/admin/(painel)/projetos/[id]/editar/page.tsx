import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { exigirAdmin } from '@/features/admin'
import { buscarProjetoParaEditar } from '@/features/cadastro-projeto'
import { ProjetoFormAdminView } from '@/views/admin/ProjetoFormAdminView'

export const metadata: Metadata = { title: 'Editar projeto' }

type EditarProjetoPageProps = { params: Promise<{ id: string }> }

const schemaId = z.uuid()

export default async function EditarProjetoPage({ params }: EditarProjetoPageProps) {
  await exigirAdmin()

  // O `id` vem da URL, entrada não confiável (skill `seguranca` §5): valida antes de usar.
  const idValido = schemaId.safeParse((await params).id)
  if (!idValido.success) notFound()

  const projeto = await buscarProjetoParaEditar(idValido.data)
  if (!projeto) notFound()

  return (
    <ProjetoFormAdminView
      projetoId={idValido.data}
      projetoInicial={projeto.dados}
      slugAtual={projeto.slug}
    />
  )
}
