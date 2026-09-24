// Vocabulário da listagem: valores aceitos na URL e no banco, com o texto exibido ao cliente.
// Cada lista é a única fonte do seu tipo: acrescentar um item aqui já o libera nos filtros.
// Categoria e estilo usam o vocabulário do cadastro (`categoriasDoCadastro`/`estilosDoCadastro`,
// importado de `@/features/cadastro-projeto`) — é a mesma lista nos dois lugares.

export const ordenacoesDeProjetos = [
  { valor: 'relevancia', rotulo: 'Mais relevantes' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
  { valor: 'maior-area', rotulo: 'Maior área' },
  { valor: 'menor-area', rotulo: 'Menor área' },
] as const

export type OrdenacaoProjetos = (typeof ordenacoesDeProjetos)[number]['valor']

/** Opções dos filtros "N ou mais". */
export const opcoesDeQuantidade = {
  quartos: [1, 2, 3, 4, 5],
  suites: [1, 2, 3, 4],
  suiteMaster: [1, 2, 3],
  banheiros: [1, 2, 3, 4, 5],
  lavabo: [1, 2],
  vagas: [1, 2, 3, 4],
  pavimentos: [1, 2, 3, 4],
} as const
