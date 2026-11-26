import type { EnvioAutorizado } from '@/types/envio'

import type { OrigemProduto, TipoDeOpcao } from './catalogo'

/** Uma categoria ou um ambiente cadastrado no painel. `produtos`: quantos produtos a usam. */
export type OpcaoDoProduto = { id: string; tipo: TipoDeOpcao; nome: string; produtos: number }

/** Todas as opções, já em ordem alfabética. */
export type OpcoesDoProduto = { categorias: OpcaoDoProduto[]; ambientes: OpcaoDoProduto[] }

/** Um produto como as listas do cadastro mostram (tabela do painel e aba Produtos). */
export type ProdutoLigado = {
  id: string
  nome: string
  fotoUrl: string
  categoria: string
  ambientes: string[]
  ativo: boolean
  /** Em quantos projetos o produto aparece. */
  projetos: number
}

/** Linha da tabela do menu Produtos. */
export type LinhaProdutoAdmin = ProdutoLigado & {
  origem: OrigemProduto
  link: string
  emTodosProjetos: boolean
}

/** Projeto no "Aparece nos projetos" do formulário. */
export type ProjetoParaLigar = {
  id: string
  /** "Código do projeto"; sem ele, o PF-xxxx automático. */
  codigo: string
  titulo: string
  publicado: boolean
}

/** O que o formulário carrega para editar um produto. */
export type ProdutoParaEditar = {
  id: string
  nome: string
  link: string
  categoria: string
  ambientes: string[]
  origem: OrigemProduto
  ativo: boolean
  /** Entra em todos os projetos, inclusive nos cadastrados depois. */
  emTodosProjetos: boolean
  foto: { caminho: string; url: string }
  projetos: ProjetoParaLigar[]
}

/** O produto pronto para o banco (já validado). */
export type ProdutoGravavel = {
  nome: string
  link: string
  categoria: string
  ambientes: string[]
  origem: OrigemProduto
  ativo: boolean
  emTodosProjetos: boolean
  fotoCaminho: string
}

export type ConsultaProdutosAdmin = {
  busca?: string
  pagina: number
  porPagina: number
}

export type ParametrosAdminProdutos = { q?: string; pagina: number }

/** Resposta das ações do cadastro. `duplicado`: o link já existe neste produto. */
export type ResultadoProduto<T extends object = object> =
  ({ ok: true; mensagem: string } & T) | { ok: false; mensagem: string; duplicado?: ProdutoLigado }

/** O que o "Preencher" achou no link. A foto vem em base64 e a tela a envia como as outras. */
export type DadosDoLink = {
  nome: string | null
  foto: { base64: string; tipo: string } | null
}

/** Autorização para o navegador enviar a foto, e onde ela vai ficar. */
export type FotoAutorizada = { envio: EnvioAutorizado; caminho: string }
