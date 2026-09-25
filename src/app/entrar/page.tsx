import type { Metadata } from 'next'

import { levarLogadoParaDestino, mensagemErroLogin } from '@/features/conta'
import { ContaEntradaView } from '@/views/conta/ContaEntradaView'

export const metadata: Metadata = { title: 'Entrar' }

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string | string[] }>
}) {
  await levarLogadoParaDestino()
  const { erro } = await searchParams
  return (
    <ContaEntradaView
      variante="entrar"
      erro={mensagemErroLogin(typeof erro === 'string' ? erro : undefined)}
    />
  )
}
