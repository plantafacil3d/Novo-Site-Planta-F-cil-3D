import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { exigirAdmin } from '@/features/admin'
import { buscarProdutoParaEditar } from '@/features/produtos'
import { ProdutoFormAdminView } from '@/views/admin/ProdutoFormAdminView'

export const metadata: Metadata = { title: 'Editar produto' }

type EditarProdutoPageProps = { params: Promise<{ id: string }> }

const schemaId = z.uuid()

export default async function EditarProdutoPage({ params }: EditarProdutoPageProps) {
  await exigirAdmin()

  // O `id` vem da URL, entrada não confiável (skill `seguranca` §5): valida antes de usar.
  const idValido = schemaId.safeParse((await params).id)
  if (!idValido.success) notFound()

  const produto = await buscarProdutoParaEditar(idValido.data)
  if (!produto) notFound()

  return <ProdutoFormAdminView produto={produto} />
}
