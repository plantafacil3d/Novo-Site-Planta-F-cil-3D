// API pública do cadastro de produtos. Tudo aqui pode ser importado por componentes do navegador:
// nada de código só de servidor (as ações `'use server'` viram chamadas ao servidor no navegador).
// As leituras do site e da tabela do painel ficam na feature `produtos`.

export { CadastroDeProduto } from './components/CadastroDeProduto'
export { ProdutosDoProjeto } from './components/ProdutosDoProjeto'
export { TabelaProdutosAdmin } from './components/TabelaProdutosAdmin'
export { origensDeProduto, tiposDeOpcao } from './catalogo'
export type { OrigemProduto, TipoDeOpcao } from './catalogo'
export {
  LIMITES_PRODUTO,
  TAG_PRODUTOS,
  descreverListagemAdmin,
  montarHrefAdminProdutos,
  ordenarAmbientes,
  ordenarNomes,
} from './rules'
export { lerParametrosAdminProdutos, schemaProdutosDoProjeto } from './schemas'
export type {
  ConsultaProdutosAdmin,
  LinhaProdutoAdmin,
  OpcaoDoProduto,
  OpcoesDoProduto,
  ParametrosAdminProdutos,
  ProdutoGravavel,
  ProdutoLigado,
  ProdutoParaEditar,
  ProjetoParaLigar,
} from './types'
