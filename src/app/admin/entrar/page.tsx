import type { Metadata } from 'next'

import { levarLogadoParaDestino, mensagemErroLogin } from '@/features/conta'
import { LoginAdminView } from '@/views/admin/LoginAdminView'

export const metadata: Metadata = { title: 'Entrar' }

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string | string[] }>
}) {
  await levarLogadoParaDestino()
  const { erro } = await searchParams
  return <LoginAdminView erro={mensagemErroLogin(typeof erro === 'string' ? erro : undefined)} />
}
