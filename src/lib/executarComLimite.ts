/** Roda `tarefa` para cada item de `itens`, no máximo `limite` de cada vez. */
export async function executarComLimite<T, R>(
  itens: readonly T[],
  limite: number,
  tarefa: (item: T, indice: number) => Promise<R>,
): Promise<R[]> {
  const resultados: R[] = new Array(itens.length)
  let proximo = 0
  async function worker() {
    while (proximo < itens.length) {
      const indice = proximo++
      // `indice` sempre é uma posição válida: o `while` só avança enquanto houver itens.
      resultados[indice] = await tarefa(itens[indice] as T, indice)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, worker))
  return resultados
}
