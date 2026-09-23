/** Quem pode ler o arquivo: o público (imagens do site) ou só quem recebe um link temporário. */
export type AcessoDoArquivo = 'publico' | 'privado' | 'biblioteca'

/** Onde um arquivo fica no Storage: o acesso decide o bucket e o caminho é só o path dentro dele. */
export type DestinoDeArquivo = {
  acesso: AcessoDoArquivo
  caminho: string
}

/** Autorização, dada pelo servidor, para o navegador enviar um arquivo direto ao Storage. */
export type EnvioAutorizado = DestinoDeArquivo & {
  /** Vale só para este caminho e por tempo limitado. */
  token: string
  tipoDoConteudo: string
}
