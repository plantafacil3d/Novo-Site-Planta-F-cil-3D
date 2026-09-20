/** Configuração pública do Supabase (URL e chave publishable). Nunca a service_role. */
export function lerConfigSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !chave) {
    throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
  }
  return { url, chave }
}
