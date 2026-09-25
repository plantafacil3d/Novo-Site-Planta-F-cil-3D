'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { alternarFavorito, type ResultadoAlternarFavorito } from '../actions'

const CHAVE_IDS = ['favoritos', 'ids'] as const

type Variaveis = { projetoId: string; proximoEstado: boolean }
type Resultado = ResultadoAlternarFavorito & Variaveis

/** Favorita/desfavorita com atualização otimista do coração; desfaz se o servidor recusar. */
export function useAlternarFavorito() {
  const queryClient = useQueryClient()

  return useMutation<Resultado, Error, Variaveis, { anterior?: string[] | null }>({
    mutationFn: async ({ projetoId, proximoEstado }) => {
      const resultado = await alternarFavorito(projetoId, proximoEstado)
      return { ...resultado, projetoId, proximoEstado }
    },
    onMutate: async ({ projetoId, proximoEstado }) => {
      await queryClient.cancelQueries({ queryKey: CHAVE_IDS })
      const anterior = queryClient.getQueryData<string[] | null>(CHAVE_IDS)
      queryClient.setQueryData<string[] | null>(CHAVE_IDS, (atual) =>
        !atual ? atual : proximoEstado ? [...atual, projetoId] : atual.filter((id) => id !== projetoId),
      )
      return { anterior }
    },
    onError: (_erro, _variaveis, contexto) => {
      if (contexto) queryClient.setQueryData(CHAVE_IDS, contexto.anterior)
    },
    onSuccess: (resultado) => {
      // O servidor recusou (sem sessão, id inválido...): desfaz a atualização otimista.
      if (!resultado.ok) {
        queryClient.setQueryData<string[] | null>(CHAVE_IDS, (atual) =>
          !atual
            ? atual
            : resultado.proximoEstado
              ? atual.filter((id) => id !== resultado.projetoId)
              : [...atual, resultado.projetoId],
        )
      }
    },
  })
}
