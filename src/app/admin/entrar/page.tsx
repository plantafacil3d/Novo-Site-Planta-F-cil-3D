import type { Metadata } from 'next'

import { levarLogadoParaDestino } from '@/features/conta'
import { LoginAdminView } from '@/views/admin/LoginAdminView'

export const metadata: Metadata = { title: 'Entrar' }

export default async function EntrarPage() {
  await levarLogadoParaDestino()
  return <LoginAdminView />
}
