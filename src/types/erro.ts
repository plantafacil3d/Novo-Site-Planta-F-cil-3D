export type CodigoDeErro =
  | 'nao_autenticado'
  | 'sem_permissao'
  | 'credenciais_invalidas'
  | 'dados_invalidos'
  | 'conflito'
  | 'falha_inesperada'

/** Único tipo de erro que a UI e os hooks conhecem; os adapters traduzem o erro do fornecedor para ele. */
export class AppError extends Error {
  constructor(
    readonly code: CodigoDeErro,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
