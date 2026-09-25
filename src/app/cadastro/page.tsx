import type { Metadata } from 'next'

import { levarLogadoParaDestino, mensagemErroLogin } from '@/features/conta'
import { ContaEntradaView } from '@/views/conta/ContaEntradaView'

export const metadata: Metadata = { title: 'Cadastro' }

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string | string[] }>
}) {
  await levarLogadoParaDestino()
  const { erro } = await searchParams
  return (
    <ContaEntradaView
      variante="cadastro"
      erro={mensagemErroLogin(typeof erro === 'string' ? erro : undefined)}
    />
  )
}
