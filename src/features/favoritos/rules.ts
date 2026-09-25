import type { Projeto } from '@/features/projetos'

/** Reordena o resumo dos projetos (que veio sem ordem garantida) pela ordem dos ids favoritados. */
export function ordenarPorIds(projetos: Projeto[], ids: string[]): Projeto[] {
  const posicao = new Map(ids.map((id, indice) => [id, indice]))
  return [...projetos].sort((a, b) => (posicao.get(a.id) ?? 0) - (posicao.get(b.id) ?? 0))
}

/** Quantos projetos favoritados podem entrar na comparação lado a lado ao mesmo tempo. */
export const COMPARACAO_MAXIMO = 3

/** Marca/desmarca um projeto na seleção de comparação, respeitando o limite. */
export function alternarSelecaoComparacao(selecionados: string[], projetoId: string): string[] {
  if (selecionados.includes(projetoId)) return selecionados.filter((id) => id !== projetoId)
  if (selecionados.length >= COMPARACAO_MAXIMO) return selecionados
  return [...selecionados, projetoId]
}
