import { createBrowserClient } from '@supabase/ssr'

import { lerConfigSupabase } from './ambiente'

/**
 * Client do Supabase para o navegador. Só usa a chave pública: quem autoriza cada envio de arquivo
 * é o servidor (URL assinada), e o banco (RLS e policies do Storage) confere de novo.
 */
export function criarClienteNavegador() {
  const { url, chave } = lerConfigSupabase()
  return createBrowserClient(url, chave)
}
