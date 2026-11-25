'use client'

import { useQuery } from '@tanstack/react-query'

import { carregarProdutoParaEditar } from '../actions'

/** Dados atuais do produto para o formulário de edição (`null` = produto novo, não consulta). */
export function useProdutoParaEditar(produtoId: string | null) {
  return useQuery({
    queryKey: ['cadastro-produto', 'editar', produtoId],
    queryFn: async () => {
      const resultado = await carregarProdutoParaEditar(produtoId)
      if (!resultado.ok) throw new Error(resultado.mensagem)
      return resultado.produto
    },
    enabled: produtoId !== null,
    // Sempre os dados de agora: o produto pode ter mudado em outra tela.
    staleTime: 0,
    gcTime: 0,
  })
}
