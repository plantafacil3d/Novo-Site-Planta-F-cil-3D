/** Um arquivo da biblioteca, como a tela de listagem do admin mostra (com o uso em projetos). */
export type ArquivoDaBiblioteca = {
  id: string
  caminho: string
  nomeOriginal: string
  tipoMime: string
  tamanhoBytes: number
  /** Data ISO. */
  criadoEm: string
  /** Em quantos projetos este arquivo está vinculado agora — usado no aviso antes de excluir. */
  vinculos: number
}

/** `ArquivoDaBiblioteca` com a URL pública resolvida (skill `arquitetura` §3: o repository nunca
 *  grava/resolve URL, quem faz isso é o `fileStorage`) — o que a tabela do admin usa para o link de
 *  baixar. Montado em `queries.ts`, nunca dentro do repository. */
export type LinhaDaBibliotecaAdmin = ArquivoDaBiblioteca & { url: string }

/** Item leve da biblioteca, para os checkboxes da aba "Arquivos de Exemplo" do cadastro de projeto. */
export type ArquivoParaSelecao = {
  id: string
  nomeOriginal: string
  tipoMime: string
  tamanhoBytes: number
}

export type ConsultaBiblioteca = {
  /** Nome do arquivo; todas as palavras precisam aparecer. */
  busca?: string
  pagina: number
  porPagina: number
}

/** Estado da listagem como chega pela URL, já validado. */
export type ParametrosAdminBiblioteca = {
  q?: string
  pagina: number
}

/** Arquivo pronto para gravar, já conferido no servidor (extensão, tamanho e conteúdo real). */
export type NovoArquivoDaBiblioteca = {
  id: string
  caminho: string
  nomeOriginal: string
  tipoMime: string
  tamanhoBytes: number
}

/** Só o que a exclusão precisa saber de um arquivo apagado, para limpar o Storage depois. */
export type ArquivoApagado = { id: string; caminho: string }

export type ResultadoDaBiblioteca = { ok: true; mensagem: string } | { ok: false; mensagem: string }

/** Resposta de uma ação: ou deu certo (com o que ela devolve) ou vem a mensagem do problema. */
export type ResultadoOperacao<T extends object = object> =
  ({ ok: true; mensagem: string } & T) | { ok: false; mensagem: string }

/** Resultado de UM item dentro de um lote (upload em massa): mesmo formato, com o id do item. */
export type ResultadoDoItem<T extends object = object> = { id: string } & ResultadoOperacao<T>
