'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { criarOpcaoDoProduto, excluirOpcaoDoProduto, listarOpcoesDoProduto } from '../actions'
import type { TipoDeOpcao } from '../catalogo'
import type { OpcoesDoProduto } from '../types'

const CHAVE = ['cadastro-produto', 'opcoes'] as const

/**
 * Categorias e ambientes cadastrados, com criar e apagar. Todas as telas que usam (formulário de
 * produto e "Categorias e ambientes") compartilham a mesma lista: criou em uma, aparece na outra.
 */
export function useOpcoesDoProduto() {
  const cliente = useQueryClient()

  const consulta = useQuery({
    queryKey: CHAVE,
    queryFn: async (): Promise<OpcoesDoProduto> => {
      const resultado = await listarOpcoesDoProduto()
      if (!resultado.ok) throw new Error(resultado.mensagem)
      return resultado.opcoes
    },
  })

  const criar = useMutation({
    mutationFn: async ({ tipo, nome }: { tipo: TipoDeOpcao; nome: string }) => {
      const resultado = await criarOpcaoDoProduto({ tipo, nome })
      if (!resultado.ok) throw new Error(resultado.mensagem)
      return resultado.opcao
    },
    onSuccess: () => cliente.invalidateQueries({ queryKey: CHAVE }),
  })

  const excluir = useMutation({
    mutationFn: async (id: string) => {
      const resultado = await excluirOpcaoDoProduto(id)
      if (!resultado.ok) throw new Error(resultado.mensagem)
    },
    onSuccess: () => cliente.invalidateQueries({ queryKey: CHAVE }),
  })

  return { consulta, criar, excluir }
}
