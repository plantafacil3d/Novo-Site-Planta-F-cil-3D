'use client'

import { useQuery } from '@tanstack/react-query'

/** `null` = sem sessão (ou a resposta falhou); nunca lança, o coração some sozinho nesse caso. */
async function buscarIdsFavoritados(): Promise<string[] | null> {
  const resposta = await fetch('/favoritos/ids', { cache: 'no-store' })
  if (!resposta.ok) return null
  const dados = (await resposta.json()) as { ids: string[] | null }
  return dados.ids
}

/**
 * Ids favoritados do usuário logado, buscados uma única vez e compartilhados por todos os
 * corações da página (mesmo em telas estáticas como a vitrine): evita um `fetch` por card.
 */
export function useFavoritoIds() {
  return useQuery({ queryKey: ['favoritos', 'ids'], queryFn: buscarIdsFavoritados })
}
