import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { lerConfigSupabase } from './ambiente'

/**
 * Renova a sessão (cookies) a cada requisição do painel, para o login não expirar no meio do uso.
 * Não decide quem pode entrar: isso é feito no servidor de cada página e ação, e pelo banco (RLS).
 */
export async function renovarSessao(request: NextRequest) {
  const { url, chave } = lerConfigSupabase()
  let resposta = NextResponse.next({ request })

  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value))
        resposta = NextResponse.next({ request })
        lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options))
      },
    },
  })

  await supabase.auth.getUser()
  return resposta
}
