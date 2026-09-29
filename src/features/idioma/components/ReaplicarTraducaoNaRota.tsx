'use client'

import { useReaplicarTraducaoNaRota } from '../hooks/useReaplicarTraducaoNaRota'

/** Sem UI: só mantém a tradução escolhida ativa depois de cada troca de rota. */
export function ReaplicarTraducaoNaRota() {
  useReaplicarTraducaoNaRota()
  return null
}
