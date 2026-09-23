import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { lerConfigSupabase } from './ambiente'

/**
 * Client do Supabase para leituras públicas do site (sem sessão de usuário). Ao contrário de
 * `criarClienteServidor`, não depende de `cookies()` — funciona também em `generateStaticParams`
 * e em outros contextos de build, que rodam sem requisição HTTP.
 */
export function criarClientePublico() {
  const { url, chave } = lerConfigSupabase()
  return createClient(url, chave)
}
