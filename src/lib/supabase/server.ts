import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { lerConfigSupabase } from './ambiente'

/** Client do Supabase para Server Components, Server Actions e Route Handlers (sessão por cookies). */
export async function criarClienteServidor() {
  const { url, chave } = lerConfigSupabase()
  const armazem = await cookies()

  return createServerClient(url, chave, {
    cookies: {
      getAll: () => armazem.getAll(),
      setAll(lista) {
        // Em Server Components os cookies são somente leitura; quem renova a sessão é o proxy.
        try {
          lista.forEach(({ name, value, options }) => armazem.set(name, value, options))
        } catch {}
      },
    },
  })
}
