import type { Metadata } from 'next'

import { lerParametrosAdminProdutos } from '@/features/produtos-cadastro'
import { ProdutosAdminView } from '@/views/admin/ProdutosAdminView'

export const metadata: Metadata = { title: 'Produtos' }

type ProdutosAdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProdutosAdminPage({ searchParams }: ProdutosAdminPageProps) {
  const brutos = await searchParams
  const params = lerParametrosAdminProdutos(brutos)
  return <ProdutosAdminView params={params} salvo={brutos.salvo === '1'} />
}
