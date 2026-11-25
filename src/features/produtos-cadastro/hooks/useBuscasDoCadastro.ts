'use client'

import { useQuery } from '@tanstack/react-query'

import { useValorComAtraso } from '@/hooks/useValorComAtraso'

import { buscarProdutosParaLigar, buscarProjetosParaLigar } from '../actions'
import { LIMITES_PRODUTO } from '../rules'

/**
 * Busca ao vivo, a partir de 2 letras, depois que a pessoa para de digitar (skill `arquitetura`
 * §3.1). O texto na chave descarta a resposta de uma busca antiga que chegue atrasada.
 */
function useBuscaAoVivo<T>(chave: string, texto: string, buscar: (texto: string) => Promise<T>) {
  const textoAtrasado = useValorComAtraso(texto.trim())
  const ativa = textoAtrasado.length >= LIMITES_PRODUTO.buscaMin
  const consulta = useQuery({
    queryKey: ['cadastro-produto', chave, textoAtrasado],
    queryFn: () => buscar(textoAtrasado),
    enabled: ativa,
  })
  return { ...consulta, ativa }
}

/** "Adicionar produto" da aba Produtos. */
export function useBuscaDeProdutos(texto: string) {
  return useBuscaAoVivo('busca-de-produtos', texto, async (valor) => {
    const resultado = await buscarProdutosParaLigar(valor)
    if (!resultado.ok) throw new Error(resultado.mensagem)
    return resultado.produtos
  })
}

/** "Aparece nos projetos" do formulário de produto. */
export function useBuscaDeProjetosParaProduto(texto: string) {
  return useBuscaAoVivo('busca-de-projetos', texto, async (valor) => {
    const resultado = await buscarProjetosParaLigar(valor)
    if (!resultado.ok) throw new Error(resultado.mensagem)
    return resultado.projetos
  })
}
