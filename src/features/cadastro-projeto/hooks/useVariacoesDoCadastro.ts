'use client'

import { useQuery } from '@tanstack/react-query'

import { useValorComAtraso } from '@/hooks/useValorComAtraso'

import { buscarProjetosParaVariacao, listarVariacoesAutomaticas } from '../actions'
import { LIMITES } from '../rules'
import type { ProjetoVinculado, ResultadoCadastro } from '../types'

/** Erro da ação vira erro da consulta (a tela mostra a mensagem). */
function projetosOuErro(
  resultado: ResultadoCadastro<{ projetos: ProjetoVinculado[] }>,
): ProjetoVinculado[] {
  if (!resultado.ok) throw new Error(resultado.mensagem)
  return resultado.projetos
}

/**
 * Projetos de mesmo "Código do projeto" (variações automáticas), pelo código como está digitado
 * na aba 1. Sem código, não consulta nada.
 */
export function useVariacoesAutomaticas(codigo: string, projetoId: string | null) {
  const codigoAtrasado = useValorComAtraso(codigo.trim().toUpperCase())
  const consulta = useQuery({
    queryKey: ['cadastro', 'variacoes-automaticas', codigoAtrasado, projetoId],
    queryFn: async () =>
      projetosOuErro(await listarVariacoesAutomaticas(codigoAtrasado, projetoId)),
    enabled: codigoAtrasado !== '',
  })
  return { ...consulta, codigo: codigoAtrasado }
}

/** Busca ao vivo por nome ou código, a partir de 2 letras, depois que a pessoa para de digitar. */
export function useBuscaDeProjetos(texto: string) {
  const textoAtrasado = useValorComAtraso(texto.trim())
  const ativa = textoAtrasado.length >= LIMITES.buscaDeVariacoesMin
  const consulta = useQuery({
    // O texto na chave descarta a resposta de uma busca antiga que chegue atrasada.
    queryKey: ['cadastro', 'busca-de-variacoes', textoAtrasado],
    queryFn: async () => projetosOuErro(await buscarProjetosParaVariacao(textoAtrasado)),
    enabled: ativa,
  })
  return { ...consulta, ativa }
}
