import type { Metadata } from 'next'

import { levarLogadoParaDestino } from '@/features/conta'
import { EntrarView } from '@/views/EntrarView'

// Tela de conta: fora do Google. Lê cookies, então nunca vai para cache compartilhado.
export const metadata: Metadata = {
  title: 'Entrar ou cadastrar',
  robots: { index: false, follow: true },
}

export default async function EntrarPage() {
  await levarLogadoParaDestino()
  return <EntrarView />
}
