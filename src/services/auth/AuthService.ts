export type UsuarioLogado = {
  id: string
  email: string
  /** Vem do servidor (tabela `administradores`), nunca de dado que o usuário possa alterar. */
  ehAdmin: boolean
}

export interface AuthService {
  /** Lança `AppError` (`credenciais_invalidas`) quando e-mail ou senha não conferem. */
  entrar(email: string, senha: string): Promise<UsuarioLogado>
  sair(): Promise<void>
  /** `null` sem sessão válida. A sessão é conferida no servidor de autenticação, não só no cookie. */
  usuarioAtual(): Promise<UsuarioLogado | null>
}
