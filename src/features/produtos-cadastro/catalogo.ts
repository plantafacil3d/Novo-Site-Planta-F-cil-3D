// Lista fixa do cadastro de produtos. Categorias e ambientes NÃO ficam aqui: o administrador os
// cria e apaga pelo painel (tabela `produto_opcoes`), e o produto guarda o nome da opção.

export const origensDeProduto = [
  { valor: 'afiliado', rotulo: 'Afiliado' },
  { valor: 'proprio', rotulo: 'Próprio' },
] as const

export type OrigemProduto = (typeof origensDeProduto)[number]['valor']

/** Os dois tipos de opção que o administrador cadastra. */
export const tiposDeOpcao = [
  { valor: 'categoria', rotulo: 'Categorias', singular: 'categoria' },
  { valor: 'ambiente', rotulo: 'Ambientes', singular: 'ambiente' },
] as const

export type TipoDeOpcao = (typeof tiposDeOpcao)[number]['valor']
